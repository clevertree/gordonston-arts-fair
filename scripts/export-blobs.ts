import {list} from '@vercel/blob';
import {promises as fs} from 'fs';
import path from 'path';
import {config} from "dotenv";

config({path: "../.env.local"});

/**
 * Lists all blobs from Vercel Blob storage and downloads them to a local directory.
 * @param localDirectoryPath The path to the local directory where blobs will be saved.
 * @returns A Promise that resolves when all blobs have been downloaded.
 */
export async function exportVercelBlobsAsLocalFiles(localDirectoryPath: string): Promise<void> {
    try {
        // Ensure the local directory exists, create it if not
        await fs.mkdir(localDirectoryPath, {recursive: true});

        let cursor: string | undefined;
        let hasMore = true;

        while (hasMore) {
            const {
                blobs,
                hasMore: hasNextPage,
                cursor: nextCursor
            } = await list({cursor});


            for (const blob of blobs) {
                const localFilePath = path.join(localDirectoryPath, blob.pathname);
                console.log(`Downloading ${blob.pathname} to ${localFilePath}`);

                if (await fileExistsAsync(localFilePath)) {
                    console.log(`File already exist: ${blob.pathname}`);
                } else {

                    try {
                        const response = await fetch(blob.downloadUrl);
                        if (!response.ok) {
                            throw new Error(`Failed to download ${blob.pathname}: ${response.statusText}`);
                        }
                        const arrayBuffer = await response.arrayBuffer();
                        await fs.mkdir(path.dirname(localFilePath), {recursive: true});
                        await fs.writeFile(localFilePath, Buffer.from(arrayBuffer));
                        console.log(`Successfully downloaded ${blob.pathname}`);
                    } catch (downloadError) {
                        console.error(`Error downloading ${blob.pathname}:`, downloadError);
                    }
                }
            }

            cursor = nextCursor;
            hasMore = hasNextPage;
        }

        console.log('All blobs processed.');
    } catch (error) {
        console.error('Error exporting Vercel blobs:', error);
        throw error; // Re-throw the error for external handling
    }
}

// Example usage:
(async () => {
    try {
        await exportVercelBlobsAsLocalFiles('../backup/blobs');
    } catch (error) {
        console.error('Export process failed:', error);
    }
})();


async function fileExistsAsync(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath, fs.constants.F_OK); // F_OK checks for file visibility
        return true;
    } catch (error: any) {
        if (error.code === 'ENOENT') { // 'ENOENT' indicates file not found
            return false;
        }
        throw error; // Re-throw other errors
    }
}
