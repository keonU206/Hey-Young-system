import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signAuthToken, AuthTokenPayload } from "@/lib/auth";

// 감사 로그용 타입
type AuditTargetType =
  | "USER"
  | "DEPARTMENT"
  | "SEMESTER"
  | "COURSE"
  | "ATTENDANCE"
  | "POLICY"
  | "SYSTEM"
  | "OTHER";

// 감사 로그 헬퍼
async function logAudit(options: {
  actorId: number | bigint | null; // 로그인 유저 id 또는 null
  targetType: AuditTargetType;
  targetId: number | bigint; // 0 = SYSTEM 등
  action: string; // "LOGIN_SUCCESS", "LOGIN_FAILED" ...
  beforeData?: unknown;
  afterData?: unknown;
}) {
  const { actorId, targetType, targetId, action, beforeData, afterData } =
    options;

  const toBigInt = (v: number | bigint) =>
    typeof v === "bigint" ? v : BigInt(v);

  // ES2020 미만: 0n 대신 BigInt(0) 사용
  const actorIdBigInt = actorId === null ? BigInt(0) : toBigInt(actorId);

  try {
    await prisma.audit_logs.create({
      data: {
        actor_id: actorIdBigInt,
        target_type: targetType,
        target_id: toBigInt(targetId),
        action,
        before_data: beforeData as any,
        after_data: afterData as any,
      },
    });
  } catch (err) {
    console.error("audit log write error (login):", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const studentId = String(body.studentId || "").trim(); // login_id
    const password = String(body.password || "");

    if (!studentId || !password) {
      // 입력값 부족 실패 로그
      await logAudit({
        actorId: null,
        targetType: "SYSTEM",
        targetId: 0,
        action: "LOGIN_FAILED_MISSING_FIELDS",
        beforeData: null,
        afterData: { login_id: studentId },
      });

      return NextResponse.json(
        {
          ok: false,
          message: "학번과 비밀번호를 모두 입력해 주세요.",
        },
        { status: 400 }
      );
    }

    // 1) 유저 찾기
    const user = await prisma.users.findUnique({
      where: { login_id: studentId },
    });

    if (!user || !user.password_hash) {
      // 유저 없음/비번 미설정 실패 로그
      await logAudit({
        actorId: null,
        targetType: "SYSTEM",
        targetId: 0,
        action: "LOGIN_FAILED_USER_NOT_FOUND",
        beforeData: null,
        afterData: { login_id: studentId },
      });

      return NextResponse.json(
        { ok: false, message: "학번 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      // 비활성 계정 실패 로그
      await logAudit({
        actorId: user.id,
        targetType: "USER",
        targetId: user.id,
        action: "LOGIN_FAILED_INACTIVE",
        beforeData: null,
        afterData: { login_id: user.login_id },
      });

      return NextResponse.json(
        {
          ok: false,
          message: "비활성화된 계정입니다. 관리자에게 문의하세요.",
        },
        { status: 403 }
      );
    }

    // 2) 비밀번호 검증
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      // 비밀번호 틀림 실패 로그
      await logAudit({
        actorId: user.id,
        targetType: "USER",
        targetId: user.id,
        action: "LOGIN_FAILED_WRONG_PASSWORD",
        beforeData: null,
        afterData: { login_id: user.login_id },
      });

      return NextResponse.json(
        { ok: false, message: "학번 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 3) 리다이렉트 경로 결정
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

    // 4) JWT 발급 (5분 유효)
    const tokenPayload: AuthTokenPayload = {
      id: Number(user.id),
      login_id: user.login_id,
      name: user.name,
      role: user.role as AuthTokenPayload["role"],
    };

    const token = await signAuthToken(tokenPayload);

    // 5) 응답 + 쿠키 셋팅
    const res = NextResponse.json({
      ok: true,
      user: safeUser,
      redirectTo,
    });

    res.cookies.set("auth_token", token, {
      httpOnly: true, // JS에서 못 건드리게
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 5, // ✅ 5분
      path: "/",
    });

    // ✅ 로그인 성공 감사 로그
    await logAudit({
      actorId: user.id,
      targetType: "USER",
      targetId: user.id,
      action: "LOGIN_SUCCESS",
      beforeData: null,
      afterData: {
        login_id: user.login_id,
        role: user.role,
      },
    });

    return res;
  } catch (err) {
    console.error("POST /api/login error:", err);

    // 시스템 에러 감사 로그
    await logAudit({
      actorId: null,
      targetType: "SYSTEM",
      targetId: 0,
      action: "ERROR_LOGIN",
      beforeData: null,
      afterData: { message: String(err) },
    });

    return NextResponse.json(
      { ok: false, message: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
