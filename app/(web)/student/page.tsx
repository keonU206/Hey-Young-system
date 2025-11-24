export default function StudentPage() {
  const dummySummary = {
    present: 18,
    late: 2,
    absent: 1,
    excused: 1,
  };

  const dummyCourses = [
    {
      id: 1,
      name: "웹서버 프로그래밍",
      code: "CSE301",
      attendanceRate: 95,
      risk: "low",
    },
    {
      id: 2,
      name: "정보보호",
      code: "CSE402",
      attendanceRate: 80,
      risk: "medium",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* 헤더 */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">학생 대시보드</h1>
            <p className="mt-1 text-sm text-slate-500">
              내 출석 현황과 오늘 출석해야 하는 수업을 확인할 수 있습니다.
            </p>
          </div>

          <div className="rounded-xl bg-white px-4 py-2 text-right shadow-sm">
            <p className="text-xs text-slate-400">현재 로그인</p>
            <p className="text-sm font-semibold text-slate-800">
              김학생 (20201234)
            </p>
          </div>
        </header>

        {/* 출석 요약 */}
        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-xs font-semibold text-emerald-700">출석</p>
            <p className="mt-2 text-2xl font-bold text-emerald-900">
              {dummySummary.present}
            </p>
          </div>
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-700">지각</p>
            <p className="mt-2 text-2xl font-bold text-amber-900">
              {dummySummary.late}
            </p>
          </div>
          <div className="rounded-xl bg-rose-50 p-4">
            <p className="text-xs font-semibold text-rose-700">결석</p>
            <p className="mt-2 text-2xl font-bold text-rose-900">
              {dummySummary.absent}
            </p>
          </div>
          <div className="rounded-xl bg-sky-50 p-4">
            <p className="text-xs font-semibold text-sky-700">공결</p>
            <p className="mt-2 text-2xl font-bold text-sky-900">
              {dummySummary.excused}
            </p>
          </div>
        </section>

        {/* 수강 과목 */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              수강 과목별 출석률
            </h2>
            <p className="text-xs text-slate-500">
              과목을 선택하면 세션별 출석 상세 및 공결 신청 페이지로 이동하게
              만들 수 있습니다.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {dummyCourses.map((course) => (
              <button
                key={course.id}
                className="flex w-full items-center justify-between py-3 text-left hover:bg-slate-50"
                // TODO: 나중에 /student/courses/[id] 로 라우팅
              >
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {course.name}
                  </p>
                  <p className="text-xs text-slate-500">{course.code}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-slate-500">출석률</p>
                    <p className="text-sm font-semibold text-slate-900">
                      {course.attendanceRate}%
                    </p>
                  </div>
                  <span
                    className={
                      "inline-flex rounded-full px-3 py-1 text-xs font-medium " +
                      (course.risk === "low"
                        ? "bg-emerald-50 text-emerald-700"
                        : course.risk === "medium"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-rose-50 text-rose-700")
                    }
                  >
                    {course.risk === "low"
                      ? "안전"
                      : course.risk === "medium"
                      ? "주의"
                      : "위험"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
