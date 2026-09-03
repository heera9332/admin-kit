import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/dashboard/settings/theme",
        destination: "/dashboard/settings/appearance",
        permanent: true,
      },
    ]
  },
}

export default nextConfig;
