export default function InstructorExcusesPage() {
  return (
    <div>
      <h1 className="page-title">공결 신청 관리</h1>
      <p className="page-subtitle">
        학생들이 제출한 공결 신청을 확인하고 승인 또는 반려할 수 있습니다.
      </p>

      <section className="card">
        <h2 className="card-title">대기 중인 공결 신청</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>학생</th>
              <th>학번</th>
              <th>과목 / 주차</th>
              <th>사유</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>김철수</td>
              <td>202312345</td>
              <td>운영체제 · 7주차</td>
              <td>고열로 인한 병결</td>
              <td>
                <span className="badge badge-muted">대기</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card mt-24">
        <h2 className="card-title">최근 처리 내역</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>학생</th>
              <th>과목 / 주차</th>
              <th>결과</th>
              <th>코멘트</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>이영희</td>
              <td>웹서버프로그래밍 · 5주차</td>
              <td>
                <span className="badge badge-info">승인</span>
              </td>
              <td>증빙 서류 확인 완료</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
