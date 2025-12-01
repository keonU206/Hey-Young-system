import Link from "next/link";

const dummyCourses = [
  {
    id: "webprog",
    name: "웹서버프로그래밍",
    code: "CSE301",
    room: "공학관 301",
  },
  { id: "os", name: "운영체제", code: "CSE210", room: "공학관 205" },
  { id: "db", name: "데이터베이스", code: "CSE220", room: "공학관 210" },
];

export default function StudentCoursesPage() {
  return (
    <div>
      <h1 className="page-title">내 강의</h1>
      <p className="page-subtitle">
        이번 학기에 수강 중인 강의 목록입니다. 과목을 클릭하면 주차별 수업과
        출석 상태를 확인할 수 있습니다.
      </p>

      <table className="simple-table">
        <thead>
          <tr>
            <th>과목 코드</th>
            <th>과목명</th>
            <th>강의실</th>
            <th>바로가기</th>
          </tr>
        </thead>
        <tbody>
          {dummyCourses.map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.name}</td>
              <td>{c.room}</td>
              <td>
                <Link
                  href={`/student/courses/${c.id}`}
                  className="btn btn-outline small"
                >
                  상세 보기
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
