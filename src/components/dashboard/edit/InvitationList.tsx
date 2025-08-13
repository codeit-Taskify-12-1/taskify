import { InviteItem } from "@/src/components/dashboard/edit/EditPageType";
import styles from "./EditPage.style.module.scss";
import { Button } from "../../button/CustomButton2";
import styled from "styled-components";

const EmptyData = styled.div`
  padding: 40px 0;
  font-size: 14px;
  color: #9fa6b2;
  text-align: center;
`;

export function InvitationList({
  isInvitationsData,
  handleShowModal,
}: {
  isInvitationsData: InviteItem[] | undefined;
  handleShowModal: (invitationId: number) => void;
}) {
  return (
    <>
      {isInvitationsData?.length !== 0 ? (
        <>
          <p className={styles.title}>이메일</p>
          <ul className={styles.memberList}>
            {isInvitationsData &&
              isInvitationsData.map((item) => {
                const { invitee, id: invitationId } = item;
                return (
                  <li key={item.id} className={styles.tile}>
                    <div className={styles.profileCover}>
                      <p className={styles.email}>{invitee.email}</p>
                    </div>
                    <Button onClick={() => handleShowModal(invitationId)} $sub>
                      취소
                    </Button>
                  </li>
                );
              })}
          </ul>
        </>
      ) : (
        <EmptyData>초대한 이메일이 없습니다</EmptyData>
      )}
    </>
  );
}
