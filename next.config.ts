// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true, // Keep or remove based on your preference
  
  basePath: '/legislativas2025',
  assetPrefix: '/legislativas2025', // Usually same as basePath for simplicity here

  images: {
    unoptimized: true, // Essential for most cPanel/shared hosting
  },

  // Optional: If you need custom rewrites later for API or other paths,
  // but let's try without it first.
  // async rewrites() {
  //   return [
  //     {
  //       source: '/legislativas2025/api/:path*',
  //       destination: '/api/:path*', // Proxy to internal Next.js API route
  //     },
  //   ]
  // },

  // If you were using output: 'export' for a fully static site, you'd set it here.
  // But since you have API routes, you are NOT using output: 'export'.
  // output: 'standalone', // This can sometimes help with cPanel deployments by bundling node_modules,
                           // but let's try the default output first. If issues persist, 'standalone' is an option.
};

export default nextConfig;