import React, { useEffect, useState } from "react";
import CustomModal from "../../modal/CustomModal";
import TaskDropdown from "./TaskDropdown";
import TaskColumn from "./TaskColumn";
import TaskTags from "./TaskTags";
import TaskImage from "./TaskImage";
import TaskAssignee from "./TaskAssignee";
import TaskComments from "./TaskComments";
import TaskCommentInput from "./TaskCommentInput";
import { getCardDetail } from "@/src/api/cards";
import { getComments } from "@/src/api/comments";
import styles from "./TaskCardModal.module.scss";
import TaskEditModal from "../EditCards/TaskEditModal";

interface TaskCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenEditModal: () => void;
  cardId: number;
  columnTitle: string;
  columnId: number;
  dashboardId: number;
}

const TaskCardModal: React.FC<TaskCardModalProps> = ({
  isOpen,
  onClose,
  cardId,
  columnTitle,
  columnId,
  dashboardId,
}) => {
  const [cardData, setCardData] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      getCardDetail(cardId)
        .then((data) => setCardData(data))
        .catch((error) => console.error("카드 상세 조회 실패:", error));

      fetchComments();
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, cardId]);

  const fetchComments = async () => {
    try {
      const response = await getComments(cardId, 10, null);
      if (response && response.comments) {
        setComments(response.comments);
      }
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    }
  };

  const handleOpenEditModal = () => {
    console.log("수정 모달 열기 시도!");
    setIsEditModalOpen(true);
  };

  // ✅ cardData 변경될 때 컬럼 최신화 적용
  useEffect(() => {
    console.log("🔄 TaskCardModal에서 최신 cardData 반영됨:", cardData);
  }, [cardData]);

  return (
    <>
      <CustomModal isOpen={isOpen} onClose={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <TaskDropdown
            cardId={cardId}
            onOpenEditModal={handleOpenEditModal}
            onClose={onClose}
          />

          <div className={styles.headerContainer}>
            <h2 className={styles.title}>{cardData?.title || "제목 없음"}</h2>
          </div>

          <div className={styles.columnAndTagsContainer}>
            <TaskColumn columnTitle={columnTitle} />
            <div className={styles.verticalDivider} />
            <TaskTags tags={cardData?.tags || []} />
          </div>

          <div className={styles.contentWrapper}>
            <div className={styles.leftContent}>
              {cardData?.description && (
                <p className={styles.description}>{cardData.description}</p>
              )}
              <TaskImage imageUrl={cardData?.imageUrl} />
            </div>

            <TaskAssignee
              assignee={cardData?.assignee ?? { nickname: "담당자 없음" }}
              dueDate={cardData?.dueDate ?? "마감일 없음"}
            />
          </div>

          <div className={styles.commentSection}>
            <TaskCommentInput
              cardId={cardId}
              columnId={columnId}
              dashboardId={dashboardId}
              onCommentAdded={fetchComments}
              setComments={setComments}
            />
            <TaskComments
              cardId={cardId}
              comments={comments}
              setComments={setComments}
              handleOpenEditModal={handleOpenEditModal}
            />
          </div>
        </div>
      </CustomModal>
      {isEditModalOpen && (
        <TaskEditModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={cardData}
          fetchCards={fetchComments}
          dashboardId={dashboardId}
          updateTaskDetails={(updatedTask) => {
            setCardData(updatedTask);
          }}
        />
      )}
    </>
  );
};

export default TaskCardModal;
