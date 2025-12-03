import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

// GET: 학과 목록
export async function GET() {
  try {
    const list = await prisma.departments.findMany({
      orderBy: { id: "asc" },
    });

    const safe = list.map((d) => ({
      id: Number(d.id),
      code: d.code,
      name: d.name,
      is_active: d.is_active,
    }));

    return NextResponse.json({ ok: true, departments: safe });
  } catch (err) {
    console.error("GET /api/admin/departments error:", err);
    return NextResponse.json(
      { ok: false, message: "학과 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// POST: 학과 생성
// body: { adminLoginId, code, name }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const adminLoginId = String(body.adminLoginId || "").trim();
    const code = String(body.code || "").trim();
    const name = String(body.name || "").trim();

    if (!adminLoginId || !code || !name) {
      return NextResponse.json(
        { ok: false, message: "관리자, 코드, 학과명은 필수입니다." },
        { status: 400 }
      );
    }

    const admin = await prisma.users.findUnique({
      where: { login_id: adminLoginId },
    });
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, message: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const created = await prisma.departments.create({
      data: { code, name, is_active: true },
    });

    // 감사 로그: 학과 생성
    await logAudit({
      actorId: created ? admin.id : admin.id,
      targetType: "DEPARTMENT",
      targetId: created.id,
      action: "CREATE",
      before: null,
      after: { code, name },
    });

    return NextResponse.json({
      ok: true,
      department: {
        id: Number(created.id),
        code: created.code,
        name: created.name,
        is_active: created.is_active,
      },
    });
  } catch (err) {
    console.error("POST /api/admin/departments error:", err);
    return NextResponse.json(
      { ok: false, message: "학과 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH: 학과 수정
// body: { adminLoginId, id, code?, name?, is_active? }
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const adminLoginId = String(body.adminLoginId || "").trim();
    const id = Number(body.id);

    if (!adminLoginId || !id) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보 또는 학과 ID가 누락되었습니다." },
        { status: 400 }
      );
    }

    const admin = await prisma.users.findUnique({
      where: { login_id: adminLoginId },
    });
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, message: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const existing = await prisma.departments.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existing) {
      return NextResponse.json(
        { ok: false, message: "해당 학과를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const data: any = {};
    if (body.code !== undefined) data.code = String(body.code).trim();
    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.is_active !== undefined) data.is_active = !!body.is_active;

    const updated = await prisma.departments.update({
      where: { id: BigInt(id) },
      data,
    });

    // 감사 로그: 학과 수정
    await logAudit({
      actorId: admin.id,
      targetType: "DEPARTMENT",
      targetId: existing.id,
      action: "UPDATE",
      before: {
        code: existing.code,
        name: existing.name,
        is_active: existing.is_active,
      },
      after: {
        code: updated.code,
        name: updated.name,
        is_active: updated.is_active,
      },
    });

    return NextResponse.json({
      ok: true,
      department: {
        id: Number(updated.id),
        code: updated.code,
        name: updated.name,
        is_active: updated.is_active,
      },
    });
  } catch (err) {
    console.error("PATCH /api/admin/departments error:", err);
    return NextResponse.json(
      { ok: false, message: "학과 수정 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// DELETE: 학과 삭제
// body: { adminLoginId, id }
export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const adminLoginId = String(body.adminLoginId || "").trim();
    const id = Number(body.id);

    if (!adminLoginId || !id) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보 또는 학과 ID가 누락되었습니다." },
        { status: 400 }
      );
    }

    const admin = await prisma.users.findUnique({
      where: { login_id: adminLoginId },
    });
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, message: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const existing = await prisma.departments.findUnique({
      where: { id: BigInt(id) },
    });
    if (!existing) {
      return NextResponse.json(
        { ok: false, message: "해당 학과를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await prisma.departments.delete({
      where: { id: BigInt(id) },
    });

    // 감사 로그: 학과 삭제
    await logAudit({
      actorId: admin.id,
      targetType: "DEPARTMENT",
      targetId: existing.id,
      action: "DELETE",
      before: {
        code: existing.code,
        name: existing.name,
        is_active: existing.is_active,
      },
      after: null,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/departments error:", err);
    return NextResponse.json(
      { ok: false, message: "학과 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
