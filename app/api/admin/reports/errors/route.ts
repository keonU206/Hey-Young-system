// app/api/admin/reports/errors/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const logs = await prisma.audit_logs.findMany({
      where: {
        // 예: action 이 "ERROR_" 로 시작하는 로그들을 오류로그로 간주
        action: { startsWith: "ERROR_" },
      },
      orderBy: { created_at: "desc" },
      take: 100,
      include: {
        users: {
          select: {
            id: true,
            login_id: true,
            name: true,
            role: true,
          },
        },
      },
    });

    const safe = logs.map((l) => ({
      id: Number(l.id),
      actor: l.users
        ? {
            id: Number(l.users.id),
            login_id: l.users.login_id,
            name: l.users.name,
            role: l.users.role,
          }
        : null,
      target_type: l.target_type,
      target_id: Number(l.target_id),
      action: l.action,
      before_data: l.before_data,
      after_data: l.after_data,
      created_at: l.created_at,
    }));

    return NextResponse.json({ ok: true, logs: safe });
  } catch (err) {
    console.error("GET /api/admin/reports/errors error:", err);
    return NextResponse.json(
      { ok: false, message: "오류 로그를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
