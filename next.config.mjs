/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ["tsx", "api.tsx", "page.tsx"],
  experimental: { ssr: false },
};

export default nextConfig;
