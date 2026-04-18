import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/mentor', destination: '/dashboard/packages', permanent: false },
      { source: '/mentor/:path+', destination: '/dashboard/:path+', permanent: false },
      { source: '/admin', destination: '/dashboard/admin', permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
    ],
  },
};

export default nextConfig;
