import axiosInstance from "./axios";

export const uploadCardImage = async (columnId: number, image: File) => {
  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await axiosInstance.post(
      `/columns/${columnId}/card-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("업로드된 카드 이미지 URL:", response.data.imageUrl);
    return response.data.imageUrl;
  } catch (error) {
    console.error("카드 이미지 업로드 실패:", error);
    throw error;
  }
};
