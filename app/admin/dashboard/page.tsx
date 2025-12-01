export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="page-title">관리자 대시보드</h1>
      <p className="page-subtitle">
        전체 시스템 현황과 주요 지표를 한눈에 확인합니다.
      </p>

      <div className="grid-2">
        <section className="card">
          <h2 className="card-title">요약 지표</h2>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-label">등록 사용자</span>
              <span className="stat-value">128</span>
            </div>
            <div className="stat">
              <span className="stat-label">개설 과목</span>
              <span className="stat-value">24</span>
            </div>
            <div className="stat">
              <span className="stat-label">금일 강의</span>
              <span className="stat-value">18</span>
            </div>
          </div>
        </section>

        <section className="card">
          <h2 className="card-title">주의 알림</h2>
          <ul className="simple-list">
            <li>출석 변경이 5회 이상 발생한 과목 2개</li>
            <li>지난 7일간 로그인 실패 시도가 12회 발생</li>
            <li>출석률 70% 미만 과목 3개</li>
          </ul>
        </section>
      </div>

      <section className="card mt-24">
        <h2 className="card-title">최근 활동 로그</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>시간</th>
              <th>사용자</th>
              <th>역할</th>
              <th>행위</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>10:12</td>
              <td>admin01</td>
              <td>관리자</td>
              <td>과목 “웹서버프로그래밍” 출석 정책 수정</td>
            </tr>
            <tr>
              <td>09:40</td>
              <td>prof_lee</td>
              <td>교원</td>
              <td>출석 정정 1건 승인</td>
            </tr>
            <tr>
              <td>09:20</td>
              <td>202312345</td>
              <td>학생</td>
              <td>로그인 성공</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
