import styled from "styled-components";
import { Button } from "../../button/CustomButton2";
import styles from "./EditPage.style.module.scss";
import { MemberItem } from "@/src/components/dashboard/edit/EditPageType";
import Image from "next/image";

const EmptyData = styled.div`
  padding: 40px 0;
  font-size: 14px;
  color: #9fa6b2;
  text-align: center;
`;

export function MemberList({
  isMembersData,
  handleShowModal,
}: {
  isMembersData: MemberItem[] | undefined;
  handleShowModal: (userId: number) => void;
}) {
  return (
    <>
      {isMembersData?.length !== 0 ? (
        <>
          <p className={styles.title}>이름</p>
          <ul className={styles.memberList}>
            {isMembersData &&
              isMembersData?.map((item) => {
                const { id, email, profileImageUrl, isOwner } = item;
                return (
                  <li key={id} className={styles.tile}>
                    <div className={styles.profileCover}>
                      <div className={styles.thumbnail}>
                        {profileImageUrl ? (
                          <Image
                            src={profileImageUrl}
                            width={100}
                            height={100}
                            alt="프로필 이미지"
                          />
                        ) : (
                          email[0]
                        )}
                      </div>
                      <div className={styles.nickname}>
                        <p>{item.nickname}</p>
                        {isOwner && (
                          <Image
                            src="/icons/crown.svg"
                            width={20}
                            height={20}
                            alt="초대"
                          />
                        )}
                      </div>
                    </div>
                    {!isOwner && (
                      <Button onClick={() => handleShowModal(id)} $sub>
                        삭제
                      </Button>
                    )}
                  </li>
                );
              })}
          </ul>
        </>
      ) : (
        <EmptyData>구성원이 없습니다</EmptyData>
      )}
    </>
  );
}
