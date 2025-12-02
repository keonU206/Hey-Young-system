import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const loginId = String(body.loginId || "").trim();
    const currentPassword = String(body.currentPassword || "");
    const newPassword = String(body.newPassword || "");

    if (!loginId || !currentPassword || !newPassword) {
      return NextResponse.json(
        {
          ok: false,
          message: "현재 비밀번호와 새 비밀번호를 모두 입력해 주세요.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
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
      return NextResponse.json(
        { ok: false, message: "사용자 정보를 찾을 수 없습니다." },
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

    // 2) 현재 비밀번호 검증
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
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

    return NextResponse.json({
      ok: true,
      message: "비밀번호가 성공적으로 변경되었습니다.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
