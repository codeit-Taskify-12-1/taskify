"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/pages/mypage/mypage.module.scss";
import ProfileCard from "./profilecard";
import PasswordCard from "./passwordcard";
import { User } from "@/src/types/users";

interface ProfileSettingsProps {
  user: User;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const { nickname: recentNickname, profileImageUrl: recentProfileImg } = user;

  const router = useRouter();

  return (
    <div className={styles.global}>
      <div className={styles.profileSettings}>
        <button className={styles.backButton} onClick={() => router.back()}>
          &lt; 돌아가기
        </button>

        <ProfileCard
          recentNickname={recentNickname}
          email={user.email}
          recentProfileImg={recentProfileImg}
        />

        <PasswordCard />

      
      </div>
    </div>
  );
};

export default ProfileSettings;
