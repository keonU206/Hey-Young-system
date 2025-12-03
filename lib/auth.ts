import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET 환경변수가 설정되지 않았습니다.");
}

const secret = new TextEncoder().encode(secretKey);

export type AuthTokenPayload = {
  id: number;
  login_id: string;
  name: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
};

// 5분짜리 토큰 발급
export async function signAuthToken(payload: AuthTokenPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("5m")
    .sign(secret);
}

export async function verifyAuthToken(
  token: string
): Promise<AuthTokenPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as AuthTokenPayload;
}
