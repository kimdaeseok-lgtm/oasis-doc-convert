/** @type {import('next').NextConfig} */
const nextConfig = {
  // kordoc은 런타임에 createRequire로 'cfb'를 불러오므로, 번들하지 말고 node_modules에서 그대로 실행.
  serverExternalPackages: ["kordoc"],

  // 파일 추적기(nft)가 createRequire 호출을 못 따라가서 'cfb'가 함수에 빠짐 → 강제로 포함.
  // cfb는 adler-32, crc-32에 의존하므로 함께 포함.
  outputFileTracingIncludes: {
    "/api/convert": [
      "./node_modules/cfb/**/*",
      "./node_modules/adler-32/**/*",
      "./node_modules/crc-32/**/*",
    ],
  },
};

export default nextConfig;
