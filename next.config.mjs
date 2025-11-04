/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // allow loading images from Unsplash (used by the FoodCard demo)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        // allow original export assets hosted on S3 (used by several converted demos)
        protocol: 'https',
        hostname: 's3-us-west-2.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
