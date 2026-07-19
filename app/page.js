export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 40, maxWidth: 640, lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 22 }}>OASIS 문서변환 서비스</h1>
      <p style={{ color: "#475569" }}>
        HWP·HWPX 등 공공문서를 마크다운으로 변환하는 내부 API입니다.
        쉼터 인트라넷(자료실)이 자료를 올릴 때 자동으로 호출합니다.
      </p>
      <p style={{ color: "#94a3b8", fontSize: 14 }}>
        엔드포인트: <code>POST /api/convert</code> (비밀키 필요)
      </p>
    </main>
  );
}
