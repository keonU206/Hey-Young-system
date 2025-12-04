import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signAuthToken, AuthTokenPayload } from "@/lib/auth";

// 실패 응답 + 기존 auth_token 제거
function makeErrorResponse(status: number, message: string): NextResponse {
  const res = NextResponse.json({ ok: false, message }, { status });

  // 기존 토큰 제거
  res.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return res;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const studentId = String(body.studentId || "").trim(); // login_id
    const password = String(body.password || "");

    if (!studentId || !password) {
      return makeErrorResponse(400, "학번과 비밀번호를 모두 입력해 주세요.");
    }

    const user = await prisma.users.findUnique({
      where: { login_id: studentId },
    });

    if (!user || !user.password_hash) {
      return makeErrorResponse(401, "학번 또는 비밀번호가 올바르지 않습니다.");
    }

    if (!user.is_active) {
      return makeErrorResponse(
        403,
        "비활성화된 계정입니다. 관리자에게 문의하세요."
      );
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return makeErrorResponse(401, "학번 또는 비밀번호가 올바르지 않습니다.");
    }

    // ✅ 역할에 따라 리다이렉트 경로
    let redirectTo = "/student/dashboard";
    if (user.role === "ADMIN") {
      redirectTo = "/admin/dashboard";
    } else if (user.role === "INSTRUCTOR") {
      redirectTo = "/instructor/dashboard";
    }

    const safeUser = {
      id: Number(user.id),
      login_id: user.login_id,
      name: user.name,
      role: user.role,
      email: user.email,
      department: user.department,
      is_active: user.is_active,
    };

    const tokenPayload: AuthTokenPayload = {
      id: Number(user.id),
      login_id: user.login_id,
      name: user.name,
      role: user.role as AuthTokenPayload["role"],
    };

    const token = await signAuthToken(tokenPayload);

    const res = NextResponse.json({
      ok: true,
      user: safeUser,
      redirectTo,
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // dev에서는 false
      sameSite: "lax",
      maxAge: 60 * 5, // ✅ 5분
      path: "/",
    });

    console.log("✅ /api/login: set auth_token cookie for", user.login_id);

    return res;
  } catch (err) {
    console.error("POST /api/login error:", err);
    return makeErrorResponse(500, "로그인 처리 중 오류가 발생했습니다.");
  }
}
