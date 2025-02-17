import React, { useState } from "react";
import { useRouter } from "next/router"; 
import styles from "@/pages/mypage/mypage.module.scss";
import AvatarUploader from "./avataruploader";
import { updateProfile } from "@/src/api/userApi"; 

interface ProfileCardProps {
  email: string; 
  nickname: string;
  setNickname: (nickname: string) => void;
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
}

export default function ProfileCard({
  email,
  nickname,
  setNickname,
  profileImage,
  setProfileImage,
}: ProfileCardProps) {
  const router = useRouter(); // router 선언 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 관리
  const [error, setError] = useState<string | null>(null); // 오류 상태 관리

  // handleSave 함수에 async 추가
  const handleSave = async () => { 
    setLoading(true);
    setError(null);

    try {
      await updateProfile( nickname, profileImage );
      console.log("프로필 저장 완료", { nickname, profileImage });
      alert("프로필이 업데이트되었습니다!");
      router.push("/mypage"); // 성공 시 마이페이지로 이동
    } catch (err) {
      setError("프로필 업데이트에 실패했습니다.");
      console.error("프로필 업데이트 오류:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.profileCard}>
      <h2>프로필</h2>
      <div className={styles.profileInfo}>
        <AvatarUploader
          profileImage={profileImage}
          setProfileImage={setProfileImage}
        />

        <div className={styles.profileInputs}>
          <div className={styles.profileInputGroup}>
            <label>이메일</label>
            <input type="email" value={email} disabled />
          </div>

          <div className={styles.profileInputGroup}>
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button
        onClick={handleSave} // 클릭 시 handleSave 실행
        className={styles.saveButton}
        disabled={loading}
      >
        {loading ? "저장 중" : "저장"}
      </button>

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
