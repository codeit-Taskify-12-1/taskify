import React from "react";
import { createPortal } from "react-dom";
import styles from "./CustomTaskEditModal.module.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width: string;
  height: string;
}

export default function CustomTaskEditModal({
  isOpen,
  onClose,
  children,
  width,
  height,
  className,
}: ModalProps & { className?: string }) {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${className || ""}`}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
