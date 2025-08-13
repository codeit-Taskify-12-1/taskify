import { useState } from "react";
import { Button } from "../../button/CustomButton2";
import { CheckModal } from "./modal/Check";
import axiosInstance from "@/src/api/axios";
import { useRouter } from "next/router";

export default function DeleteContainer({
  dashboardId,
}: {
  dashboardId: string;
}) {
  const [isModal, setIsModal] = useState<boolean>(false);
  const isMessage = "이 대시보드를 삭제하시겠습니까?";
  const [isDashboardId, setIsDashboardId] = useState(dashboardId);

  const router = useRouter();

  const handleShowModal = () => {
    setIsModal(true);
    setIsDashboardId(dashboardId);
  };

  async function deleteDashboard() {
    try {
      await axiosInstance.delete(`/dashboards/${isDashboardId}`);
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      {isModal && (
        <CheckModal
          dashboard
          isModal={isModal}
          setIsModal={setIsModal}
          isMessage={isMessage}
          deleteDashboard={deleteDashboard}
        />
      )}
      <Button onClick={handleShowModal} $half>
        대시보드 삭제하기
      </Button>
    </>
  );
}
