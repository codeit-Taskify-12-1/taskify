import { useState } from "react";
import { Dashboard } from "@/src/types/dashboard";
import styles from "./createDashboard.module.scss";
import axiosInstance from "@/src/api/axios";
import Image from "next/image";

interface CreateBoardProps {
  onClose: () => void;
  onDashboardCreate: (newDashboard: Dashboard) => void;
  dashboardName: Dashboard[]; 
  setDashboardName: (name: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  handleCreate: () => Promise<void>;
}

export default function CreateBoard({
  onClose,
  onDashboardCreate,
}: CreateBoardProps) {
  const [dashboardName, setDashboardName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const colors = [
    { code: "#7ac555", className: styles.colorGreen },
    { code: "#760dde", className: styles.colorPurple },
    { code: "#ffa500", className: styles.colorOrange },
    { code: "#76a5ea", className: styles.colorBlue },
    { code: "#e876ea", className: styles.colorPink },
  ];

  const handleCreate = async () => {
    if (!dashboardName.trim()) {
      alert("대시보드 이름을 입력해주세요.");
      return;
    }

    if (!selectedColor) {
      alert("색상을 선택해주세요.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/dashboards",
        { title: dashboardName, color: selectedColor },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        onDashboardCreate?.(response.data);
        setDashboardName("");
        setSelectedColor("");
        onClose();
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error: any) {
      console.error("Axios Error:", error.response?.data || error.message);
      
    }
  };

  return (
    <div className={styles.modalContent}>
      <h1>새로운 대시보드</h1>
      <div className={styles.modalTitle}>대시보드이름</div>
      <input
        placeholder="대시보드 이름을 입력해주세요"
        className={styles.modalInput}
        value={dashboardName}
        onChange={(e) => setDashboardName(e.target.value)}
      />
      <div className={styles.colorDiv}>
        {colors.map(({ code, className }) => (
          <div
            key={code}
            className={`${styles.color} ${className}`}
            onClick={() => setSelectedColor(code)}
          >
            {selectedColor === code && (
              <Image
                src="/icons/Vector.svg"
                width={15}
                height={11}
                alt="체크 표시"
                className={styles.colorCheck}
              />
            )}
          </div>
        ))}
      </div>
      <div className={styles.buttonGroup}>
        <button className={styles.cancle} onClick={onClose}>
          취소
        </button>
        <button className={styles.create} onClick={handleCreate}>
          생성
        </button>
      </div>
    </div>
  );
}