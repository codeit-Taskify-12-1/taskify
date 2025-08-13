import { useEffect, useState } from "react";
import styles from "./EditPage.style.module.scss";
import { useEdit } from "@/src/contexts/dashboard/edit/EditDashboardProvider";
import { MemberItem } from "@/src/components/dashboard/edit/EditPageType";
import { CheckModal } from "./modal/Check";
import axiosInstance from "@/src/api/axios";
import { Toast } from "./toast/Toast";
import { useEditToast } from "@/src/hooks/dashboard/edit/useEditToast";
import { MemberList } from "./MemberList";
import { PaginationButton } from "./PaginationButton";

export default function MemberContainer() {
  const [isMembersData, isSetMemberData] = useState<MemberItem[]>();
  const [isTotalCount, setIsTotalCount] = useState(1);
  const [isModal, setIsModal] = useState<boolean>(false);
  const isMessage = "선택된 구성원을 삭제하시겠습니까?";
  const [isDeleteId, setIsDeleteId] = useState<number>();
  const [isUpdate, setIsUpdate] = useState(false);

  const {
    memberPage,
    isMembers,
    getMembers,
    handlePrevClick,
    handleNextClick,
    setMemberPage,
  } = useEdit();

  const { isToast, setIsToast } = useEditToast();

  // 모달 출력
  const handleShowModal = (userId: number) => {
    setIsModal(true);
    setIsDeleteId(userId);
  };

  // 구성원 삭제 API 호출
  async function deleteMember() {
    try {
      setIsUpdate(true);
      const res = await axiosInstance.delete(`/members/${isDeleteId}`);
      setIsUpdate(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdate(false);
    }
  }

  // 구성원 삭제 후 내역 업데이트
  useEffect(() => {
    if (isMembers) getMembers();
  }, [isUpdate]);

  // 렌더링 시 데이터 화면 출력
  useEffect(() => {
    if (isMembers) {
      const { members, totalCount } = isMembers;
      isSetMemberData(members);
      setIsTotalCount(Math.ceil(totalCount / 4));
    }
  }, [isMembers]);

  // 구성원 삭제 진행 시 빈 내역이 되면 이전 데이터를 출력
  useEffect(() => {
    if (isMembersData?.length === 0 && isTotalCount >= 1) {
      setMemberPage((prevPage) => (prevPage -= 1));
    }
  }, [isMembersData]);

  return (
    <>
      {isToast && <Toast setIsToast={setIsToast} member />}
      {isModal && (
        <CheckModal
          member
          isModal={isModal}
          setIsModal={setIsModal}
          setIsToast={setIsToast}
          isMessage={isMessage}
          deleteMember={deleteMember}
        />
      )}
      <div className={`${styles.container} ${styles.section2}`}>
        <div className={styles.head}>
          <p className={styles.title}>구성원</p>
          <div className={styles.controlCover}>
            <div className={styles.pagination}>
              <p className={styles.number}>
                {isTotalCount >= 1 ? isTotalCount : 1} 페이지 중 {memberPage}
              </p>
              <div className={styles.buttonContainer}>
                <PaginationButton
                  disabled={memberPage === 1 ? true : false}
                  $left
                  name="member"
                  onClick={(e) => handlePrevClick(e)}
                />
                <PaginationButton
                  disabled={isTotalCount === memberPage || isTotalCount <= 1}
                  $right
                  name="member"
                  onClick={(e) => handleNextClick(e)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.contents}>
          <MemberList
            isMembersData={isMembersData}
            handleShowModal={handleShowModal}
          ></MemberList>
        </div>
      </div>
    </>
  );
}
