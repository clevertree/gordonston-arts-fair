import generated from "@next/mdx";

/** @type {import('next').NextConfig} */
// next.config.js
const withMDX = generated({
    extension: /\.mdx?$/
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Configure `pageExtensions` to include MDX files
    pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    
    // Optionally, add any other Next.js config below
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb'
        }
    },
    images: {
        remotePatterns: [new URL('https://*.public.blob.vercel-storage.com/**')]
    }
}

export default withMDX(nextConfig)
