import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
   async redirects() {
    return [
      {
        source: '/cart',
        destination: '/es/cart',
        permanent: true,
      },
       {
        source: '/create-listing',
        destination: '/es/create-listing',
        permanent: true,
      },
       {
        source: '/profile',
        destination: '/es/profile',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
