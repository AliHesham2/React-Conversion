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
    ],
  },
};

export default nextConfig;
