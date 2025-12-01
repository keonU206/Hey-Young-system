export default function AdminCoursesPage() {
  return (
    <div>
      <h1 className="page-title">과목 관리</h1>
      <p className="page-subtitle">
        학기별로 개설된 과목과 담당 교원을 관리합니다.
      </p>

      <section className="card">
        <h2 className="card-title">개설 과목 목록</h2>
        <div className="filter-row">
          <select>
            <option value="">학기 전체</option>
            <option value="2025-1">2025-1</option>
            <option value="2025-2">2025-2</option>
          </select>
          <input type="text" placeholder="과목명 또는 코드 검색" />
        </div>

        <table className="simple-table">
          <thead>
            <tr>
              <th>학기</th>
              <th>과목 코드</th>
              <th>과목명</th>
              <th>담당 교원</th>
              <th>수강 인원</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-1</td>
              <td>CSE301</td>
              <td>웹서버프로그래밍</td>
              <td>이교수</td>
              <td>32명</td>
            </tr>
            <tr>
              <td>2025-1</td>
              <td>CSE210</td>
              <td>운영체제</td>
              <td>박교수</td>
              <td>28명</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
