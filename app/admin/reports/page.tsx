export default function AdminReportsPage() {
  return (
    <div>
      <h1 className="page-title">리포트</h1>
      <p className="page-subtitle">
        과목별 출석률, 위험 학생, 공결 사용 현황 등 통계를 조회합니다.
      </p>

      <section className="card">
        <h2 className="card-title">과목별 출석률 요약</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>과목명</th>
              <th>담당 교원</th>
              <th>출석률</th>
              <th>결석 평균</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>웹서버프로그래밍</td>
              <td>이교수</td>
              <td>92%</td>
              <td>0.3회</td>
            </tr>
            <tr>
              <td>운영체제</td>
              <td>박교수</td>
              <td>78%</td>
              <td>1.2회</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card mt-24">
        <h2 className="card-title">위험 학생 예시</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>학번</th>
              <th>이름</th>
              <th>위험 사유</th>
              <th>관련 과목 수</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>202312345</td>
              <td>김철수</td>
              <td>3과목 이상에서 결석 3회 이상</td>
              <td>3</td>
            </tr>
            <tr>
              <td>202312346</td>
              <td>이영희</td>
              <td>지각·결석 합 8회 이상</td>
              <td>2</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
