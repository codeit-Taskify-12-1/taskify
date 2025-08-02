import React, { useState, useEffect } from "react";
import StatusAssigneeSection from "./StatusAssigneeSection";
import { getColumns } from "@/src/api/columns";
import { getInvitations } from "@/src/api/invitations";
import { updateCard } from "@/src/api/cards";
import TagInput from "./TagInput";
import DateInputField from "./DateInputField";
import InputField from "./InputField";
import TaskImageUpload from "./TaskImageUpload";
import CustomTaskEditModal from "./CustomTaskEditModal";
import { getMembers } from "@/src/api/members";
import styles from "./TaskEditModal.module.scss";
import { uploadCardImage } from "@/src/api/files";
import dayjs from "dayjs";

// Task 타입 정의
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

interface Assignee {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl?: string;
}

interface Column {
  id: number;
  title: string;
}

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  fetchCards: () => void;
  dashboardId: number;
  updateTaskDetails: (updatedTask: Task) => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({
  isOpen,
  onClose,
  task,
  fetchCards,
  dashboardId,
  updateTaskDetails,
}) => {
  const [formData, setFormData] = useState<Task>({
    ...task,
    assigneeUserId: task.assigneeUserId ?? null,
    imageUrl: task.imageUrl || null,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      columnId: task.columnId,
    }));
  }, [task.columnId]);

  const [columns, setColumns] = useState<Column[]>([]);
  const [assigneeList, setAssigneeList] = useState<Assignee[]>([]);
  const [tags, setTags] = useState<string[]>(task.tags || []);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(task.imageUrl);
  const [assigneeListState, setAssigneeListState] = useState<Assignee[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchColumns = async () => {
      try {
        const data = await getColumns(dashboardId);
        setColumns(data);
        if (task.columnId) {
          const selectedColumn = data.find((col) => col.id === task.columnId);
          if (selectedColumn) {
            setFormData((prev) => ({ ...prev, columnId: selectedColumn.id }));
          }
        }
      } catch (error) {
        console.error("컬럼 목록 조회 실패:", error);
      }
    };

    const fetchAssignees = async () => {
      try {
        console.log("현재 dashboardId:", dashboardId);

        if (!dashboardId || isNaN(Number(dashboardId))) {
          console.error("잘못된 dashboardId:", dashboardId);
          return;
        }

        const data = await getMembers(dashboardId);
        if (!Array.isArray(data.members)) {
          console.warn("API 응답에 members 키가 없음. 빈 배열 사용.");
          setAssigneeList([]);
          return;
        }

        const mappedAssignees = data.members.map((member: any) => ({
          id: member.id,
          userId: Number(member.userId),
          nickname: member.nickname,
          profileImageUrl: member.profileImageUrl || null,
        }));

        setAssigneeList(mappedAssignees);

        setFormData((prev) => ({
          ...prev,
          assigneeUserId:
            prev.assigneeUserId ??
            (mappedAssignees.length > 0 ? mappedAssignees[0].userId : null),
          imageUrl: prev.imageUrl ?? null,
        }));
      } catch (error) {
        console.error("getMembers API 호출 실패:", error);
      }
    };

    if (isOpen) {
      fetchColumns();
      fetchAssignees();
    }
  }, [isOpen, dashboardId, task.columnId]);

  useEffect(() => {
    setTags(task.tags || []);
  }, [task]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl ?? null;

      if (image) {
        if (formData.columnId !== null) {
          imageUrl = await uploadCardImage(formData.columnId, image);
        }
      }

      const formattedDueDate = formData.dueDate
        ? dayjs(formData.dueDate).format("YYYY-MM-DD HH:mm")
        : null;

      const updatedData: Task = {
        ...formData,
        dueDate: formattedDueDate,
        tags: [...tags],
        imageUrl: imageUrl ? imageUrl.trim() : null,
      };

      await updateCard(task.id, updatedData);
      await fetchCards();

      updateTaskDetails(updatedData);

      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error("카드 업데이트 중 에러 발생:", error);
    }
  };

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl: objectUrl });
      setPreviewUrl(objectUrl);
    } else {
      setFormData({ ...formData, imageUrl: null });
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    if (!isOpen || !task) return;
    if (assigneeList.length > 0) {
      setAssigneeListState(assigneeList);
    }
  }, [isOpen, task, assigneeList]);

  // 태그가 변경될 때마다 formData도 업데이트
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      tags: [...tags],
    }));
  }, [tags]);

  // 수정 버튼 활성화 조건 체크
  const isFormValid = () => {
    return (
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.columnId !== null &&
      formData.dueDate !== null
    );
  };

  if (!isOpen || !task) return null;

  return (
    <CustomTaskEditModal
      isOpen={isOpen}
      onClose={onClose}
      width="auto"
      height="auto"
      className={styles.customTaskEditModal}
    >
      <form onSubmit={handleSave}>
        <div className={styles.taskEditTitle}>할 일 수정</div>

        <div className={styles.formGroup}>
          <StatusAssigneeSection
            columns={columns}
            formData={formData}
            setFormData={setFormData}
            assigneeList={assigneeListState}
          />
        </div>

        <div className={styles.formGroup}>
          <InputField
            label="제목 *"
            name="title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <InputField
            label="설명 *"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <DateInputField
            label="마감일 *"
            selectedDate={formData.dueDate ? new Date(formData.dueDate) : null}
            onDateChange={(date) =>
              setFormData({
                ...formData,
                dueDate: date ? date.toISOString() : null,
              })
            }
          />
        </div>

        <div className={styles.formGroup}>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        <div className={styles.formGroup}>
          <div className={styles.imageUploadWrapper}>
            <TaskImageUpload
              imageUrl={previewUrl}
              onImageChange={handleImageChange}
            />
          </div>
        </div>

        <div className="modalButtons">
          <button onClick={onClose} className={styles.cancelButton}>
            취소
          </button>
          <button 
            onClick={handleSave} 
            className={styles.saveButton}
            disabled={!isFormValid()}
          >
            수정
          </button>
        </div>
      </form>
    </CustomTaskEditModal>
  );
};

export default TaskEditModal;
