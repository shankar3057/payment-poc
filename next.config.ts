import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  compilerOptions: {
    typeRoots: ['./types', './node_modules/@types'],
  },
};

export default nextConfig;
