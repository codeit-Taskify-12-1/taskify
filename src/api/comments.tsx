import axiosInstance from "./axios";

export const getComments = async (
  cardId: number | null,
  size?: number,
  cursorId: number | null = null
) => {
  try {
    if (!cardId) {
      console.error("cardId가 없습니다! 요청 중단.");
      return null;
    }

    const params: any = { cardId };
    if (size !== undefined) {
      params.size = size;
    }
    if (cursorId) {
      params.cursorId = cursorId;
    }

    const response = await axiosInstance.get(`/comments`, {
      params,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ 댓글 목록 조회 실패:",
      error.response?.status,
      error.response?.data?.message || error.response?.data
    );
    throw error;
  }
};

export const createComment = async (
  cardId: number,
  content: string,
  columnId: number,
  dashboardId: number
) => {
  try {
    const response = await axiosInstance.post(`/comments`, {
      content,
      cardId,
      columnId,
      dashboardId,
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "❌ 댓글 생성 실패:",
      error.response?.status,
      error.response?.data?.message || error.response?.data
    );
    throw error;
  }
};

export const updateComment = async (commentId: number, content: string) => {
  try {
    const response = await axiosInstance.put(`/comments/${commentId}`, {
      content,
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "❌ 댓글 수정 실패:",
      error.response?.status,
      error.response?.data?.message || error.response?.data
    );
    throw error;
  }
};

export const deleteComment = async (commentId: number) => {
  try {
    const response = await axiosInstance.delete(`/comments/${commentId}`);

    return response.data;
  } catch (error: any) {
    console.error(
      "❌ 댓글 삭제 실패:",
      error.response?.status,
      error.response?.data?.message || error.response?.data
    );
    throw error;
  }
};
