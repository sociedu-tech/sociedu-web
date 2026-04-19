import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/mentor', destination: '/dashboard/packages', permanent: false },
      { source: '/mentor/:path+', destination: '/dashboard/:path+', permanent: false },
      { source: '/admin', destination: '/dashboard', permanent: false },
      { source: '/dashboard/admin', destination: '/dashboard', permanent: false },
      { source: '/dashboard/stats', destination: '/dashboard', permanent: false },
      { source: '/dashboard/product-requests', destination: '/dashboard', permanent: false },
      { source: '/dashboard/update-requests', destination: '/dashboard', permanent: false },
      { source: '/dashboard/admin/:path+', destination: '/dashboard/:path+', permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },
};

export default nextConfig;
