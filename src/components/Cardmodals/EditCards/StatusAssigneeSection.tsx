import React, { useEffect, useState } from "react";
import TaskColumn from "../TaskCards/TaskColumn";
import styles from "./StatusAssigneeSection.module.scss";
import Image from "next/image";

interface Assignee {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl?: string | null;
}

interface Column {
  id: number;
  title: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  tags: string[];
  dueDate: string | null;
  assigneeUserId: number | null;
  columnId: number | null;
  imageUrl: string | null;
}

interface StatusAssigneeSectionProps {
  columns: Column[];
  formData: Task;
  setFormData: React.Dispatch<React.SetStateAction<Task>>;
  assigneeList: Assignee[];
}

const StatusAssigneeSection: React.FC<StatusAssigneeSectionProps> = ({
  columns,
  formData,
  setFormData,
  assigneeList,
}) => {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isAssigneeDropdownOpen, setIsAssigneeDropdownOpen] = useState(false);

  const handleColumnSelect = (columnId: number) => {
    setFormData((prev) => ({
      ...prev,
      columnId,
    }));
    setTimeout(() => {
      setFormData((prev) => ({
        ...prev,
        columnId, // ✅ 컬럼 변경 후 강제 리렌더링 유도
      }));
    }, 100);

    setIsStatusDropdownOpen(false);
  };

  const handleAssigneeSelect = (userId: number) => {
    setFormData((prev) => ({
      ...prev,
      assigneeUserId: userId,
    }));
    setIsAssigneeDropdownOpen(false);
  };

  const selectedAssignee = assigneeList.find(
    (a) => a.userId === formData.assigneeUserId
  );

  console.log("현재 assigneeList 값:", assigneeList);
  console.log("formData.assigneeUserId:", formData.assigneeUserId);
  console.log("assigneeList에서 찾은 값:", selectedAssignee);
  console.log(
    "선택된 담당자의 프로필 이미지:",
    selectedAssignee?.profileImageUrl
  );

  useEffect(() => {
    console.log("✅ assigneeList 변경됨:", assigneeList);
  }, [assigneeList]);

  return (
    <div className={styles.statusAssigneeContainer}>
      {/* 상태 선택 - TaskColumn + 커스텀 드롭다운 */}
      <div className={styles.dropdownSection}>
        <label>상태</label>
        <div
          className={styles.columnDropdown}
          onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
        >
          {/* 현재 선택된 컬럼 표시 (TaskColumn 스타일 적용) */}
          <div className={styles.columnDropdownBox}>
            <TaskColumn
              columnTitle={
                columns.find((col) => col.id === formData.columnId)?.title ||
                "컬럼 선택"
              }
            />
            <Image
              src="/icons/todomodalmanagertoggle.png"
              alt="드롭다운 화살표"
              width={8.17}
              height={4.48}
              className={styles.dropdownIcon}
            />
          </div>
          {/* 드롭다운 리스트 */}
          {isStatusDropdownOpen && (
            <ul className={styles.dropdownList}>
              {columns.map((column) => (
                <li
                  key={column.id}
                  className={styles.dropdownItem}
                  onClick={() => handleColumnSelect(column.id)}
                >
                  <div className={styles.checkIconWrapper}>
                    {formData.columnId === column.id && (
                      <Image
                        src="/icons/Vector 3.svg"
                        alt="체크"
                        width={13.2}
                        height={9.7}
                        className={styles.checkIcon}
                      />
                    )}
                  </div>
                  <TaskColumn columnTitle={column.title} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className={styles.dropdownSection}>
        <label>담당자</label>
        <div
          className={styles.columnDropdown}
          onClick={() => setIsAssigneeDropdownOpen(!isAssigneeDropdownOpen)}
        >
          {/* 현재 선택된 담당자 표시 */}
          <div className={styles.columnDropdownBox}>
            {selectedAssignee ? (
              <div className={styles.selectedAssignee}>
                {selectedAssignee.profileImageUrl &&
                selectedAssignee.profileImageUrl.trim() !== "" ? (
                  <img
                    src={selectedAssignee.profileImageUrl}
                    alt="프로필"
                    className={styles.profileImage}
                  />
                ) : (
                  <div className={styles.assigneeCircle}>
                    {selectedAssignee.nickname[0]}
                  </div>
                )}
                {selectedAssignee.nickname}
              </div>
            ) : (
              "담당자 선택"
            )}
            <Image
              src="/icons/todomodalmanagertoggle.png"
              alt="드롭다운 화살표"
              width={8.17}
              height={4.48}
              className={styles.dropdownIcon}
            />
          </div>

          {isAssigneeDropdownOpen && (
            <ul className={styles.dropdownList}>
              {assigneeList.map((assignee) => (
                <li
                  key={assignee.id}
                  className={styles.dropdownItem}
                  onClick={() => handleAssigneeSelect(assignee.userId)}
                >
                  <div className={styles.checkIconWrapper}>
                    {formData.assigneeUserId === assignee.userId && (
                      <Image
                        src="/icons/Vector 3.svg"
                        alt="체크"
                        width={13.2}
                        height={9.7}
                        className={styles.checkIcon}
                      />
                    )}
                  </div>

                  {assignee.profileImageUrl &&
                  assignee.profileImageUrl.trim() !== "" ? (
                    <img
                      src={assignee.profileImageUrl}
                      alt="프로필"
                      className={styles.profileImage}
                    />
                  ) : (
                    <div className={styles.assigneeCircle}>
                      {assignee.nickname ? assignee.nickname[0] : "?"}
                    </div>
                  )}

                  <span className={styles.assigneeName}>
                    {assignee.nickname}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusAssigneeSection;
