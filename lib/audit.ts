import { prisma } from "@/lib/prisma";

export type AuditTargetType =
  | "DEPARTMENT"
  | "SEMESTER"
  | "COURSE"
  | "USER"
  | "ATTENDANCE"
  | "POLICY"
  | "SYSTEM"
  | "OTHER";

type LogAuditParams = {
  actorId: number | bigint | null; // null 이면 시스템 작업
  targetType: AuditTargetType;
  targetId: number | bigint;
  action: string; // 예: "CREATE", "UPDATE", "DELETE", "ATTENDANCE_APPROVED"
  before?: unknown;
  after?: unknown;
};

export async function logAudit({
  actorId,
  targetType,
  targetId,
  action,
  before,
  after,
}: LogAuditParams) {
  try {
    await prisma.audit_logs.create({
      data: {
        actor_id: actorId !== null ? BigInt(actorId) : BigInt(0), // 시스템 작업이면 0 같은 dummy id 사용 or 시스템 유저 id
        target_type: targetType,
        target_id: BigInt(targetId),
        action,
        before_data: before as any,
        after_data: after as any,
      },
    });
  } catch (err) {
    // 감사 로그 실패는 서비스 로직 깨지면 안 되므로 그냥 콘솔만
    console.error("logAudit error:", err);
  }
}
