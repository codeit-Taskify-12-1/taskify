import React from "react";
import { createPortal } from "react-dom";
import styles from "./CustomModal.module.scss";
import styled from "styled-components";

interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  width?: string;
  height?: string;
}

export default function CustomModal({
  isOpen,
  onClose,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className={`${styles.modalOverlay} ${className}`} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    document.body
  );
}
