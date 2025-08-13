"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./Dropdown.module.scss";


export default function Dropdown() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    router.push("/");
  };

  return (
    <div className={styles["dropmenu-container"]}>
      <div className={styles["button-container"]}>
        <button className={styles["menu-button"]} onClick={handleLogout}>
          로그아웃
        </button>
      </div>
      <div className={styles["button-container"]}>
        <Link href="/mypage" className={styles["menu-button"]}>
          내 정보
        </Link>
      </div>
    </div>
  );
}
