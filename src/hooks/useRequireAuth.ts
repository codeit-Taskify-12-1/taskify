"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // ✅ 초기 로딩 상태 추가

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login");
    } else {
      setLoading(false); // ✅ 토큰이 있으면 로딩 종료
    }
  }, [router]);

  return loading; // ✅ 로딩 상태 반환
}
