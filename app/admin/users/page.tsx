export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="page-title">사용자 관리</h1>
      <p className="page-subtitle">
        학생, 교원, 관리자 계정을 조회하고 역할을 관리합니다.
      </p>

      <section className="card">
        <h2 className="card-title">사용자 목록</h2>
        <div className="filter-row">
          <select>
            <option value="">역할 전체</option>
            <option value="student">학생</option>
            <option value="instructor">교원</option>
            <option value="admin">관리자</option>
          </select>
          <input type="text" placeholder="이름 또는 학번/아이디로 검색" />
        </div>

        <table className="simple-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>ID / 학번</th>
              <th>역할</th>
              <th>소속</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>김철수</td>
              <td>202312345</td>
              <td>학생</td>
              <td>컴퓨터공학과</td>
              <td>활성</td>
            </tr>
            <tr>
              <td>이교수</td>
              <td>prof_lee</td>
              <td>교원</td>
              <td>컴퓨터공학과</td>
              <td>활성</td>
            </tr>
            <tr>
              <td>관리자A</td>
              <td>admin01</td>
              <td>관리자</td>
              <td>-</td>
              <td>활성</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
