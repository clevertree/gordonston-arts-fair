import dotenv from 'dotenv';
import {list} from '@vercel/blob';
import {ensureDatabase} from '@util/database';
import {UserFileUploadModel} from '@util/models';

// Load env vars from .env then .env.local (local overrides)
dotenv.config({path: ['.env', '.env.local', '../.env', '../.env.local'], override: true});

/**
 * Audit Vercel Blob storage against PostgreSQL records for uploaded user images.
 *
 * Features:
 * - Lists all blobs under `uploads/` and groups them by user id (first path segment after `uploads/`).
 * - Cross-references each user's blobs with rows in `user_file_uploads`.
 * - Reports:
 *    • Blobs that exist in storage but have NO corresponding DB row (by URL path).
 *    • DB rows whose blob no longer exists in storage.
 * - When --commit is provided, missing DB rows will be INSERTED automatically.
 * - Optional --user=<id> flag to scope to a single user's folder in blob storage and DB queries.
 *
 * Matching rule:
 * - We normalize both the blob's URL and the DB's `url` to their pathname (without the leading '/'),
 *   e.g., `uploads/123/800-600/image.jpg`.
 *
 * Usage examples:
 * - tsx scripts/audit-blobs.ts --commit
 * - tsx scripts/audit-blobs.ts --id=123 --commit
 * - tsx scripts/audit-blobs.ts --id 123
 * - tsx scripts/audit-blobs.ts -id 123
 * - npm run audit:blobs -- --id 149
 */

interface CLIOptions {
    userId?: number;
    commit: boolean;
}

function parseArgs(argv: string[]): CLIOptions {
    const opts: CLIOptions = {commit: false};
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--commit') {
            opts.commit = true;
        } else if (a.startsWith('--id=')) {
            const v = parseInt(a.split('=')[1] || '', 10);
            if (!Number.isNaN(v)) opts.userId = v;
        } else if (a === '--id') {
            const v = parseInt(argv[i + 1] || '', 10);
            if (!Number.isNaN(v)) opts.userId = v;
            i++;
        } else if (a === '-id') {
            const v = parseInt(argv[i + 1] || '', 10);
            if (!Number.isNaN(v)) opts.userId = v;
            i++;
        } else if (a.startsWith('-id=')) {
            const v = parseInt(a.split('=')[1] || '', 10);
            if (!Number.isNaN(v)) opts.userId = v;
        }
    }
    return opts;
}

