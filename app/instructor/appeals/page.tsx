export default function InstructorAppealsPage() {
  return (
    <div>
      <h1 className="page-title">출석 이의제기 관리</h1>
      <p className="page-subtitle">
        출석 결과에 대해 학생들이 제기한 이의 신청을 확인하고 처리할 수
        있습니다.
      </p>

      <section className="card">
        <h2 className="card-title">대기 중인 이의제기</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>학생</th>
              <th>과목 / 주차</th>
              <th>현재 상태</th>
              <th>이의 내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>김철수 (202312345)</td>
              <td>웹서버프로그래밍 · 5주차</td>
              <td>결석</td>
              <td>수업 시작 전에 강의실에 있었으나 체크가 안 되었습니다.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
