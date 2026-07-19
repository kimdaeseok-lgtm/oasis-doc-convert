/** @type {import('next').NextConfig} */
const nextConfig = {
  // kordoc는 서버에서 그대로 require 되도록 번들에서 제외 (동적 로딩 안전)
  serverExternalPackages: ['kordoc'],
};

export default nextConfig;
