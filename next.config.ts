import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  async headers() {
    return [
      {
        source: '/.well-known/apple-developer-merchantid-domain-association',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain; charset=utf-8',
          },
        ],
      },
    ];
  },

  compilerOptions: {
    typeRoots: ['./types', './node_modules/@types'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
