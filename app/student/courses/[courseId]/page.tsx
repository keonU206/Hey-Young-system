import Link from "next/link";

const dummySessions = [
  { week: 1, date: "3/4", status: "출석", type: "전자출결" },
  { week: 2, date: "3/11", status: "지각", type: "인증번호" },
  { week: 3, date: "3/18", status: "결석", type: "전자출결" },
  { week: 4, date: "3/25", status: "공결", type: "전자출결" },
];

export default function StudentCourseDetailPage() {
  // 실제 구현 시에는 params에서 courseId를 받아와서 과목 정보/세션을 불러오면 됨
  const courseName = "웹서버프로그래밍";

  return (
    <div>
      <h1 className="page-title">{courseName}</h1>
      <p className="page-subtitle">
        이 강의의 주차별 출석 정보를 확인할 수 있습니다.
      </p>

      <section className="card">
        <h2 className="card-title">주차별 출석</h2>
        <table className="simple-table">
          <thead>
            <tr>
              <th>주차</th>
              <th>수업일</th>
              <th>출석 방식</th>
              <th>상태</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {dummySessions.map((s) => (
              <tr key={s.week}>
                <td>{s.week}주차</td>
                <td>{s.date}</td>
                <td>{s.type}</td>
                <td>
                  <span
                    className={`badge ${
                      s.status === "출석"
                        ? "badge-success"
                        : s.status === "지각"
                        ? "badge-warning"
                        : s.status === "공결"
                        ? "badge-info"
                        : "badge-muted"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td>
                  {s.status === "결석" && (
                    <Link
                      href="/student/excuses"
                      className="btn btn-outline small"
                    >
                      공결 / 이의 신청
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
