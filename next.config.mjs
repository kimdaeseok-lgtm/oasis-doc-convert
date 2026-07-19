/** @type {import('next').NextConfig} */
const nextConfig = {
  // kordoc과 그 필수 의존성들을 번들하지 않고 node_modules에서 그대로 require 하도록 지정.
  // (이렇게 하면 Vercel이 함수에 이 패키지 파일들을 포함시킴 → "Cannot find module 'cfb'" 방지)
  // 무거운 선택적 의존성(pdfjs-dist·sharp·onnxruntime 등)은 HWP 변환에 불필요하므로 넣지 않음.
  serverExternalPackages: [
    "kordoc",
    "cfb",
    "jszip",
    "@xmldom/xmldom",
    "markdown-it",
    "commander",
    "zod",
    "@modelcontextprotocol/sdk",
  ],
};

export default nextConfig;
