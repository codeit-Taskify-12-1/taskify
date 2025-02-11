"use Client";
import { useState } from "react";
import styles from "./createBoard.module.scss";
import axiosInstance from "@/src/api/axios";

interface CreateBoardProps {
  onClose: () => void; // ✅ 부모에서 모달을 닫을 수 있도록 콜백 추가
}

export default function createBoard({ onClose }: CreateBoardProps) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [dashboardName, setDashboardName] = useState("");
  const [selectedColor, setSelectedColor] = useState(""); // 색상 상태 추가

  const closeModal = () => setIsModalOpen(false);

  const handleCreate = async () => {
    try {
      const response = await axiosInstance.post("/dashboards", {
        title: dashboardName,
        color: selectedColor,
      });

      if (response.status === 200) {
        setIsModalOpen(false);
      } else {
        console.error("Failed to create dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // isModalOpen이 false일 경우 모달을 렌더링하지 않음
  if (!isModalOpen) return null;

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
        {/* 색상 버튼들 */}
        <div
          className={`${styles.color} ${styles.colorGreen}`}
          onClick={() => setSelectedColor("#7ac555")}
          style={{
            border: selectedColor === "#7ac555" ? "2px solid black" : "",
          }}
        />
        <div
          className={`${styles.color} ${styles.colorPurple}`}
          onClick={() => setSelectedColor("#760dde")}
          style={{
            border: selectedColor === "#760dde" ? "2px solid black" : "",
          }}
        />
        <div
          className={`${styles.color} ${styles.colorOrange}`}
          onClick={() => setSelectedColor("#ffa500")}
          style={{
            border: selectedColor === "#ffa500" ? "2px solid black" : "",
          }}
        />
        <div
          className={`${styles.color} ${styles.colorBlue}`}
          onClick={() => setSelectedColor("#76a5ea")}
          style={{
            border: selectedColor === "#76a5ea" ? "2px solid black" : "",
          }}
        />
        <div
          className={`${styles.color} ${styles.colorPink}`}
          onClick={() => setSelectedColor("#e876ea")}
          style={{
            border: selectedColor === "#e876ea" ? "2px solid black" : "",
          }}
        />
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
