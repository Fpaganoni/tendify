/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    /**
     * Remote patterns grant Next.js Image Optimization access to external
     * hostnames. Add every domain that serves product/category images here.
     *
     * Current sources:
     *  - ik.imagekit.io     — ImageKit CDN (used by mock products & categories)
     *  - localhost           — Local WordPress (dev environment)
     *
     * When deploying to production, add the live WordPress domain here and
     * remove the localhost entry (or scope it to process.env.NODE_ENV).
     */
    remotePatterns: [
      {
        // ImageKit CDN — all Trendify product/category images
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/p2ho5d9bi/**",
      },
      {
        // Local WordPress dev environment
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
    // Default device sizes used for srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Intermediate sizes used for <Image fill> or fixed-size images
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Best compression for photos; use "png" for logos/icons needing transparency
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
