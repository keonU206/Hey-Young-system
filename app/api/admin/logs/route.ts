import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 최근 감사 로그 100개를 시간 내림차순으로 반환
export async function GET() {
  try {
    const logs = await prisma.audit_logs.findMany({
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

    // BigInt → number 변환 + 프론트에서 쓰기 좋게 가공
    const safe = logs.map((l) => ({
      id: Number(l.id),
      actor: l.users
        ? {
            id: Number(l.users.id),
            login_id: String(l.users.login_id),
            name: String(l.users.name),
            role: String(l.users.role),
          }
        : null,
      target_type: String(l.target_type),
      target_id: Number(l.target_id),
      action: String(l.action),
      before_data: l.before_data,
      after_data: l.after_data,
      created_at: l.created_at.toISOString(),
    }));

    return NextResponse.json({ ok: true, logs: safe });
  } catch (err) {
    console.error("GET /api/admin/logs error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "감사 로그를 불러오는 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
