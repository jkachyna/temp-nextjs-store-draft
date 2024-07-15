/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {remotePatterns: [
        {
            protocol: 'https',
            hostname: "images.pexels.com",
        },
        {
            protocol: 'https',
            hostname: "moefvkwzdbczfmzipkaq.supabase.co",
        },
        {
            protocol: 'https',
            hostname: "img.clerk.com",
        },
    ]}
};

export default nextConfig;
