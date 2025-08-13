"use client";

import { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Column from "./Column";
import ListCard from "../dashboardlist/card/ListCard";
import Image from "next/image";
import CustomModal from "../modal/CustomModal";
import { useRouter } from "next/router";
import { getColumns } from "@/src/api/dashboardApi";
import styles from "./Board.module.scss";
import axiosInstance from "@/src/api/axios";

export default function Board() {
  const {
    query: { id = "" },
  } = useRouter();

  const [columns, setColumns] = useState<any[]>([]);
  const [newColumnTitle, setNewColumnTitle] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetchColumns();
  }, [id]);

  const fetchColumns = async () => {
    if (!id) return;

    try {
      const response = await getColumns(+id);
      if (response?.result === "SUCCESS") {
        const updatedColumns = response.data.map((column: any) => ({
          ...column,
        }));
        setColumns(updatedColumns);
      }
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  const handleAddColumn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColumnTitle.trim()) return;

    try {
      const response = await axiosInstance.post(`/columns`, {
        title: newColumnTitle,
        dashboardId: +id, // URL에서 가져온 id를 사용
      });

      if (response) {
        setColumns([...columns, { ...response.data }]);
        setIsModalOpen(false);
        setNewColumnTitle("");
      }
    } catch (error) {
      console.error("Error adding column:", error);
    }
  };

  const handleDeleteColumn = (columnId: number) => {
    setColumns(
      (prevColumns) => prevColumns.filter((column) => column.id !== columnId) // 컬럼 삭제 처리
    );
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newColumns = [...columns];

    const sourceColumn = newColumns.find(
      (col) => col.id === source.droppableId
    );
    const destColumn = newColumns.find(
      (col) => col.id === destination.droppableId
    );
    if (!sourceColumn || !destColumn) return;

    setColumns(newColumns);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.boardContainer}>
        {columns.map((column) => (
          <>
            <Column
              key={column.id}
              column={column}
              onDelete={handleDeleteColumn}
            />
            <div className={styles.columnLine} />
          </>
        ))}
        <ListCard className={styles.listCard}>
          <div>새로운 컬럼 추가하기</div>
          <Image
            src="/icons/chip.svg"
            width={22}
            height={22}
            alt="chip.svg"
            priority
            onClick={openModal}
            style={{ cursor: "pointer" }}
          />
        </ListCard>
      </div>

      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={styles.listCardModal}>
          <h2>칼럼 추가하기</h2>
          <div>제목</div>

          <input
            type="text"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            placeholder="컬럼 이름 입력"
            className={styles.input}
          />
          <div className={styles.buttonGroup}>
            <button className={styles.cancle} onClick={closeModal}>
              취소
            </button>
            <button className={styles.create} onClick={handleAddColumn}>
              생성
            </button>
          </div>
        </div>
      </CustomModal>
    </DragDropContext>
  );
}
