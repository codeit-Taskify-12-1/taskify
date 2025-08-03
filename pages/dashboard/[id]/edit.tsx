import { useRouter } from "next/router";
import Head from "next/head";
import styled from "styled-components";
import styles from "../index.module.scss";
import NavBar from "@/src/components/nav/NavBar";
import SideBar from "@/src/components/sidebar/SideBar";
import BackLocation from "@/src/components/dashboard/edit/BackLocation";
import DashboardContainer from "@/src/components/dashboard/edit/DashboardContainer";
import DeleteContainer from "@/src/components/dashboard/edit/DeleteContainer";
import InvitationContainer from "@/src/components/dashboard/edit/InvitationContainer";
import MemberContainer from "@/src/components/dashboard/edit/MemberContainer";
import { EditProvider } from "@/src/contexts/dashboard/edit/EditDashboardProvider";

const Container = styled.div`
  width: calc(100vw * 375 / 1200);
  min-width: 600px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 50px);
  @media (max-width: 1300px) {
    width: 100%;
    min-width: 100%;
  }
`;

export default function EditPage() {
  const router = useRouter();
  const dashboardId = router.query.id as string;

  return (
    <>
      <Head>
        <title>Taskify - 대시보드 수정</title>
      </Head>
      <EditProvider dashboardId={dashboardId}>
        <div className={styles.contents}>
          <SideBar />
          <NavBar />
          <div className={styles.content}>
            <Container>
              <BackLocation />
              <DashboardContainer dashboardId={dashboardId} />
              <MemberContainer />
              <InvitationContainer dashboardId={dashboardId} />
              <DeleteContainer dashboardId={dashboardId} />
            </Container>
          </div>
        </div>
      </EditProvider>
    </>
  );
}
