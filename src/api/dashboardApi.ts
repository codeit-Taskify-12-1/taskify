import axiosInstance from "./axios";
import { IDashboardParams, IInviteParams } from "../types/dashboard";

// ✅ 세션 스토리지에서 토큰을 가져오는 로직을 `fetchWithAuth`에 통합
async function fetchWithAuth(url: string, params?: object) {
  try {
    if (typeof window === "undefined") return null;

    // 세션 스토리지에서 토큰 가져오기
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Token not found in sessionStorage");
      return null;
    }

    const res = await axiosInstance.get(url, { params });
    return res.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null; // 오류 발생 시 기본값 반환
  }
}

async function PUThWithAuth(url: string, params?: any) {
  try {
    if (typeof window === "undefined") return null;

    // 세션 스토리지에서 토큰 가져오기
    const accessToken = sessionStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("Token not found in sessionStorage");
      return null;
    }

    const res = await axiosInstance.put(url, { ...params?.body });

    return res.data;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null; // 오류 발생 시 기본값 반환
  }
}

export async function getDashboards({
  navigationMethod = "pagination",
  teamId = "12-1",
  ...params
}: IDashboardParams = {}) {
  return fetchWithAuth("/dashboards", { navigationMethod, teamId, ...params });
}

export async function getDashboard(dashboardId: number) {
  return fetchWithAuth(`/dashboards/${dashboardId}`);
}

export async function getInviteList({
  teamId = "12-1",
  ...params
}: IInviteParams = {}) {
  return fetchWithAuth("/invitations", { teamId, ...params });
}

export async function acceptInvite(invitationId: number) {
  return PUThWithAuth(`/invitations/${invitationId}`, {
    method: "PUT",
    body: { invitationId, inviteAccepted: true },
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function rejectInvite(invitationId: number) {
  return PUThWithAuth(`/invitations/${invitationId}`, {
    method: "PUT",
    body: { invitationId, inviteAccepted: false }, // Update status to false for rejection
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getColumns(dashboardId: number) {
  return fetchWithAuth("/columns", { dashboardId });
}

export async function getCards(size: number = 10, columnId: number) {
  return fetchWithAuth("/cards", { size, columnId });
}

export async function addCards(cardData: {
  assigneeUserId: number;
  dashboardId: number;
  columnId: number;
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
  imageUrl: string;
}) {
  try {
    const response = await axiosInstance.post(`/cards`, {
      assigneeUserId: cardData.assigneeUserId,
      dashboardId: cardData.dashboardId,
      columnId: cardData.columnId,
      title: cardData.title,
      description: cardData.description,
      dueDate: cardData.dueDate,
      tags: cardData.tags,
      imageUrl: cardData.imageUrl,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding card:", error);
    throw error;
  }
}

export const updateColumnTitle = async (columnId: number, newTitle: string) => {
  try {
    const response = await axiosInstance.put(`/columns/${columnId}`, {
      title: newTitle,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating column title:", error);
    throw error;
  }
};

export const deleteColumn = async (columnId: number) => {
  try {
    const response = await axiosInstance.delete(`/columns/${columnId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting column:", error);
    throw error;
  }
};

export const deleteCard = async (cardId: number) => {
  try {
    const response = await axiosInstance.delete(`/cards/${cardId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting column:", error);
    throw error;
  }
};

export const uploadImage = async (columnId: number, formData: FormData) => {
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
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
