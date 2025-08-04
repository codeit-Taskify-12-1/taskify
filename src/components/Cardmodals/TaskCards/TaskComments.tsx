import { useEffect, useState, useRef } from "react";
import { getComments, deleteComment, updateComment } from "@/src/api/comments";
import styled from "styled-components";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface TaskCommentsProps {
  cardId: number;
  comments: any[];
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
  handleOpenEditModal?: () => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({
  cardId,
  comments,
  setComments,
  handleOpenEditModal,
}) => {
  const [loading, setLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (cardId) {
      fetchComments();
    }
  }, [cardId]);



  const fetchComments = async () => {
    if (!cardId || loading) return;
    
    setLoading(true);
    try {
      const response = await getComments(cardId, 100, null);
      if (response && response.comments) {
        setComments(response.comments);
      }
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    }
    setLoading(false);
  };

  const closeDropdown = () => {
    setOpenDropdownId(null);
  };

  const handleEditClick = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    closeDropdown();
  };

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return;
    try {
      await updateComment(commentId, editContent);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: editContent }
            : comment
        )
      );
      setEditingCommentId(null);
      closeDropdown();
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  const handleDeleteClick = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      closeDropdown();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  return (
    <CommentListWrapper>
      <CommentListContainer>
        <CommentList>
          {comments.map((comment) => (
            <TaskCommentItem key={comment.id}>
              <ProfileImage src={comment.author.profileImageUrl} alt="프로필" />
              <CommentContentWrapper>
                <CommentHeader>
                  <CommentMeta>
                    <CommentAuthor>{comment.author.nickname}</CommentAuthor>
                    <CommentTime>
                      {dayjs(comment.createdAt).format("YYYY.MM.DD HH:mm")}
                    </CommentTime>
                  </CommentMeta>
                  <DropdownContainer>
                    <DropdownIcon
                      src="/icons/kebab.svg"
                      alt="메뉴"
                      width={16}
                      height={16}
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === comment.id ? null : comment.id
                        )
                      }
                    />
                                         {openDropdownId === comment.id && (
                       <DropdownMenu className="dropdown-menu">
                        {editingCommentId === comment.id ? (
                          <DropdownItem
                            onClick={() => handleUpdateComment(comment.id)}
                          >
                            저장
                          </DropdownItem>
                        ) : (
                          <DropdownItem onClick={() => handleEditClick(comment)}>
                            수정
                          </DropdownItem>
                        )}
                        <DropdownItem
                          onClick={() => handleDeleteClick(comment.id)}
                        >
                          삭제
                        </DropdownItem>
                      </DropdownMenu>
                    )}
                  </DropdownContainer>
                </CommentHeader>
                {editingCommentId === comment.id ? (
                  <EditInput
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <TaskCommentText>{comment.content}</TaskCommentText>
                )}
              </CommentContentWrapper>
            </TaskCommentItem>
          ))}
          {loading && (
            <LoadingText>로딩 중...</LoadingText>
          )}
        </CommentList>
      </CommentListContainer>
    </CommentListWrapper>
  );
};

export default TaskComments;

const LoadingText = styled.div`
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
`;

const EditInput = styled.textarea`
  width: 80%;
  min-height: 60px;
  max-height: 100px;
  padding: 6px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
  overflow-y: auto;
  word-break: break-word;
  white-space: pre-wrap;
  background: white;
`;

const CommentListWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const CommentListContainer = styled.div`
  height: 300px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
  }
`;

const CommentList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const TaskCommentItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-bottom: 1px solid #eee;
  width: 100%;
  min-height: 60px;
  padding-bottom: 8px;

  word-break: break-word;
  white-space: pre-wrap;
  margin-top: 12px;
`;

const CommentContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CommentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const CommentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const CommentAuthor = styled.span`
  font-weight: bold;
  font-size: 16px;
  color: #333;
`;

const CommentTime = styled.span`
  font-size: 14px;
  color: #999;
`;

const TaskCommentText = styled.p`
  font-size: 16px;
  color: #333;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  min-height: initial;
  padding: 2px 0;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownIcon = styled.img`
  cursor: pointer;
  width: 16px;
  height: 16px;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 100%;
  right: 0;

  background: white;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 4px 6px;
  text-align: center;
  width: 60px;
  height: 50px;
  margin: 8px;

  @media (min-width: 768px) {
    width: 70px;
    height: 60px;
    padding: 5px 7px;
  }

  @media (min-width: 1024px) {
    width: 80px;
    height: 70px;
    padding: 6px 8px;
  }
`;

const DropdownItem = styled.li`
  cursor: pointer;
  white-space: nowrap;
  margin-bottom: 4px;
  padding: 1px 0;
  font-size: 12px;
  &:hover {
    background: #f1effd;
    color: #5534da;
  }

  @media (min-width: 768px) {
    font-size: 13px;
    margin-bottom: 5px;
    padding: 2px 0;
  }

  @media (min-width: 1024px) {
    font-size: 14px;
    margin-bottom: 6px;
    padding: 2px 0;
  }
`;

const ProfileImage = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
`;
