import axiosInstance from "./axios";

export const getInvitations = async (
  size: number = 10,
  cursorId?: number,
  title?: string
) => {
  try {
    const response = await axiosInstance.get(`/invitations`, {
      params: { size, cursorId, title },
    });
    return response.data;
  } catch (error) {
    console.error("❌ 초대 목록 조회 실패:", error);
    throw error;
  }
};
