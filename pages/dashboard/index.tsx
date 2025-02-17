"use client";

import { useEffect, useState } from "react";
import NavBar from "@/src/components/nav/NavBar";
import SideBar from "@/src/components/sidebar/SideBar";
import styles from "./index.module.scss";
import { getDashboards, getInviteList } from "@/src/api/dashboardApi";
import None from "@/src/components/dashboardlist/invite/none";
import InviteDashboardList from "@/src/components/dashboardlist/invite/InviteList";
import DashboardList from "@/src/components/dashboardlist/DashBoardList"; // 이 부분을 다시 활성화 가능


export default function MyDashboardPage() {


  
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { dashboards = [] } = await getDashboards();
        const { invitations = [] } = await getInviteList();
        setDashboards(dashboards);
        setInvitations(invitations);
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

        {/* 초대받은 대시보드 */}
        <div className={styles.inviteContent}>
          <h2>초대받은 대시보드</h2>
          {invitations.length > 0 ? (
            <InviteDashboardList
              invitations={invitations}
              onAcceptInvite={handleAddDashboard} // 초대 수락 후 대시보드 목록에 추가하는 함수 전달
            />
          ) : (
            <None />
          )}
        </div>
      </div>
    </div>
  );
}
