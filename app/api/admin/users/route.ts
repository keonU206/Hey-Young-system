// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * GET /api/admin/users
 *  - 전체 사용자 목록 조회
 */
export async function GET() {
  try {
    const users = await prisma.users.findMany({
      orderBy: { id: "asc" },
    });

    const safeUsers = users.map((u) => ({
      id: Number(u.id), // BigInt → number
      login_id: u.login_id,
      name: u.name,
      role: u.role,
      email: u.email,
      department: u.department,
      is_active: u.is_active,
      created_at: u.created_at,
    }));

    return NextResponse.json({ ok: true, users: safeUsers });
  } catch (err) {
    console.error("GET /api/admin/users error:", err);
    return NextResponse.json(
      { ok: false, message: "사용자 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 *  - 새 사용자 등록
 *  body: { adminLoginId, login_id, name, email, department, role, password }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const adminLoginId = String(body.adminLoginId || "").trim();
    const login_id = String(body.login_id || "").trim();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const department = body.department ? String(body.department).trim() : "";
    const role = String(body.role || "STUDENT").trim() as
      | "ADMIN"
      | "INSTRUCTOR"
      | "STUDENT";
    const password = String(body.password || "");

    if (!adminLoginId || !login_id || !name || !email || !password) {
      return NextResponse.json(
        {
          ok: false,
          message: "관리자, 학번/사번, 이름, 이메일, 비밀번호는 필수입니다.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "비밀번호는 8자 이상이어야 합니다." },
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

    // 학번/사번 중복 체크
    const existingByLogin = await prisma.users.findUnique({
      where: { login_id },
    });
    if (existingByLogin) {
      return NextResponse.json(
        { ok: false, message: "이미 사용 중인 학번/사번입니다." },
        { status: 409 }
      );
    }

    // 이메일 중복 체크 (선택)
    if (email) {
      const existingByEmail = await prisma.users.findFirst({
        where: { email },
      });
      if (existingByEmail) {
        return NextResponse.json(
          { ok: false, message: "이미 사용 중인 이메일입니다." },
          { status: 409 }
        );
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await prisma.users.create({
      data: {
        login_id,
        name,
        email,
        department: department || null,
        role,
        is_active: true,
        password_hash: passwordHash,
      },
    });

    const safeUser = {
      id: Number(created.id),
      login_id: created.login_id,
      name: created.name,
      role: created.role,
      email: created.email,
      department: created.department,
      is_active: created.is_active,
      created_at: created.created_at,
    };

    return NextResponse.json({ ok: true, user: safeUser });
  } catch (err) {
    console.error("POST /api/admin/users error:", err);
    return NextResponse.json(
      { ok: false, message: "사용자를 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users
 *  - 사용자 정보/권한 수정
 *  body: { adminLoginId, id, name?, email?, department?, role?, is_active? }
 *  (비밀번호 초기화 기능 나중에 추가 가능)
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const adminLoginId = String(body.adminLoginId || "").trim();
    const id = Number(body.id);

    const name = body.name ? String(body.name).trim() : undefined;
    const email = body.email ? String(body.email).trim() : undefined;
    const department =
      body.department !== undefined
        ? String(body.department).trim()
        : undefined;
    const role = body.role
      ? (String(body.role).trim() as "ADMIN" | "INSTRUCTOR" | "STUDENT")
      : undefined;
    const is_active =
      typeof body.is_active === "boolean" ? body.is_active : undefined;

    if (!adminLoginId || !id) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보 또는 사용자 ID가 누락되었습니다." },
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
    if (name !== undefined) data.name = name;
    if (email !== undefined) data.email = email;
    if (department !== undefined) data.department = department || null;
    if (role !== undefined) data.role = role;
    if (is_active !== undefined) data.is_active = is_active;

    const updated = await prisma.users.update({
      where: { id: BigInt(id) },
      data,
    });

    const safeUser = {
      id: Number(updated.id),
      login_id: updated.login_id,
      name: updated.name,
      role: updated.role,
      email: updated.email,
      department: updated.department,
      is_active: updated.is_active,
      created_at: updated.created_at,
    };

    return NextResponse.json({ ok: true, user: safeUser });
  } catch (err) {
    console.error("PATCH /api/admin/users error:", err);
    return NextResponse.json(
      { ok: false, message: "사용자 정보를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const adminLoginId = String(body.adminLoginId || "").trim();
    const id = Number(body.id);

    if (!adminLoginId || !id) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보 또는 사용자 ID가 누락되었습니다." },
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

    // 실제 삭제 (FK 제약 있으면 여기서 에러 날 수 있음)
    await prisma.users.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/users error:", err);
    return NextResponse.json(
      { ok: false, message: "사용자를 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