function decodePathname(pathname: string): string {
    const noLead = pathname.replace(/^\//, '');
    const parts = noLead.split('/').map(seg => {
        try {
            return decodeURIComponent(seg);
        } catch {
            return seg;
        }
    });
    return parts.join('/');
}

function normalizePathFromUrl(url: string): string | null {
    try {
        const u = new URL(url);
        const p = decodePathname(u.pathname);
        return p || null;
    } catch {
        // if it's already a path-like string
        return decodePathname(url) || null;
    }
}

function parseUserIdFromPathname(pathname: string): number | null {
    // Expecting: uploads/<userId>/...
    const parts = pathname.split('/');
    if (parts.length < 2) return null;
    if (parts[0] !== 'uploads') return null;
    const id = parseInt(parts[1], 10);
    return Number.isFinite(id) ? id : null;
}

function parseDimensionsFromPathname(pathname: string): { width?: number; height?: number; filename?: string } {
    // Expecting: uploads/<userId>/<width>-<height>/<filename>
    const parts = pathname.split('/');
    // parts[0]=uploads, [1]=userId, [2]=width-height, [3..]=filename path (usually 1 segment)
    if (parts.length >= 4) {
        const wh = parts[2];
        const [wStr, hStr] = (wh || '').split('-');
        const width = parseInt(wStr, 10);
        const height = parseInt(hStr, 10);
        const filename = parts.slice(3).join('/');
        return {
            width: Number.isFinite(width) ? width : undefined,
            height: Number.isFinite(height) ? height : undefined,
            filename,
        };
    }
    return {};
}

async function listBlobsUnder(prefix?: string): Promise<Array<{
    pathname: string;
    url?: string;
    downloadUrl?: string;
}>> {
    type ListResult = {
        blobs: Array<{ pathname?: string; url?: string; downloadUrl?: string }>;
        cursor?: string;
        hasMore: boolean;
    };
    const results: Array<{ pathname: string; url?: string; downloadUrl?: string }> = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;
    while (hasMore) {
        const page: ListResult = await list({ cursor, prefix } as any);
        for (const b of page.blobs) {
            if (!b.pathname) continue;
            results.push({ pathname: b.pathname, url: (b as any).url, downloadUrl: (b as any).downloadUrl });
        }
        cursor = page.cursor;
        hasMore = page.hasMore;
    }
    return results;
}

async function main() {
    const {userId, commit} = parseArgs(process.argv);

    // Initialize database
    await ensureDatabase();

    const prefix = userId != null ? `uploads/${userId}/` : undefined;
    const blobs = await listBlobsUnder(prefix);

    // Filter to uploads/ only (in case bucket has other paths)
    const uploadBlobs = blobs.filter(b => b.pathname.startsWith('uploads/'));

    // Group blobs by user id
    const blobsByUser = new Map<number, Array<{ pathname: string; url?: string; downloadUrl?: string }>>();
    for (const b of uploadBlobs) {
        const decodedPath = decodePathname(b.pathname);
        const uid = parseUserIdFromPathname(decodedPath);
        if (uid == null) continue;
        if (userId != null && uid !== userId) continue; // safety if prefix-less listing
        const arr = blobsByUser.get(uid) || [];
        arr.push({...b, pathname: decodedPath});
        blobsByUser.set(uid, arr);
    }

    if (blobsByUser.size === 0) {
        console.log(userId != null
            ? `No blobs found under uploads/${userId}/`
            : 'No blobs found under uploads/');
        return;
    }

    let totalMissingInDb = 0;
    let totalMissingInBlob = 0;
    const insertedIds: number[] = [];

    for (const [uid, userBlobs] of blobsByUser.entries()) {
        console.log(`\n=== User ${uid} ===`);
        // Fetch DB rows for this user
        const rows = await UserFileUploadModel.findAll({where: {user_id: uid}});

        // Build set of normalized pathnames from DB URLs
        const dbPathSet = new Set<string>();
        const dbByPath = new Map<string, typeof rows[number]>();
        for (const r of rows) {
            const p = normalizePathFromUrl(r.url);
            if (p) {
                dbPathSet.add(p);
                dbByPath.set(p, r);
            }
        }

        // Build set of blob paths and a lookup
        const blobPathSet = new Set<string>();
        const blobByPath = new Map<string, { pathname: string; url?: string; downloadUrl?: string }>();
        for (const b of userBlobs) {
            const p = b.pathname.replace(/^\//, '');
            blobPathSet.add(p);
            blobByPath.set(p, b);
        }

        // Blobs missing in DB
        const missingInDb: string[] = [];
        for (const p of blobPathSet) {
            if (!dbPathSet.has(p)) missingInDb.push(p);
        }

        // DB rows whose blob missing in storage
        const missingInBlob: string[] = [];
        for (const p of dbPathSet) {
            if (!blobPathSet.has(p)) missingInBlob.push(p);
        }

        if (missingInDb.length === 0 && missingInBlob.length === 0) {
            console.log('No discrepancies found.');
            continue;
        }

        if (missingInDb.length) {
            totalMissingInDb += missingInDb.length;
            console.log(`Blobs present in storage but NOT in DB (${missingInDb.length}):`);
            for (const p of missingInDb) console.log(`  + ${p}`);

            if (commit) {
                console.log('Inserting missing blobs into DB...');
                for (const p of missingInDb) {
                    try {
                        const b = blobByPath.get(p)!;
                        const dims = parseDimensionsFromPathname(p);
                        const title = decodeURIComponent(dims.filename || p.split('/').pop() || 'Untitled');
                        const width = dims.width ?? 0;
                        const height = dims.height ?? 0;
                        const url = b.url || b.downloadUrl || `/${p}`; // fallbacks

                        const created = await UserFileUploadModel.create({
                            user_id: uid,
                            title,
                            description: '',
                            width,
                            height,
                            url,
                            feature: false,
                        } as any);
                        insertedIds.push(created.id);
                        console.log(`  inserted id=${created.id} path=${p}`);
                    } catch (e) {
                        console.error(`  failed to insert for path=${p}:`, e);
                    }
                }
            } else {
                console.log('(commit mode) Skipping inserts.');
            }
        }

        if (missingInBlob.length) {
            totalMissingInBlob += missingInBlob.length;
            console.log(`DB rows referencing blobs MISSING from storage (${missingInBlob.length}):`);
            for (const p of missingInBlob) {
                const row = dbByPath.get(p);
                console.log(`  - ${p}${row ? ` (db id=${row.id})` : ''}`);
            }
            console.log('Note: Reporting only; no action taken for missing blob files.');
        }
    }

    console.log('\n=== Summary ===');
    console.log(`Blobs present but not in DB: ${totalMissingInDb}`);
    console.log(`DB rows pointing to missing blobs: ${totalMissingInBlob}`);
    if (insertedIds.length) {
        console.log(`Inserted DB ids: ${insertedIds.join(', ')}`);
    }
}

// Run if executed directly
(async () => {
    try {
        await main();
    } catch (err) {
        console.error('Audit failed:', err);
        process.exitCode = 1;
    }
})();
