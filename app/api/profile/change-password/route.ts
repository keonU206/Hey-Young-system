import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

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

// 감사 로그 헬퍼 (비밀번호 내용은 절대 로그에 남기지 않음)
async function logAudit(options: {
  actorId: number | bigint | null;
  targetType: AuditTargetType;
  targetId: number | bigint;
  action: string;
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
    console.error("audit log write error (password change):", err);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const loginId = String(body.loginId || "").trim();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    if (!loginId || !currentPassword || !newPassword) {
      // 실패 로그 (입력값 부족)
      await logAudit({
        actorId: null,
        targetType: "SYSTEM",
        targetId: 0,
        action: "PASSWORD_CHANGE_FAILED_MISSING_FIELDS",
        beforeData: null,
        afterData: { login_id: loginId },
      });

      return NextResponse.json(
        {
          ok: false,
          message: "현재 비밀번호와 새 비밀번호를 모두 입력해 주세요.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      // 실패 로그 (새 비밀번호 길이 부족)
      await logAudit({
        actorId: null,
        targetType: "SYSTEM",
        targetId: 0,
        action: "PASSWORD_CHANGE_FAILED_TOO_SHORT",
        beforeData: null,
        afterData: { login_id: loginId, length: newPassword.length },
      });

      return NextResponse.json(
        { ok: false, message: "새 비밀번호는 8자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    // 1) 로그인된 유저 찾기 (login_id는 UNIQUE라고 가정)
    const user = await prisma.users.findUnique({
      where: { login_id: loginId },
    });

    if (!user) {
      // 실패 로그 (유저 없음)
      await logAudit({
        actorId: null,
        targetType: "SYSTEM",
        targetId: 0,
        action: "PASSWORD_CHANGE_FAILED_USER_NOT_FOUND",
        beforeData: null,
        afterData: { login_id: loginId },
      });

      return NextResponse.json(
        { ok: false, message: "사용자 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (!user.is_active) {
      // 실패 로그 (비활성 계정)
      await logAudit({
        actorId: user.id,
        targetType: "USER",
        targetId: user.id,
        action: "PASSWORD_CHANGE_FAILED_INACTIVE_USER",
        beforeData: null,
        afterData: { login_id: user.login_id },
      });

      return NextResponse.json(
        {
          ok: false,
          message: "비활성화된 계정입니다. 관리자에게 문의해 주세요.",
        },
        { status: 403 }
      );
    }

    if (!user.password_hash) {
      // 실패 로그 (비밀번호 정보 없음)
      await logAudit({
        actorId: user.id,
        targetType: "USER",
        targetId: user.id,
        action: "PASSWORD_CHANGE_FAILED_NO_HASH",
        beforeData: null,
        afterData: { login_id: user.login_id },
      });

      return NextResponse.json(
        { ok: false, message: "비밀번호 정보가 설정되어 있지 않습니다." },
        { status: 500 }
      );
    }

    // 2) 현재 비밀번호 검증
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      // 실패 로그 (현재 비밀번호 틀림)
      await logAudit({
        actorId: user.id,
        targetType: "USER",
        targetId: user.id,
        action: "PASSWORD_CHANGE_FAILED_WRONG_CURRENT",
        beforeData: null,
        afterData: { login_id: user.login_id },
      });

      return NextResponse.json(
        { ok: false, message: "현재 비밀번호가 올바르지 않습니다." },
        { status: 401 }
      );
    }

    // 3) 새 비밀번호 해시로 저장
    const newHash = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { login_id: loginId },
      data: { password_hash: newHash },
    });

    // ✅ 성공 로그 (비밀번호 내용은 로그에 남기지 않음)
    await logAudit({
      actorId: user.id,
      targetType: "USER",
      targetId: user.id,
      action: "PASSWORD_CHANGE_SUCCESS",
      beforeData: { login_id: user.login_id },
      afterData: { login_id: user.login_id },
    });

    return NextResponse.json({
      ok: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  } catch (err) {
    console.error(err);

    // 서버 에러도 시스템 로그로 남김
    await logAudit({
      actorId: null,
      targetType: "SYSTEM",
      targetId: 0,
      action: "ERROR_PASSWORD_CHANGE",
      beforeData: null,
      afterData: { message: String(err) },
    });

    return NextResponse.json(
      { ok: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
