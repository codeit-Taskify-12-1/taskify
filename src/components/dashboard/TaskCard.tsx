import Image from "next/image";
import styles from "./TaskCard.module.scss";
import { useState } from "react";
import TaskCardModal from "../modals/cards/TaskCardModal";
import React from 'react';

export default function TaskCard({
  card,
  key,
  columnTitle,
  columnId,
  dashboardId,
  onCardDelete,
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const dueDate = card.dueDate;
  const date = dueDate ? dueDate.split(" ")[0] : "";

  return (
    <div className={styles.taskWrapper}>
      <div onClick={openModal}>
        <div className={styles.tabletContent}>
          <Image
            className={styles.taskImg}
            src={card.imageUrl}
            width={274}
            height={160}
            alt="카드 이미지"
          />
          <div className={styles.tabletWidth}>
            <h3>{card.title}</h3>
            <div className={styles.tabletRow}>
              <div>
                {card.tags.map((tag: string) => (
                  <span className={styles.tag} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
              <div className={styles.bottom}>
                <div className={styles.date}>
                  <Image
                    src="/icons/calendar.svg"
                    width={20}
                    height={20}
                    alt="설정"
                  />
                  <p>{date}</p>
                </div>
                <div className={styles.name}>{card.assignee.nickname[0]}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <TaskCardModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onOpenEditModal={() => {}}
          cardId={card.id}
          columnTitle={columnTitle}
          columnId={columnId}
          dashboardId={dashboardId}
        />
      )}
    </div>
  );
}
