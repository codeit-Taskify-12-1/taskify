"use client";

import { useEffect, useState } from "react";
import NavBar from "@/src/components/nav/NavBar";
import SideBar from "@/src/components/sidebar/SideBar";
import styles from "./index.module.scss";
import { getDashboards } from "@/src/api/dashboardApi";
import None from "@/src/components/dashboardlist/invite/none";
import InviteDashboardList from "@/src/components/dashboardlist/invite/InviteList";
import DashboardList from "@/src/components/dashboardlist/DashBoardList";
import { useInView } from "react-intersection-observer";
import axiosInstance from "@/src/api/axios";


export default function MyDashboardPage() {
  


  const [dashboards, setDashboards] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [cursorId, setCursorId] = useState<number>();

  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView && cursorId !== null) {
      const fetchInvitations = async () => {
        try {
          const res = cursorId
            ? await axiosInstance.get("/invitations", {
                params: { cursorId },
              })
            : await axiosInstance.get("/invitations");

          const newInvitations = res.data.invitations;
          const newCursorId = res.data.cursorId;

          setInvitations((prevInvitations) => {
            return [...prevInvitations, ...newInvitations];
          });
          setCursorId(newCursorId);
        } catch (error) {
          console.error("초대 리스트 불러오기 실패:", error);
        }
      };

      fetchInvitations();
    }
  }, [inView]);

  useEffect(() => {}, [invitations]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { dashboards = [] } = await getDashboards();
        setDashboards(dashboards);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);
      }
    }
    fetchData();
  }, []);

  // 초대 수락 후 대시보드 추가 처리
  const handleAddDashboard = (dashboardId: number) => {
    // 대시보드 추가 로직
    const newDashboard = { id: dashboardId, title: "새로운 대시보드" };
    setDashboards((prevDashboards) => [...prevDashboards, newDashboard]);
  };

  return (
    <div className={styles.contents}>
      <SideBar />
      <NavBar />
      <div className={styles.content}>
        <div>
          <div className={styles.dashboard}></div>
          <DashboardList />
        </div>

        <div className={styles.inviteContent}>
          <h2>초대받은 대시보드</h2>
          {invitations.length > 0 ? (
            <InviteDashboardList
              invitations={invitations}
              onAcceptInvite={handleAddDashboard} // 초대 수락 후 대시보드 목록에 추가하는 함수 전달
              setInvitations={setInvitations}
            />
          ) : (
            <None />
          )}
        </div>
        <div ref={ref}></div>
      </div>
    </div>
  );
}
