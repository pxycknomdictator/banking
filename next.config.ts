import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    cacheComponents: false,
    partialPrefetching: false,
    reactCompiler: true,
    allowedDevOrigins: ["192.168.100.5"],
    turbopack: {
        rules: {
            "*.css": {
                loaders: ["@tailwindcss/turbopack"],
                as: "*.css"
            }
        }
    }
};

export default nextConfig;
