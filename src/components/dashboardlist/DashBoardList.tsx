import Link from "next/link";
import Image from "next/image";
import ListCard from "@/src/components/dashboardlist/card/ListCard";
import Pagination from "@/src/components/pagination/Pagination"; // ✅ 추가
import styles from "../../../pages/dashboard/index.module.scss";
import { useEffect, useState } from "react";

import { DashBoardResponse, Dashboard } from "@/src/types/dashboard";
import axiosInstance from "@/src/api/axios";
import CustomModal from "../modal/CustomModal";
import CreateBoard from "./createDashboard/createDashboard";

interface DashboardListProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DashboardList() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [total, setTotal] = useState(0);

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
  };
  return (
    <>
      <div className={styles.listcardandpagination}>
        <ListCard>
          <button className={styles.addCard} onClick={openModal}>
            <div>새로운 대쉬보드</div>
            <Image
              src="/icons/chip.svg"
              width={22}
              height={22}
              alt="chip.svg"
              priority
              onClick={openModal}
              style={{ cursor: "pointer" }}
            />
          </button>
        </ListCard>
        <div className={styles.listcard}>
          {dashboards?.map((dashboard) => (
            <Link key={dashboard.id} href={`/dashboard/${dashboard.id}`}>
              <ListCard>
                <div
                  className={styles.colorCircle}
                  style={{ backgroundColor: dashboard.color }}
                ></div>
                <div>{dashboard.title}</div>
                {dashboard.createdByMe && (
                  <Image
                    src="/icons/crown.svg"
                    alt="Crown"
                    width={16}
                    height={16}
                  />
                )}
                <Image
                  src="/icons/arrow.svg"
                  width={22}
                  height={22}
                  alt="arrow.svg"
                  priority
                />
              </ListCard>
            </Link>
          ))}
        </div>

        {isModalOpen && (
          <CustomModal
            className={styles.modal}
            isOpen={isModalOpen}
            onClose={closeModal}
          >
            <CreateBoard
              onClose={closeModal}
              onDashboardCreate={handleDashboardCreate}
              dashboardName={""}
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

        {/* ✅ 페이지네이션 추가 */}
        <div className={styles.pagination}>
          <Pagination
            currentPage={page}
            totalPages={Math.floor(total / size)}
            onPageChange={setPage}
          />
        </div>
      </div>
    </>
  );
}
