import { User } from "@/src/types/users";
import axios from "axios";
import axiosInstance from "./axios";

// 사용자 정보 API 함수 (getUser)
export const getUser = async (): Promise<User> => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      // 토큰이 없을 경우 로그인 페이지로 리다이렉트
      window.location.href = "/login"; // 로그인 페이지로 이동
      throw new Error("Access token is missing.");
    }

    const response = await axiosInstance.get(
      "/users/me", // 사용자 정보 가져오는 URL
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Authorization 헤더에 access token 추가
        },
      }
    );
    return response.data; // 응답 데이터 반환
  } catch (error) {
    console.error("사용자 데이터 불러오기 실패:", error);
    throw error;
  }
};

// 사용자 프로필 수정 API 함수
export const updateProfile = async (
  nickname: string,
  profileImage: string | null
) => {
  try {
    const accessToken = sessionStorage.getItem("accessToken");

    if (!accessToken) {
      // 토큰이 없을 경우 로그인 페이지로 리다이렉트
      window.location.href = "/login"; // 로그인 페이지로 이동
      throw new Error("Access token is missing.");
    }

    const formData = new FormData();
    formData.append("nickname", nickname);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    const response = await axiosInstance.put("/users/me", formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("프로필 업데이트 실패:", error);
    throw error;
  }
};
