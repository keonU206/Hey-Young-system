import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

const KNOWN_KEYS = [
  "current_semester_id",
  "allow_student_signup",
  "attendance_grace_minutes",
] as const;
type KnownKey = (typeof KNOWN_KEYS)[number];

type SettingsPayload = {
  current_semester_id: number | null;
  allow_student_signup: boolean;
  attendance_grace_minutes: number;
};

export async function GET() {
  try {
    const rows = await prisma.system_settings.findMany({
      where: { key: { in: KNOWN_KEYS as unknown as string[] } },
    });

    const map = new Map<string, string>();
    rows.forEach((r) => map.set(r.key, r.value));

    const settings: SettingsPayload = {
      current_semester_id: map.has("current_semester_id")
        ? Number(map.get("current_semester_id"))
        : null,
      allow_student_signup: map.get("allow_student_signup") === "true",
      attendance_grace_minutes: map.has("attendance_grace_minutes")
        ? Number(map.get("attendance_grace_minutes"))
        : 10,
    };

    return NextResponse.json({ ok: true, settings });
  } catch (err) {
    console.error("GET /api/admin/settings error:", err);
    return NextResponse.json(
      { ok: false, message: "시스템 설정을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// PATCH: 정책 변경
// body: { adminLoginId, settings: { ... } }
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const adminLoginId = String(body.adminLoginId || "").trim();
    const newSettings: Partial<SettingsPayload> = body.settings || {};

    if (!adminLoginId) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보가 누락되었습니다." },
        { status: 400 }
      );
    }

    const admin = await prisma.users.findUnique({
      where: { login_id: adminLoginId },
    });
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json(
        { ok: false, message: "관리자 권한이 없습니다." },
        { status: 403 }
      );
    }

    const oldRows = await prisma.system_settings.findMany({
      where: { key: { in: KNOWN_KEYS as unknown as string[] } },
    });
    const oldMap = new Map<string, string>();
    oldRows.forEach((r) => oldMap.set(r.key, r.value));

    const upsertSetting = async (key: KnownKey, value: string) => {
      await prisma.system_settings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    };

    // 실제 반영
    if (newSettings.current_semester_id !== undefined) {
      await upsertSetting(
        "current_semester_id",
        newSettings.current_semester_id === null
          ? ""
          : String(newSettings.current_semester_id)
      );
    }
    if (newSettings.allow_student_signup !== undefined) {
      await upsertSetting(
        "allow_student_signup",
        newSettings.allow_student_signup ? "true" : "false"
      );
    }
    if (newSettings.attendance_grace_minutes !== undefined) {
      await upsertSetting(
        "attendance_grace_minutes",
        String(newSettings.attendance_grace_minutes)
      );
    }

    // 감사 로그: 정책 변경
    await logAudit({
      actorId: admin.id,
      targetType: "POLICY",
      targetId: 0,
      action: "SYSTEM_SETTINGS_UPDATE",
      before: Object.fromEntries(oldMap),
      after: newSettings,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PATCH /api/admin/settings error:", err);
    return NextResponse.json(
      { ok: false, message: "시스템 설정을 저장하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
