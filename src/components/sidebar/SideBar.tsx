"use client";

import styles from "./SideBar.module.scss";
import Image from "next/image";
import Link from "next/link";
import CustomModal from "../modal/CustomModal";
import CreateBoard from "../dashboardlist/createDashboard/createDashboard";
import { useState, useEffect } from "react";
import axiosInstance from "@/src/api/axios";
import { Dashboard } from "@/src/types/dashboard";
import Pagination from "../pagination/Pagination";

interface DashboardListProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
export default function SideBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [total, setTotal] = useState(0);


  const [isMobile, setIsMobile] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const test = async () => {
      const res = await axiosInstance.get("/dashboards", {
        params: { navigationMethod: "pagination", page, size },
      });
      setDashboards(res.data.dashboards);
      setTotal(res.data.totalCount);
    };
    test();
  }, [page, size]);

  const handleDashboardCreate = (newDashboard: Dashboard) => {
    setDashboards((prev) => [newDashboard, ...prev].slice(0, size));
    setTotal((prev) => prev + 1);
    closeModal();
    //react.qurey로 상태 관리하기

    window.location.reload();
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarcontent}>
        <Link href="/dashboard">
          <Image
            style={{ margin: "-5px" }}
            src={
              isMobile ? "/icons/mobile-logo.svg" : "/icons/dashboardlogo.svg"
            }
            width={isMobile ? 80 : 110}
            height={isMobile ? 35 : 40}
            alt="dashboardlogo.svg"
            priority
          />
        </Link>
        <div className={styles.subtitles}>
          <div className={styles.subtitle}>Dash Boards</div>
          <div>
            <Image
              src="/icons/add_box.svg"
              width={20}
              height={20}
              alt="더하기 버튼"
              priority
              onClick={openModal}
              style={{ cursor: "pointer" }}
            />
            {isModalOpen && (
              <CustomModal isOpen={isModalOpen} onClose={closeModal}>
                <CreateBoard
                  onClose={closeModal}
                  onDashboardCreate={handleDashboardCreate}
                  dashboardName={dashboards}
                  setDashboardName={function (name: string): void {
                    throw new Error("Function not implemented.");
                  }}
                  selectedColor={""}
                  setSelectedColor={function (color: string): void {
                    throw new Error("Function not implemented.");
                  }}
                  handleCreate={function (): Promise<void> {
                    throw new Error("Function not implemented.");
                  }}
                />
              </CustomModal>
            )}
          </div>
        </div>

        <div className={styles.scroll}>
          {dashboards.map((dashboard, index) => (
            <Link
              key={`${dashboard.id}-${index}`}
              href={`/dashboard/${dashboard.id}`}
            >
              <div className={styles.dashboardlist}>
                <div
                  className={styles.colorCircle}
                  style={{ backgroundColor: dashboard.color }}
                ></div>
                <div className={styles.showNone}>{dashboard.title}</div>
                {dashboard.createdByMe && (
                  <Image
                    className={styles.showNone}
                    src="/icons/crown.svg"
                    alt="Crown"
                    width={16}
                    height={16}
                  />
                )}
              </div>
            </Link>
          ))}
          <Pagination
            currentPage={page}
            totalPages={Math.floor(total / size)}
            onPageChange={setPage}
          />
          <div style={{ height: "20px", background: "transparent" }}></div>
        </div>
      </div>
    </div>
  );
}
