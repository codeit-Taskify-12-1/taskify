import React, { ChangeEvent, useEffect, useState } from "react";

import styles from "@/pages/mypage/mypage.module.scss";
import AvatarUploader from "./avataruploader";
import { updateProfile } from "@/src/api/userApi";
import axiosInstance from "@/src/api/axios";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { CheckModal } from "../dashboard/edit/modal/Check";

interface ProfileCardProps {
  email: string;
  recentNickname: string;
  recentProfileImg: string | StaticImport | null;
}

export default function ProfileCard({
  email,
  recentNickname,
  recentProfileImg,
}: ProfileCardProps) {
  const [isModal, setIsModal] = useState<boolean>(false);
  const isMessage = "변경이 완료 되었습니다.";
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reqImage, setReqImage] = useState<File | null | undefined>();
  const [isProfileImage, setIsProfileImage] = useState();
  const [isNicknameValue, setIsNicknameValue] = useState(recentNickname);
  const [isThumbnail, setIsThumbnail] = useState(recentProfileImg);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleNicknameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setIsNicknameValue(e.target.value);
  };

  const handleSave = async () => {
    setLoading(true);
    setIsModal(true);

    if (reqImage !== undefined) {
      try {
        const response = await axiosInstance.post(
          "/users/me/image",
          {
            image: reqImage,
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const { data } = response;
        setIsProfileImage(data.profileImageUrl);
      } catch (err) {
        console.error(err);
      }
    }
    setIsUpdate(true);
  };

  useEffect(() => {
    if (isUpdate) {
      try {
        updateProfile(isNicknameValue, isProfileImage);
        console.log("프로필 저장 완료", {
          isNicknameValue,
          profileImage: isProfileImage,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsUpdate(false);
        setIsDisabled(true);
        setLoading(false);
      }
    }
  }, [isUpdate]);

  useEffect(() => {
    if (
      (recentNickname === isNicknameValue &&
        recentProfileImg === isThumbnail) ||
      isNicknameValue === "" ||
      isThumbnail === ""
    ) {
      setIsDisabled(true);
    } else if (
      (recentNickname !== isNicknameValue &&
        recentProfileImg !== isThumbnail) ||
      recentNickname !== isNicknameValue ||
      recentProfileImg !== isThumbnail
    ) {
      setIsDisabled(false);
    }
  }, [isNicknameValue, isThumbnail]);

  return (
    <>
      {isModal && (
        <CheckModal
          isModal={isModal}
          setIsModal={setIsModal}
          isMessage={isMessage}
        />
      )}
      <div className={styles.profileCard}>
        <h2>프로필</h2>
        <div className={styles.profileInfo}>
          <AvatarUploader
            setReqImage={setReqImage}
            isThumbnail={isThumbnail}
            setIsThumbnail={setIsThumbnail}
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
                defaultValue={recentNickname}
                onChange={(e) => {
                  handleNicknameInput(e);
                }}
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={styles.saveButton}
          disabled={isDisabled}
        >
          {loading ? "저장 중" : "저장"}
        </button>
      </div>
    </>
  );
}
