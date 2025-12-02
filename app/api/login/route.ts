import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const studentId = String(body.studentId || "").trim();
    const password = String(body.password || "");

    if (!studentId || !password) {
      return NextResponse.json(
        { ok: false, message: "학번과 비밀번호를 모두 입력해 주세요." },
        { status: 400 }
      );
    }

    // 학번으로 유저 찾기 (login_id는 UNIQUE라고 가정)
    const user = await prisma.users.findUnique({
      where: { login_id: studentId },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, message: "해당 학번의 사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (!user.is_active) {
      return NextResponse.json(
        {
          ok: false,
          message: "비활성화된 계정입니다. 관리자에게 문의해 주세요.",
        },
        { status: 403 }
      );
    }

    if (!user.password_hash) {
      return NextResponse.json(
        { ok: false, message: "비밀번호 정보가 설정되어 있지 않습니다." },
        { status: 500 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { ok: false, message: "비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 역할에 따라 리다이렉트 경로 결정
    let redirectTo = "/student/dashboard";
    if (user.role === "INSTRUCTOR") redirectTo = "/instructor/dashboard";
    if (user.role === "ADMIN") redirectTo = "/admin/dashboard";

    const safeUser = {
      id: Number(user.id), // BigInt → Number
      login_id: user.login_id,
      name: user.name,
      role: user.role,
      email: user.email,
      department: user.department,
    };

    return NextResponse.json({
      ok: true,
      user: safeUser,
      redirectTo,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
