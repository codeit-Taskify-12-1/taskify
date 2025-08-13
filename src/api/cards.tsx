import axiosInstance from "./axios";

export const getCardDetail = async (cardId: number) => {
  try {
    const response = await axiosInstance.get(`/cards/${cardId}`);
    return response.data;
  } catch (error: any) {
    console.error(
      "카드 상세 조회 실패:",
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
};

export const updateCard = async (cardId: number, updateData: any) => {
  try {
    const response = await axiosInstance.put(`/cards/${cardId}`, updateData);
    return response.data;
  } catch (error: any) {
    console.error(
      "카드 수정 실패:",
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
};

export const deleteCard = async (cardId: number) => {
  try {
    await axiosInstance.delete(`/cards/${cardId}`);
  } catch (error: any) {
    console.error(
      "카드 삭제 실패:",
      error.response?.status,
      error.response?.data
    );
    throw error;
  }
};
