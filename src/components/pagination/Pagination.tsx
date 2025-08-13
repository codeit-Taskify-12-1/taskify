import React from "react";
import styles from "./Pagination.module.scss";


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  //이전페이지로 이동
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  //다음페이지로 이동
  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <>
      <div className={styles.pagination}>
        <span>
          {totalPages} 페이지 중 {currentPage}
        </span>
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className={styles.buttonleft}
        >
          &lt;
        </button>
        <button
          className={styles.buttonright}
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </>
  );
}
