import React, { useEffect, useState } from "react";
import styles from "./EditPage.style.module.scss";
import { useEdit } from "@/src/contexts/dashboard/edit/EditDashboardProvider";
import { InviteItem } from "@/src/components/dashboard/edit/EditPageType";
import { CheckModal } from "./modal/Check";
import axiosInstance from "@/src/api/axios";
import { InviteButton } from "./InviteButton";
import { Toast } from "./toast/Toast";
import { useEditToast } from "@/src/hooks/dashboard/edit/useEditToast";
import { InvitationList } from "./InvitationList";
import { PaginationButton } from "./PaginationButton";

export default function InvitationContainer({
  dashboardId,
}: {
  dashboardId: string;
}) {
  const [isInvitationsData, setIsInvitationsData] = useState<InviteItem[]>();
  const [isTotalCount, setIsTotalCount] = useState(1);
  const [isModal, setIsModal] = useState<boolean>(false);
  const isMessage = "선택된 초대를 취소하시겠습니까?";
  const [isInvitationId, setIsInvitationId] = useState<number>();
  const [isUpdate, setIsUpdate] = useState(false);

  const {
    invitePage,
    isInvitations,
    getInvitations,
    handlePrevClick,
    handleNextClick,
    setInvitePage,
  } = useEdit();

  const { isToast, setIsToast } = useEditToast();

  // 모달 출력
  const handleShowModal = (invitationId: number) => {
    setIsModal(true);
    setIsInvitationId(invitationId);
  };

  // 초대 취소 API 호출
  async function deleteInvitation() {
    try {
      setIsUpdate(true);
      await axiosInstance.delete(
        `/dashboards/${dashboardId}/invitations/${isInvitationId}`
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdate(false);
    }
  }

  // 초대 생성 및 취소 후 내역 업데이트
  useEffect(() => {
    if (isInvitations) getInvitations();
  }, [isUpdate]);

  // 렌더링 시 데이터 화면 출력
  useEffect(() => {
    if (isInvitations) {
      const { invitations, totalCount } = isInvitations;
      setIsInvitationsData(invitations);
      setIsTotalCount(Math.ceil(totalCount / 4));
    }
  }, [isInvitations]);

  // 초대 취소 진행 시 빈 내역이 되면 이전 데이터를 출력
  useEffect(() => {
    if (isInvitationsData?.length === 0 && isTotalCount >= 1) {
      setInvitePage((prevPage) => (prevPage -= 1));
    }
  }, [isInvitationsData]);

  return (
    <>
      {isToast && <Toast setIsToast={setIsToast} invite />}
      {isModal && (
        <CheckModal
          invite
          isModal={isModal}
          setIsModal={setIsModal}
          setIsToast={setIsToast}
          isMessage={isMessage}
          deleteInvitation={deleteInvitation}
        />
      )}
      <div className={`${styles.container} ${styles.section3}`}>
        <div className={styles.head}>
          <p className={styles.title}>초대 내역</p>
          <div className={styles.controlCover}>
            <div className={styles.pagination}>
              <p className={styles.number}>
                {isTotalCount >= 1 ? isTotalCount : 1} 페이지 중 {invitePage}
              </p>
              <div className={styles.buttonContainer}>
                <PaginationButton
                  disabled={invitePage === 1 ? true : false}
                  $left
                  name="invite"
                  onClick={(e) => handlePrevClick(e)}
                />
                <PaginationButton
                  disabled={isTotalCount === invitePage || isTotalCount <= 1}
                  $right
                  name="invite"
                  onClick={(e) => handleNextClick(e)}
                />
              </div>
            </div>
            <InviteButton dashboardId={dashboardId} />
          </div>
        </div>
        <div className={styles.contents}>
          <InvitationList
            isInvitationsData={isInvitationsData}
            handleShowModal={handleShowModal}
          ></InvitationList>
        </div>
      </div>
    </>
  );
}
