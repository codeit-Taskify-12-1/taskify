import Image from "next/image";
import styles from "./TaskCard.module.scss";
import { useState } from "react";
import TaskCardModal from "../modals/cards/TaskCardModal";

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
        <Image
          className={styles.taskImg}
          src={card.imageUrl}
          width={274}
          height={160}
          alt="카드 이미지"
        />
        <h3>{card.title}</h3>
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
      {/* 기존 모달 주석 처리 */}
      {/* {isModalOpen && (
        <CustomModal
          className={styles.modal}
          isOpen={isModalOpen}
          onClose={closeModal}
          width="766px"
        >
          <DetailModal
            card={card}
            columnTitle={columnTitle}
            onClose={closeModal}
            onCardDelete={onCardDelete}
          />
        </CustomModal>
      )} */}
      {/* 새로운 TaskCardModal 적용 */}
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
