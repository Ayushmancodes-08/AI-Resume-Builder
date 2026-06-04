import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/auth/:path*',
        destination: `${backendUrl}/api/v1/auth/:path*`,
      },
      {
        source: '/api/resumes/:path*',
        destination: `${backendUrl}/api/v1/resumes/:path*`,
      },
      {
        source: '/api/export/:path*',
        destination: `${backendUrl}/api/v1/export/:path*`,
      },
      {
        source: '/api/ai/:path*',
        destination: `${backendUrl}/api/v1/ai/:path*`,
      },
    ];
  },
};

export default nextConfig;
