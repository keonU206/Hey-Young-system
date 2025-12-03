import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuthToken } from "@/lib/auth";

export async function GET() {
  try {
    const token = cookies().get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "로그인 정보가 없습니다." },
        { status: 401 }
      );
    }

    const payload = await verifyAuthToken(token);

    return NextResponse.json({
      ok: true,
      user: payload, // { id, login_id, name, role }
    });
  } catch (err) {
    console.error("GET /api/me error:", err);
    return NextResponse.json(
      { ok: false, message: "인증이 만료되었거나 유효하지 않습니다." },
      { status: 401 }
    );
  }
}
