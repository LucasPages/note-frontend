import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/login',
        has: [
          {
            type: 'cookie',
            key: 'loggedIn',
            value: 'true'
          }
        ],
        destination: '/',
        permanent: false
      },
      {
        source: '/',
        missing: [
          {
            type: 'cookie', 
            key: 'loggedIn',
            value: 'true'
          }
        ],
        destination: '/login',
        permanent: false
      }
    ];
  }
};

export default nextConfig;
