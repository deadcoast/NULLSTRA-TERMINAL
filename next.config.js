/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  reactStrictMode: true,

  // Configure webpack
  webpack: (config, { dev }) => {
    // Add additional webpack optimizations
    if (!dev) {
      // Enable tree shaking for better dead code elimination
      config.optimization.usedExports = true;

      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the name of the npm package
              // Safely handle case where module.context might be null
              if (!module.context) return "vendor";

              const matches = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
              );
              if (!matches || !matches[1]) return "vendor";

              // Group common packages together for better caching
              return `npm.${matches[1].replace("@", "")}`;
            },
          },
          // Common components can be grouped
          components: {
            test: /[\\/]src[\\/]components[\\/]/,
            name: "components",
            minChunks: 2,
          },
        },
      };
    }

    return config;
  },

  // Enable output compression
  compress: true,

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },

  // Transpile certain modules if needed
  transpilePackages: [],

  // Disable experimental features causing issues
  experimental: {
    optimizeCss: false, // Disable CSS optimization that requires critters
  },
};

module.exports = withBundleAnalyzer(nextConfig);
