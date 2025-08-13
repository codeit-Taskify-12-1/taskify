import { useState } from "react";
import styled from "styled-components";
import axiosInstance from "@/src/api/axios";
import Image from "next/image";
interface TaskDropdownProps {
  cardId: number;
  onOpenEditModal: () => void;
  onClose: () => void;
}

const TaskDropdown: React.FC<TaskDropdownProps> = ({
  cardId,
  onOpenEditModal,
  onClose,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const handleDeleteCard = async () => {
    try {
      await axiosInstance.delete(`/cards/${cardId}`);
      alert("카드가 삭제되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("카드 삭제 실패:", error);
    }
  };

  return (
    <DropdownContainer>
      <ButtonGroup>
        <IconButton onClick={() => setDropdownOpen(!dropdownOpen)}>
          <Image src="/icons/kebab.svg" alt="메뉴" width={28} height={28} />
        </IconButton>
        <IconButton onClick={onClose}>
          <Image src="/icons/close.svg" alt="닫기" width={28} height={28} />
        </IconButton>
      </ButtonGroup>
      {dropdownOpen && (
        <DropdownMenu>
          <DropdownItem onClick={onOpenEditModal}>수정하기</DropdownItem>
          <DropdownItem onClick={handleDeleteCard}>삭제하기</DropdownItem>
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
};

export default TaskDropdown;

const DropdownContainer = styled.div`
  position: relative;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 24px; /* 케밥 아이콘과 닫기 버튼 사이 간격 유지 */
  justify-content: flex-end;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0; /* 패딩 제거 */

  img {
    width: 28px;
    height: 28px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  list-style: none;
  padding: 8px 0;
  min-width: 120px;
`;

const DropdownItem = styled.li`
  padding: 10px 16px;
  cursor: pointer;
  text-align: center;
  &:hover {
    background: #f1f1f1;
  }
`;
