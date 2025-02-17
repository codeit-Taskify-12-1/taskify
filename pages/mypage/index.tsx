"use client";

import React from "react";
import useSWR from "swr";
import { getUser } from "@/src/api/userApi";
import { User } from "@/src/types/users";
import styles from "./mypage.module.scss";
import NavBar from "@/src/components/nav/NavBar";
import SideBar from "@/src/components/sidebar/SideBar";
import ProfileSettings from "@/src/components/mypage/profilesetting";



export default function MyPage() {
  

  // useSWR로 사용자 데이터 요청
  const { data: user, error } = useSWR<User>("12-1/users", getUser);

  if (error) return <p>데이터 오류 발생 </p>;
  if (!user) return <p>로딩 중</p>;

  return (
    <div className={styles.global}>
      <NavBar />
      <SideBar />
      <ProfileSettings user={user} />
    </div>
  );
}
