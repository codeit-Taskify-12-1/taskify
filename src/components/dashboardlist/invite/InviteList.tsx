import React, { Dispatch, SetStateAction, useState } from "react";
import styles from "./InviteList.module.scss";
import SearchBar from "./SearchBar";
import None from "./none";
import { acceptInvite, rejectInvite } from "@/src/api/dashboardApi"; // acceptInvite, rejectInvite 함수 임포트

interface Invite {
  id: number;
  dashboard: { id: number; title: string };
  inviter: { nickname: string };
  inviteAccepted: boolean; // 초대 수락 여부 필드
}

interface InviteDashboardListProps {
  invitations: Invite[];
  onAcceptInvite: (dashboardId: number) => void; // 대시보드 수락 후 처리 함수
  setInvitations: Dispatch<SetStateAction<any[]>>;
}

const InviteDashboardList: React.FC<InviteDashboardListProps> = ({
  invitations,
  onAcceptInvite,
  setInvitations,
}) => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
  // const [updatedInvitations, setUpdatedInvitations] = useState(invitations); // 필터링된 초대 목록 상태

  // 검색어에 맞게 초대 목록 필터링
  const filteredInvitations = invitations.filter((invite) =>
    invite.dashboard.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 초대 수락 처리 함수
  const handleAccept = async (invitationId: number, dashboardId: number) => {
    try {
      await acceptInvite(invitationId); // 초대 수락 API 호출

      setInvitations(
        (prevInvitations) =>
          prevInvitations.filter((invite) => invite.id !== invitationId) // 수락한 초대 목록에서 제거
      );

      onAcceptInvite(dashboardId); // 대시보드 추가 처리 (부모 컴포넌트로 전달)
    } catch (error) {
      console.error("초대 수락 실패:", error);
    }
  };

  // 초대 거절 처리 함수
  const handleReject = async (invitationId: number) => {
    try {
      await rejectInvite(invitationId); // 초대 거절 API 호출

      setInvitations(
        (prevInvitations) =>
          prevInvitations.filter((invite) => invite.id !== invitationId) // 거절한 초대 목록에서 제거
      );
    } catch (error) {
      console.error("초대 거절 실패:", error);
    }
  };

  return (
    <div style={{ width: "90%" }}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* 검색바 컴포넌트 */}
      <div className={styles.inviteTable}>
        <div className={styles.inviteHeader}>
          <span>이름</span>
          <span>초대자</span>
          <span>수락 여부</span>
        </div>
        {filteredInvitations.length > 0 ? (
          filteredInvitations.map((invite) => (
            <div key={invite.id} className={styles.inviteRow}>
              <span>{invite.dashboard.title}</span>
              <span>{invite.inviter.nickname}</span>
              <div className={styles.buttonGroup}>
                {!invite.inviteAccepted ? (
                  <>
                    <button
                      className={styles.accept}
                      onClick={() =>
                        handleAccept(invite.id, invite.dashboard.id)
                      } // 수락 버튼 클릭 시
                    >
                      수락
                    </button>
                    <button
                      className={styles.reject}
                      onClick={
                        () => handleReject(invite.id) // 거절 버튼 클릭 시
                      }
                    >
                      거절
                    </button>
                  </>
                ) : (
                  <span>초대 수락됨</span> // 이미 수락된 초대는 버튼이 안 보임
                )}
              </div>
            </div>
          ))
        ) : (
          <None /> // 초대 목록이 없을 때 표시
        )}
      </div>
    </div>
  );
};

export default InviteDashboardList;
