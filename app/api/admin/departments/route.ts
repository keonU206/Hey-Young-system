// app/api/admin/departments/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/admin/departments
 *  - 학과 목록 조회
 */
export async function GET() {
  try {
    const list = await prisma.departments.findMany({
      orderBy: { id: "asc" },
    });

    const safe = list.map((d) => ({
      id: Number(d.id), // BigInt -> number
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

/**
 * POST /api/admin/departments
 *  - 새 학과 추가
 *  body: { adminLoginId, code, name }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const adminLoginId = String(body.adminLoginId || "").trim();
    const code = String(body.code || "").trim();
    const name = String(body.name || "").trim();

    if (!adminLoginId || !code || !name) {
      return NextResponse.json(
        { ok: false, message: "관리자, 코드, 학과명을 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    // 관리자 권한 확인
    const admin = await prisma.users.findUnique({
      where: { login_id: adminLoginId },
    });

    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, message: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 코드 중복 체크
    const existing = await prisma.departments.findUnique({
      where: { code },
    });
    if (existing) {
      return NextResponse.json(
        { ok: false, message: "이미 사용 중인 학과 코드입니다." },
        { status: 409 }
      );
    }

    const created = await prisma.departments.create({
      data: {
        code,
        name,
        is_active: true,
      },
    });

    const safe = {
      id: Number(created.id),
      code: created.code,
      name: created.name,
      is_active: created.is_active,
    };

    return NextResponse.json({ ok: true, department: safe });
  } catch (err) {
    console.error("POST /api/admin/departments error:", err);
    return NextResponse.json(
      { ok: false, message: "학과를 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/departments
 *  - 학과 수정
 *  body: { adminLoginId, id, code, name, is_active }
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const adminLoginId = String(body.adminLoginId || "").trim();
    const id = Number(body.id);
    const code = body.code ? String(body.code).trim() : undefined;
    const name = body.name ? String(body.name).trim() : undefined;
    const is_active =
      typeof body.is_active === "boolean" ? body.is_active : undefined;

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

    const data: any = {};
    if (code !== undefined) data.code = code;
    if (name !== undefined) data.name = name;
    if (is_active !== undefined) data.is_active = is_active;

    const updated = await prisma.departments.update({
      where: { id: BigInt(id) },
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
    console.error("PATCH /api/admin/departments error:", err);
    return NextResponse.json(
      { ok: false, message: "학과 정보를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/departments
 *  - 학과 삭제
 *  body: { adminLoginId, id }
 */
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

    await prisma.departments.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/departments error:", err);
    return NextResponse.json(
      { ok: false, message: "학과를 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
