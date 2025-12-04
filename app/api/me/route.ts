import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 단순 쿠키 파서
function parseCookies(cookieHeader: string | null): Record<string, string> {
  const result: Record<string, string> = {};
  if (!cookieHeader) return result;

  const pairs = cookieHeader.split(";");
  for (const pair of pairs) {
    const [rawKey, ...rest] = pair.trim().split("=");
    if (!rawKey) continue;
    const key = decodeURIComponent(rawKey);
    const value = decodeURIComponent(rest.join("=") || "");
    result[key] = value;
  }
  return result;
}

export async function GET(req: Request) {
  try {
    // 1) 요청 헤더에서 쿠키 직접 읽기
    const cookieHeader = req.headers.get("cookie");
    const allCookies = parseCookies(cookieHeader);
    const token = allCookies["auth_token"];

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "로그인 정보가 없습니다." },
        { status: 401 }
      );
    }

    // 2) JWT 검증 → payload.id로 누군지 확인
    const payload = await verifyAuthToken(token);
    const userId = Number(payload.id);

    if (!userId) {
      return NextResponse.json(
        { ok: false, message: "잘못된 토큰입니다." },
        { status: 401 }
      );
    }

    // 3) DB에서 실제 유저 정보 조회
    const user = await prisma.users.findUnique({
      where: { id: BigInt(userId) },
    });

    if (!user || !user.is_active) {
      return NextResponse.json(
        { ok: false, message: "유효하지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    // 4) 프론트에 내려줄 안전한 유저 객체
    const safeUser = {
      id: Number(user.id),
      login_id: user.login_id,
      name: user.name,
      role: user.role,
      email: user.email, // ✅ DB에 있는 이메일
      department: user.department, // ✅ DB에 있는 학과
      is_active: user.is_active,
    };

    return NextResponse.json({
      ok: true,
      user: safeUser,
    });
  } catch (err) {
    console.error("GET /api/me error:", err);
    return NextResponse.json(
      { ok: false, message: "인증이 만료되었거나 유효하지 않습니다." },
      { status: 401 }
    );
  }
}
