import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 👇 excuses 모델은 있을 수도 / 없을 수도 있어서 any로 안전하게 처리
    const prismaAny = prisma as any;

    const excuseCountPromise =
      prismaAny.excuses && typeof prismaAny.excuses.count === "function"
        ? prismaAny.excuses.count()
        : Promise.resolve(0); // 모델 없으면 0으로

    const [
      totalUsers,
      totalStudents,
      totalInstructors,
      totalAdmins,
      totalDepartments,
      totalSemesters,
      totalCourses,
      totalSessions,
      totalEnrollments,
      totalExcuses,
    ] = await Promise.all([
      prisma.users.count(),
      prisma.users.count({ where: { role: "STUDENT" } }),
      prisma.users.count({ where: { role: "INSTRUCTOR" } }),
      prisma.users.count({ where: { role: "ADMIN" } }),
      prisma.departments.count(),
      prisma.semesters.count(),
      prisma.courses.count(),
      prisma.class_sessions.count(),
      prisma.enrollments.count(),
      excuseCountPromise, // 👈 여기
    ]);

    return NextResponse.json({
      ok: true,
      summary: {
        users: {
          total: totalUsers,
          students: totalStudents,
          instructors: totalInstructors,
          admins: totalAdmins,
        },
        departments: totalDepartments,
        semesters: totalSemesters,
        courses: totalCourses,
        class_sessions: totalSessions,
        enrollments: totalEnrollments,
        excuses: totalExcuses,
      },
    });
  } catch (err) {
    console.error("GET /api/admin/reports/system error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "시스템 리포트를 가져오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
