import React, { SetStateAction, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react"; // ✅ X(삭제) 아이콘 가져오기
import styles from "@/pages/mypage/mypage.module.scss";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface AvatarUploaderProps {
  setReqImage: React.Dispatch<SetStateAction<File | null | undefined>>;
  isThumbnail: string | StaticImport | null;
  setIsThumbnail: React.Dispatch<SetStateAction<string | StaticImport | null>>;
}

export default function AvatarUploader({
  setReqImage,
  isThumbnail,
  setIsThumbnail,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReqImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIsThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // 동일한 파일 선택 시 이벤트가 작동하지 않는 trigger 제거
    event.target.value = "";
  };

  // ✅ 삭제 버튼 클릭 시 이미지 제거 및 파일 입력 필드 초기화
  const handleRemoveImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsThumbnail("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <div className={styles.avatarContainer}>
        {/* ✅ 프로필 이미지와 파일 업로드 */}
        <label className={styles.avatarUpload}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />
          {isThumbnail ? (
            <Image
              src={isThumbnail}
              alt="Profile"
              className={styles.avatar}
              width={100}
              height={100}
            />
          ) : (
            <div className={styles.avatarPlaceholder}>+</div>
          )}
          {/* ✅ X(삭제) 버튼을 프로필 이미지가 있을 때만 표시 */}
          {isThumbnail && (
            <button className={styles.removeButton} onClick={handleRemoveImage}>
              <X size={20} color="white" />
            </button>
          )}
        </label>
      </div>
    </>
  );
}
