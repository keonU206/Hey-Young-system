export default function AdminLogsPage() {
  return (
    <div>
      <h1 className="page-title">감사 로그</h1>
      <p className="page-subtitle">
        출석 변경, 권한 변경 등 중요한 행위를 추적하기 위한 감사 로그입니다.
      </p>

      <section className="card">
        <h2 className="card-title">로그 검색</h2>
        <div className="filter-row">
          <select>
            <option value="">대상 종류 전체</option>
            <option value="attendance">출석(Attendance)</option>
            <option value="user">사용자(User)</option>
            <option value="course">과목(Course)</option>
          </select>
          <input type="text" placeholder="사용자 ID 또는 과목명 검색" />
        </div>

        <table className="simple-table">
          <thead>
            <tr>
              <th>시간</th>
              <th>사용자</th>
              <th>대상</th>
              <th>행동</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-06-10 10:12</td>
              <td>admin01</td>
              <td>Attendance #1234</td>
              <td>상태 변경: 결석 → 공결</td>
            </tr>
            <tr>
              <td>2025-06-10 09:50</td>
              <td>admin01</td>
              <td>User prof_lee</td>
              <td>역할 변경: 교원 → 관리자</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
