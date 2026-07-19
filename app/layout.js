export const metadata = {
  title: "OASIS 문서변환",
  description: "HWP·HWPX 등을 마크다운으로 변환하는 내부 서비스",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
