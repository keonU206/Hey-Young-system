export default function AdminSemestersPage() {
  return (
    <div>
      <h1 className="page-title">학기 / 주차 설정</h1>
      <p className="page-subtitle">
        학기별 수업 기간과 주차, 공휴일 및 보강 일정을 관리합니다.
      </p>

      <section className="card">
        <h2 className="card-title">학기 목록</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>학기</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>총 주차</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-1</td>
              <td>03-02</td>
              <td>06-21</td>
              <td>15주</td>
            </tr>
            <tr>
              <td>2025-2</td>
              <td>09-01</td>
              <td>12-20</td>
              <td>15주</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="card mt-24">
        <h2 className="card-title">예외 일정 예시</h2>
        <ul className="simple-list">
          <li>어린이날 대체공휴일 – 5/6 수업 휴강</li>
          <li>중간고사 주간 – 4/20 ~ 4/24</li>
          <li>종강 주간 – 6/15 ~ 6/21</li>
        </ul>
      </section>
    </div>
  );
}
