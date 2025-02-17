"use client";

import Image from "next/image";
import styles from "./NavBar.module.scss";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getMe } from "@/src/api/meApi";
import { InviteButton } from "../dashboard/edit/InviteButton";
import { useEdit } from "@/src/contexts/dashboard/edit/EditDashboardProvider";
import { getDashboard } from "@/src/api/dashboardApi";
import Dropdown from "@/src/components/nav/dropdown/Dropdown";
import { isDocumentDefined } from "swr/_internal";

export default function NavBar() {
  const router = useRouter();
  const params = router.query.id;
  const pathname = router.asPath;

  const [headerTitle, setHeaderTitle] = useState("내 대시보드");
  const [userData, setUserData] = useState<any>(null);
  const [createByMe, setCreateByMe] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropDownOpen((prev) => !prev); // 🔄 클릭할 때마다 열고 닫기
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropDownOpen(false);
      }
    }

    if (isDropDownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropDownOpen]);

  // 초대하기 생성 후 초대 내역 리스트 업데이트 02.16_혜림
  const [updateInvite, setUpdateInvite] = useState(false);
  const { getInvitations } = useEdit();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getMe();
        setUserData(user); // 유저 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []); // 이 부분은 컴포넌트가 처음 렌더링될 때만 실행

  useEffect(() => {
    if (!pathname) return;

    if (pathname.startsWith("/dashboard/") && params) {
      const dashboardId = Number(params);

      // ✅ API 호출하여 대시보드 상세 정보 가져오기
      const fetchDashboard = async () => {
        try {
          const dashboard = await getDashboard(dashboardId);
          setHeaderTitle(dashboard.title);
          setCreateByMe(dashboard.createdByMe);
        } catch (error) {
          console.error("대시보드 상세 불러오기 실패:", error);
          setHeaderTitle("잘못된 상세 페이지");
        }
      };

      fetchDashboard();
    } else {
      setHeaderTitle("내 대시보드");
      setCreateByMe(false);
    }
  }, [pathname, params]);

  // 초대하기 생성 후 초대 내역 리스트 업데이트 02.16_혜림
  useEffect(() => {
    if (updateInvite) getInvitations();

    setUpdateInvite(false);
  }, [updateInvite]);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.leftSection}>
          <span className={styles.dashboardTitle}>
            {headerTitle}
            {createByMe && (
              <Image src="/icons/crown.svg" width={20} height={20} alt="초대" />
            )}
          </span>
        </div>
        <div className={styles.rightSection}>
          {/* 대시보드 상세 및 수정 페이지에서만 활성화 02.16_혜림 */}
          {(router.route === `/dashboard/[id]` ||
            router.route === `/dashboard/[id]/edit`) && (
            <>
              {/* 수정 페이지 링크 추가 02.15_혜림 */}
              {router.route === `/dashboard/[id]` && (
                <Link href={`/dashboard/${params}/edit`}>
                  <button className={styles.navButton}>
                    <Image
                      src="/icons/settings.svg"
                      width={20}
                      height={20}
                      alt="설정"
                    />
                    관리
                  </button>
                </Link>
              )}

              {/* 초대하기 모달 및 기능 연동 02.15_혜림 */}
              <InviteButton
                $nav
                dashboardId={params}
                setUpdateInvite={setUpdateInvite}
              >
                <Image
                  src="/icons/add_box.svg"
                  width={20}
                  height={20}
                  alt="초대"
                />
                초대하기
              </InviteButton>
              <div>
                <hr className={styles.hr} />
              </div>
            </>
          )}
          <div className={styles["profile-container"]} ref={dropdownRef}>
            <div className={styles.profile} onClick={toggleDropdown}>
              <span className={styles.profileIcon}>
                {userData ? userData.email[0] : "?"}
              </span>
              <span className={styles.profileName}>
                {userData ? userData.nickname : "로딩중..."}
              </span>
            
            {isDropDownOpen && (
              <div className={styles.dropdown}>
                <Dropdown  />
              </div>
            )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
