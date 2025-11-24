export default function InstructorPage() {
  const dummyCourses = [
    { id: 1, name: "웹서버 프로그래밍", code: "CSE301", semester: "2025-1" },
    { id: 2, name: "정보보호", code: "CSE402", semester: "2025-1" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* 헤더 */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              담당교원 대시보드
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              수업 출석 열기 / 공결 승인 / 이의 처리 등을 한 곳에서 관리합니다.
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-2 text-right shadow-sm">
            <p className="text-xs text-slate-400">현재 로그인</p>
            <p className="text-sm font-semibold text-slate-800">
              홍길동 교수님
            </p>
          </div>
        </header>

        {/* 카드들 */}
        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">오늘 수업</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900">2</p>
            <p className="mt-1 text-xs text-slate-500">오늘 예정된 세션 수</p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">
              처리할 공결 요청
            </h2>
            <p className="mt-2 text-3xl font-bold text-amber-500">5</p>
            <p className="mt-1 text-xs text-slate-500">
              승인/반려가 필요한 요청
            </p>
          </div>

          <div className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-700">
              출석 이의 제기
            </h2>
            <p className="mt-2 text-3xl font-bold text-rose-500">3</p>
            <p className="mt-1 text-xs text-slate-500">
              검토해야 하는 이의 신청
            </p>
          </div>
        </section>

        {/* 담당 강의 목록 */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              담당 강의 목록
            </h2>
            <p className="text-xs text-slate-500">
              강의를 선택하면 세션별 출석 관리 페이지로 이동하도록 만들면
              됩니다.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {dummyCourses.map((course) => (
              <button
                key={course.id}
                className="flex w-full items-center justify-between py-3 text-left hover:bg-slate-50"
                // TODO: 나중에 여기서 /instructor/courses/[id] 로 라우팅
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {course.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {course.code} · {course.semester}
                  </p>
                </div>
                <span className="text-xs font-medium text-blue-600">
                  출석 관리 &rarr;
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
