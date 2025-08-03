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
  const [cursorId, setCursorId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const dropdownRef = useRef<HTMLUListElement | null>(null);
  const [scrollInfo, setScrollInfo] = useState({ isAtBottom: false, scrollTop: 0, scrollHeight: 0, clientHeight: 0 });
  
  // 클라이언트 사이드 페이지네이션을 위한 상태
  const [allComments, setAllComments] = useState<any[]>([]);
  const [displayedComments, setDisplayedComments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 3;

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;
    
    setScrollInfo({
      isAtBottom,
      scrollTop,
      scrollHeight,
      clientHeight
    });
    
    console.log("스크롤 정보:", { isAtBottom, scrollTop, scrollHeight, clientHeight });
  };

  useEffect(() => {
    if (cardId) {
      console.log("카드 변경됨, 상태 초기화:", cardId);
      // 모달 재접속 시 상태 초기화
      setComments([]);
      setAllComments([]);
      setDisplayedComments([]);
      setCurrentPage(1);
      setCursorId(null);
      setHasMore(true);
      setLoading(false);
      
      // 약간의 지연 후 초기 댓글 로드
      setTimeout(() => {
        fetchComments(true);
      }, 100);
    }
  }, [cardId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdownId(null);
      }
    };

    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  useEffect(() => {
    // 기존 observer 정리
    if (observer.current) {
      observer.current.disconnect();
    }

    // 새로운 observer 설정
    if (hasMore && !loading && displayedComments.length > 0) {
      const trigger = document.getElementById("scroll-trigger");
      if (trigger) {
        console.log("스크롤 트리거 설정됨");
        observer.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting && hasMore && !loading) {
              console.log("스크롤 트리거 감지됨, 추가 댓글 로드");
              fetchComments(false);
            }
          },
          {
            root: null,
            rootMargin: "50px",
            threshold: 0.1,
          }
        );
        observer.current.observe(trigger);
      }
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore, loading, displayedComments.length]);

  const fetchComments = async (reset = false) => {
    if (!cardId || loading) {
      console.log("fetchComments 조건 불충족:", { cardId, loading });
      return;
    }
    
    console.log("fetchComments 시작:", { reset });
    setLoading(true);
    
    try {
      // 모든 댓글을 한번에 가져오기 (size를 충분히 크게 설정)
      const response = await getComments(cardId, 100, null);
      console.log("API 응답:", response);
      
      if (response && response.comments) {
        if (reset) {
          // 초기 로딩: 모든 댓글 저장하고 첫 3개만 표시
          setAllComments(response.comments);
          setDisplayedComments(response.comments.slice(0, commentsPerPage));
          setCurrentPage(1);
          setHasMore(response.comments.length > commentsPerPage);
          console.log("초기 로딩:", { 
            totalComments: response.comments.length, 
            displayedComments: response.comments.slice(0, commentsPerPage).length 
          });
        } else {
          // 추가 로딩: 다음 3개 추가
          const nextPage = currentPage + 1;
          const startIndex = (nextPage - 1) * commentsPerPage;
          const endIndex = startIndex + commentsPerPage;
          const newComments = response.comments.slice(startIndex, endIndex);
          
          setDisplayedComments(prev => [...prev, ...newComments]);
          setCurrentPage(nextPage);
          setHasMore(endIndex < response.comments.length);
          
          console.log("추가 로딩:", { 
            page: nextPage, 
            newComments: newComments.length,
            totalDisplayed: displayedComments.length + newComments.length
          });
        }
      }
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    }
    setLoading(false);
  };

  const handleEditClick = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditContent(comment.content);
    handleOpenEditModal?.();
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
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };

  const handleDeleteClick = async (commentId: number) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };

  return (
    <CommentListWrapper>
      <CommentListContainer
        onScroll={handleScroll}
      >
        <CommentList>
          {displayedComments.map((comment) => (
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
                      <DropdownMenu ref={dropdownRef}>
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
                    onBlur={() => handleUpdateComment(comment.id)}
                  />
                ) : (
                  <TaskCommentText>{comment.content}</TaskCommentText>
                )}
              </CommentContentWrapper>
            </TaskCommentItem>
          ))}
          {hasMore && (
            <div
              id="scroll-trigger"
              style={{ 
                height: "40px", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                padding: "8px",
                margin: "8px 0",
                color: "#999",
                fontSize: "12px"
              }}
            >
              {loading ? "로딩 중..." : "더 보기"}
            </div>
          )}
        </CommentList>
      </CommentListContainer>
    </CommentListWrapper>
  );
};

export default TaskComments;

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
  padding: 8px;
  text-align: center;
  width: 80px;
  height: 60px;
  margin: 8px;
`;

const DropdownItem = styled.li`
  cursor: pointer;
  white-space: nowrap;
  margin-bottom: 8px;
  &:hover {
    background: #f1effd;
    color: #5534da;
  }
`;
const ProfileImage = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
`;
