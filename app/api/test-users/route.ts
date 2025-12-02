// app/api/test-users/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // schema.prisma에 model 이름이 users 인지 User 인지 보고 맞춰줘야 함
    const users = await prisma.users.findMany({
      take: 5,
    });

    return NextResponse.json({ ok: true, users });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
