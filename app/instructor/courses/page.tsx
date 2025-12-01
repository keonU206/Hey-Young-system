import Link from "next/link";

const dummyCourses = [
  { id: "webprog", name: "웹서버프로그래밍", code: "CSE301", students: 32 },
  { id: "os", name: "운영체제", code: "CSE210", students: 28 },
];

export default function InstructorCoursesPage() {
  return (
    <div>
      <h1 className="page-title">담당 강의</h1>
      <p className="page-subtitle">
        이번 학기에 담당 중인 강의 목록입니다. 강의를 선택하면 주차별 수업과
        출석 세션을 관리할 수 있습니다.
      </p>

      <table className="simple-table">
        <thead>
          <tr>
            <th>과목 코드</th>
            <th>과목명</th>
            <th>수강 인원</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {dummyCourses.map((c) => (
            <tr key={c.id}>
              <td>{c.code}</td>
              <td>{c.name}</td>
              <td>{c.students}명</td>
              <td>
                <Link
                  href={`/instructor/courses/${c.id}/sessions`}
                  className="btn btn-outline small"
                >
                  주차별 관리
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
