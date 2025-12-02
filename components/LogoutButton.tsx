"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("currentUser");
    }
    router.push("/login");
  };

  return (
    <button className="btn btn-secondary" onClick={handleLogout}>
      로그아웃
    </button>
  );
}
