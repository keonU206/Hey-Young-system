import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/** GET: 학기 목록 */
export async function GET() {
  try {
    const list = await prisma.semesters.findMany({
      orderBy: { id: "asc" },
    });

    const safe = list.map((s) => ({
      id: Number(s.id),
      name: s.name,
      start_date: s.start_date,
      end_date: s.end_date,
      total_weeks: s.total_weeks,
    }));

    return NextResponse.json({ ok: true, semesters: safe });
  } catch (err) {
    console.error("GET /api/admin/semesters error:", err);
    return NextResponse.json(
      { ok: false, message: "학기 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** POST: 학기 추가
 * body: { adminLoginId, name, start_date, end_date, total_weeks }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const adminLoginId = String(body.adminLoginId || "").trim();
    const name = String(body.name || "").trim();
    const start_date = body.start_date ? new Date(body.start_date) : undefined;
    const end_date = body.end_date ? new Date(body.end_date) : undefined;
    const total_weeks = Number(body.total_weeks);

    if (!adminLoginId || !name || !start_date || !end_date || !total_weeks) {
      return NextResponse.json(
        { ok: false, message: "관리자, 학기명, 기간, 주차 수는 필수입니다." },
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

    // name은 unique
    const exists = await prisma.semesters.findUnique({
      where: { name },
    });
    if (exists) {
      return NextResponse.json(
        { ok: false, message: "이미 존재하는 학기 이름입니다." },
        { status: 409 }
      );
    }

    const created = await prisma.semesters.create({
      data: {
        name,
        start_date,
        end_date,
        total_weeks,
      },
    });

    return NextResponse.json({
      ok: true,
      semester: {
        id: Number(created.id),
        name: created.name,
        start_date: created.start_date,
        end_date: created.end_date,
        total_weeks: created.total_weeks,
      },
    });
  } catch (err) {
    console.error("POST /api/admin/semesters error:", err);
    return NextResponse.json(
      { ok: false, message: "학기를 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** PATCH: 학기 수정
 * body: { adminLoginId, id, name?, start_date?, end_date?, total_weeks? }
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const adminLoginId = String(body.adminLoginId || "").trim();
    const id = Number(body.id);

    const name = body.name ? String(body.name).trim() : undefined;
    const start_date = body.start_date ? new Date(body.start_date) : undefined;
    const end_date = body.end_date ? new Date(body.end_date) : undefined;
    const total_weeks =
      body.total_weeks !== undefined ? Number(body.total_weeks) : undefined;

    if (!adminLoginId || !id) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보 또는 학기 ID가 누락되었습니다." },
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
    if (name !== undefined) data.name = name;
    if (start_date !== undefined) data.start_date = start_date;
    if (end_date !== undefined) data.end_date = end_date;
    if (total_weeks !== undefined) data.total_weeks = total_weeks;

    const updated = await prisma.semesters.update({
      where: { id: BigInt(id) },
      data,
    });

    return NextResponse.json({
      ok: true,
      semester: {
        id: Number(updated.id),
        name: updated.name,
        start_date: updated.start_date,
        end_date: updated.end_date,
        total_weeks: updated.total_weeks,
      },
    });
  } catch (err) {
    console.error("PATCH /api/admin/semesters error:", err);
    return NextResponse.json(
      { ok: false, message: "학기 정보를 수정하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

/** DELETE: 학기 삭제
 * body: { adminLoginId, id }
 */
export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const adminLoginId = String(body.adminLoginId || "").trim();
    const id = Number(body.id);

    if (!adminLoginId || !id) {
      return NextResponse.json(
        { ok: false, message: "관리자 정보 또는 학기 ID가 누락되었습니다." },
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

    await prisma.semesters.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/admin/semesters error:", err);
    return NextResponse.json(
      { ok: false, message: "학기를 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
