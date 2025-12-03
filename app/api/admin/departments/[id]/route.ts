// app/api/admin/departments/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Next App Router 동적 라우트 시그니처
type RouteParams = {
  params: { id: string };
};

/**
 * PATCH /api/admin/departments/[id]
 * body: { adminLoginId, code?, name?, is_active? }
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const deptId = Number(params.id); // URL에서 들어온 id
    const body = await req.json();

    const adminLoginId = String(body.adminLoginId || "").trim();
    const code = body.code ? String(body.code).trim() : undefined;
    const name = body.name ? String(body.name).trim() : undefined;
    const is_active =
      typeof body.is_active === "boolean" ? body.is_active : undefined;

    if (!adminLoginId || !deptId) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보 또는 학과 ID가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 🔐 관리자 권한 확인
    const admin = await prisma.users.findUnique({
      where: { login_id: adminLoginId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, message: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const data: any = {};
    if (code !== undefined) data.code = code;
    if (name !== undefined) data.name = name;
    if (is_active !== undefined) data.is_active = is_active;

    // id가 BigInt라서 BigInt로 캐스팅
    const updated = await prisma.departments.update({
      where: { id: BigInt(deptId) },
      data,
    });

    const safe = {
      id: Number(updated.id),
      code: updated.code,
      name: updated.name,
      is_active: updated.is_active,
    };

    return NextResponse.json({ ok: true, department: safe });
  } catch (err) {
    console.error("PATCH /api/admin/departments/[id] error:", err);
    return NextResponse.json(
      { ok: false, message: "학과 정보를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/departments/[id]
 * body: { adminLoginId }
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const deptId = Number(params.id);
    const body = await req.json().catch(() => ({} as any));
    const adminLoginId = String(body.adminLoginId || "").trim();

    if (!adminLoginId || !deptId) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보 또는 학과 ID가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 🔐 관리자 권한 확인
    const admin = await prisma.users.findUnique({
      where: { login_id: adminLoginId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, message: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 완전 삭제
    await prisma.departments.delete({
      where: { id: BigInt(deptId) },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/departments/[id] error:", err);
    return NextResponse.json(
      { ok: false, message: "학과를 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
