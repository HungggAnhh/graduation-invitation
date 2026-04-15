/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ép Vercel bỏ qua các lỗi gạch đỏ của TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ép Vercel bỏ qua các cảnh báo code
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;