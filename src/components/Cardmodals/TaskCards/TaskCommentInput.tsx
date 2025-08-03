import { useState } from "react";
import styled from "styled-components";
import { createComment } from "@/src/api/comments";

interface TaskCommentInputProps {
  cardId: number;
  columnId: number;
  dashboardId: number;
  onCommentAdded: () => void;
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
}

const TaskCommentInput: React.FC<TaskCommentInputProps> = ({
  cardId,
  columnId,
  dashboardId,
  onCommentAdded,
  setComments,
}) => {
  const [newComment, setNewComment] = useState<string>("");

  const handleAddComment = async () => {
    const trimmedComment = newComment.trim();
    if (!trimmedComment) {
      console.error("댓글이 비어있음. API 요청 취소");
      return;
    }

    try {
      const newCommentData = await createComment(
        cardId,
        trimmedComment,
        columnId,
        dashboardId
      );

      // 현재 시간을 추가하여 시간 표시 문제 해결
      const commentWithCurrentTime = {
        ...newCommentData,
        createdAt: new Date().toISOString(),
      };

      setNewComment("");

      setComments((prevComments) => [commentWithCurrentTime, ...prevComments]);

      await onCommentAdded();
    } catch (error) {
      console.error("댓글 추가 실패:", error);
    }
  };

  return (
    <>
      <CommentLabel>댓글</CommentLabel>
      <CommentInputContainer>
        <CommentInput
          placeholder="댓글 작성하기"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <SubmitButton onClick={handleAddComment} disabled={!newComment.trim()}>
          입력
        </SubmitButton>
      </CommentInputContainer>
    </>
  );
};

export default TaskCommentInput;

const CommentInputContainer = styled.div`
  position: relative;

  height: 110px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 0;
`;

const CommentLabel = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: #333236;
  margin-top: 16px;
  margin-bottom: 4px;
`;

const CommentInput = styled.textarea`
  position: absolute;
  top: 16px;
  left: 16px;
  width: calc(100% - 115px);
  height: calc(100% - 32px);
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 400;
  color: #333236;
  background: transparent;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  overflow-y: auto;
  resize: none;
`;

const SubmitButton = styled.button`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 83px;
  height: 32.23px;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  font-size: 12px;
  font-weight: 500;
  color: #5534da;
  background: white;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  transition: background-color 0.2s ease-in-out;
  &:hover:enabled {
    background-color: #ede9fe;
  }
  &:disabled {
    color: #aaa;
    cursor: not-allowed;
  }
`;
