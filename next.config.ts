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
      // Legacy dashboard routes → mentoring / overview
      { source: '/dashboard/revenue', destination: '/dashboard', permanent: false },
      { source: '/dashboard/opportunities', destination: '/dashboard', permanent: false },
      { source: '/dashboard/my-reports', destination: '/dashboard/mentoring', permanent: false },
      { source: '/dashboard/projects/:path*', destination: '/dashboard/mentoring', permanent: false },
      { source: '/dashboard/sessions/:bookingId/report', destination: '/dashboard/mentoring/:bookingId/report', permanent: false },
      { source: '/dashboard/sessions/:bookingId', destination: '/dashboard/mentoring/:bookingId', permanent: false },
      { source: '/dashboard/sessions', destination: '/dashboard/mentoring', permanent: false },
      { source: '/dashboard/schedule/:bookingId/report', destination: '/dashboard/mentoring/:bookingId/report', permanent: false },
      { source: '/dashboard/schedule/:bookingId', destination: '/dashboard/mentoring/:bookingId', permanent: false },
      { source: '/dashboard/schedule', destination: '/dashboard/mentoring', permanent: false },
      { source: '/dashboard/bookings/:id', destination: '/dashboard/mentoring/:id', permanent: false },
    ];
  },
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'i.pravatar.cc', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
