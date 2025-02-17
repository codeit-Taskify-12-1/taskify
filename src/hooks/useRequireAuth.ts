"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = sessionStorage.getItem("accessToken"); // 세션 스토리지 사용
    if (!token) {
      router.replace("/login");
    }
  }, []);
}