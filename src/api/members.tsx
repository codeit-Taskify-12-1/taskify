import axiosInstance from "./axios";

export const getMembers = async (dashboardId: number) => {
  try {
    console.log(
      "🟢 API 요청 URL:",
      axiosInstance.defaults.baseURL + "/members"
    );
    console.log("🟢 요청 파라미터: dashboardId =", dashboardId);

    const response = await axiosInstance.get("/members", {
      params: {
        dashboardId,
      },
    });

    console.log("🟢 getMembers 응답 데이터:", response.data);
    console.log("🟢 API에서 받은 멤버 데이터:", response.data.members);

    const membersWithProfileImage = response.data.members.map(
      (member: any) => ({
        id: member.id,
        userId: Number(member.userId),
        nickname: member.nickname,
        profileImageUrl: member.profileImageUrl ?? null,
      })
    );

    console.log("🟢 변환된 assigneeList 최종 값:", membersWithProfileImage);

    return { members: membersWithProfileImage };
  } catch (error: any) {
    console.error(
      "❌ getMembers API 호출 실패:",
      error?.response?.data || error
    );
    return { members: [] };
  }
};
