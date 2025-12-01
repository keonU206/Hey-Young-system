import Link from "next/link";

const dummySessions = [
  { id: "s1", week: 7, date: "4/17", time: "3교시", status: "진행 전" },
  { id: "s2", week: 6, date: "4/10", time: "3교시", status: "마감" },
  { id: "s3", week: 5, date: "4/3", time: "3교시", status: "마감" },
];

export default function InstructorCourseSessionsPage() {
  const courseName = "웹서버프로그래밍";

  return (
    <div>
      <h1 className="page-title">{courseName} · 주차별 세션</h1>
      <p className="page-subtitle">
        각 주차의 출석 세션 상태를 확인하고, 출석 관리를 시작할 수 있습니다.
      </p>

      <table className="simple-table">
        <thead>
          <tr>
            <th>주차</th>
            <th>날짜</th>
            <th>시간</th>
            <th>출석 세션</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {dummySessions.map((s) => (
            <tr key={s.id}>
              <td>{s.week}주차</td>
              <td>{s.date}</td>
              <td>{s.time}</td>
              <td>
                <span
                  className={`badge ${
                    s.status === "진행 전"
                      ? "badge-muted"
                      : s.status === "진행 중"
                      ? "badge-live"
                      : "badge-success"
                  }`}
                >
                  {s.status}
                </span>
              </td>
              <td>
                <Link
                  href={`/instructor/sessions/${s.id}/manage`}
                  className="btn btn-outline small"
                >
                  출석 관리
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
