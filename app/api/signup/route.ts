// app/api/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const loginId = String(body.loginId || "").trim();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const department = body.department ? String(body.department).trim() : "";
    const password = String(body.password || "");

    if (!loginId || !name || !email) {
      return NextResponse.json(
        { ok: false, message: "학번, 이름, 이메일은 필수입니다." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { ok: false, message: "비밀번호는 8자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 1) 학번 중복 체크
    const existingByLogin = await prisma.users.findUnique({
      where: { login_id: loginId },
    });
    if (existingByLogin) {
      return NextResponse.json(
        { ok: false, message: "이미 가입된 회원입니다." },
        { status: 409 }
      );
    }

    // 2) 이메일 중복 체크
    const existingByEmail = await prisma.users.findFirst({
      where: { email },
    });
    if (existingByEmail) {
      return NextResponse.json(
        { ok: false, message: "이미 가입된 회원입니다." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        login_id: loginId,
        name,
        email,
        department: department || null,
        role: "STUDENT",
        is_active: true,
        password_hash: passwordHash,
      },
    });

    const safeUser = {
      id: Number(newUser.id),
      login_id: newUser.login_id,
      name: newUser.name,
      role: newUser.role,
      email: newUser.email,
      department: newUser.department,
    };

    return NextResponse.json({
      ok: true,
      user: safeUser,
    });
  } catch (err: any) {
    console.error(err);

    // DB UNIQUE 제약에 걸려서 터질 수도 있으니 Prisma 에러도 한 번 더 방어
    if (err.code === "P2002" && Array.isArray(err.meta?.target)) {
      if (err.meta.target.includes("login_id")) {
        return NextResponse.json(
          { ok: false, message: "이미 가입된 학번입니다." },
          { status: 409 }
        );
      }
      if (err.meta.target.includes("email")) {
        return NextResponse.json(
          { ok: false, message: "이미 사용 중인 이메일입니다." },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { ok: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
