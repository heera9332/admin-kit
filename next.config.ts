import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

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

  allowedDevOrigins: ['my-server.local', 'localhost', '127.0.0.1']
}

export default withNextIntl(nextConfig);
