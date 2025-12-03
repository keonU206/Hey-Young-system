import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET: 과목 목록 (심플 버전, relation은 id만 사용) */
export async function GET() {
  try {
    const list = await prisma.courses.findMany({
      orderBy: { id: "asc" },
    });

    const safe = list.map((c) => ({
      id: Number(c.id),
      code: c.code,
      title: c.title,
      section: c.section,
      semester_id: Number(c.semester_id),
      instructor_id: Number(c.instructor_id),
      room_default: c.room_default,
    }));

    return NextResponse.json({ ok: true, courses: safe });
  } catch (err) {
    console.error("GET /api/admin/courses error:", err);
    return NextResponse.json(
      { ok: false, message: "과목 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** POST: 과목 개설
 * body: { adminLoginId, code, title, section?, semester_id, instructor_id, room_default? }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const adminLoginId = String(body.adminLoginId || "").trim();
    const code = String(body.code || "").trim();
    const title = String(body.title || "").trim();
    const section = body.section ? String(body.section).trim() : null;
    const semester_id = Number(body.semester_id);
    const instructor_id = Number(body.instructor_id);
    const room_default = body.room_default
      ? String(body.room_default).trim()
      : null;

    if (!adminLoginId || !code || !title || !semester_id || !instructor_id) {
      return NextResponse.json(
        {
          ok: false,
          message: "관리자, 과목코드, 과목명, 학기, 담당교원은 필수입니다.",
        },
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

    // unique(code, semester_id, section) 체크
    const exists = await prisma.courses.findFirst({
      where: {
        code,
        semester_id: BigInt(semester_id),
        section: section ?? null,
      },
    });
    if (exists) {
      return NextResponse.json(
        {
          ok: false,
          message: "해당 학기에 동일 코드/분반의 과목이 이미 존재합니다.",
        },
        { status: 409 }
      );
    }

    const created = await prisma.courses.create({
      data: {
        code,
        title,
        section,
        semester_id: BigInt(semester_id),
        instructor_id: BigInt(instructor_id),
        room_default,
      },
    });

    return NextResponse.json({
      ok: true,
      course: {
        id: Number(created.id),
        code: created.code,
        title: created.title,
        section: created.section,
        semester_id: Number(created.semester_id),
        instructor_id: Number(created.instructor_id),
        room_default: created.room_default,
      },
    });
  } catch (err) {
    console.error("POST /api/admin/courses error:", err);
    return NextResponse.json(
      { ok: false, message: "과목을 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** PATCH: 과목 수정
 * body: { adminLoginId, id, code?, title?, section?, semester_id?, instructor_id?, room_default? }
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const adminLoginId = String(body.adminLoginId || "").trim();
    const id = Number(body.id);

    const code = body.code ? String(body.code).trim() : undefined;
    const title = body.title ? String(body.title).trim() : undefined;
    const section =
      body.section !== undefined ? String(body.section).trim() : undefined;
    const semester_id =
      body.semester_id !== undefined ? Number(body.semester_id) : undefined;
    const instructor_id =
      body.instructor_id !== undefined ? Number(body.instructor_id) : undefined;
    const room_default =
      body.room_default !== undefined
        ? String(body.room_default).trim()
        : undefined;

    if (!adminLoginId || !id) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보 또는 과목 ID가 누락되었습니다." },
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

    const data: any = {};
    if (code !== undefined) data.code = code;
    if (title !== undefined) data.title = title;
    if (section !== undefined) data.section = section || null;
    if (semester_id !== undefined) data.semester_id = BigInt(semester_id);
    if (instructor_id !== undefined) data.instructor_id = BigInt(instructor_id);
    if (room_default !== undefined) data.room_default = room_default || null;

    const updated = await prisma.courses.update({
      where: { id: BigInt(id) },
      data,
    });

    return NextResponse.json({
      ok: true,
      course: {
        id: Number(updated.id),
        code: updated.code,
        title: updated.title,
        section: updated.section,
        semester_id: Number(updated.semester_id),
        instructor_id: Number(updated.instructor_id),
        room_default: updated.room_default,
      },
    });
  } catch (err) {
    console.error("PATCH /api/admin/courses error:", err);
    return NextResponse.json(
      { ok: false, message: "과목 정보를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** DELETE: 과목 삭제
 * body: { adminLoginId, id }
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const adminLoginId = String(body.adminLoginId || "").trim();
    const id = Number(body.id);

    if (!adminLoginId || !id) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보 또는 과목 ID가 누락되었습니다." },
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

    await prisma.courses.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/courses error:", err);
    return NextResponse.json(
      { ok: false, message: "과목을 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
