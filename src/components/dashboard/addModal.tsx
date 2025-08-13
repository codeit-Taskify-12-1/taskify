import React, { ChangeEvent, useEffect, useState } from "react";
import styles from "./AddModal.module.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addCards, uploadImage } from "../../api/dashboardApi";
import ImageUpload from "./addModal/ImageUpload";
import { useRouter } from "next/router";
import axiosInstance from "@/src/api/axios";
import TaskTags from "../Cardmodals/TaskCards/TaskTags";
import Image from "next/image";
import { styled } from "styled-components";

interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  columnId: number; // columnId를 부모로부터 받아옵니다
  fetchCards: () => void;
}

const AddModal: React.FC<AddModalProps> = ({
  isOpen,
  onClose,
  columnId,
  fetchCards,
}) => {
  const router = useRouter();
  const { id } = router.query;
  const dashboardId = Number(id);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [members, setMembers] = useState<any>([]);
  const [selectedAssignee, setSelectedAssignee] = useState<number | null>(null);

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleSelectUser = (member: any) => {
    setSelectedUser(member);
    setSelectedAssignee(member.userId); // 담당자 ID 설정
    setIsSelectOpen(false); // 선택 후 드롭다운 닫기
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axiosInstance.get("/members", {
          params: { dashboardId },
        });

        setMembers(response.data.members);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMembers();
  }, []);

  const changeUser = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedAssignee(Number(e.target.value));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // 한글 입력 중일 때는 무시
    if (e.key === "Enter" && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      e.preventDefault();
    }
  };

 
  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !dueDate || selectedAssignee === null) {
      setError("제목, 설명, 마감일은 필수 입력 항목입니다.");
      return;
    }
    setError(null);

    try {
      let imageUrl = "";

      // 이미지가 있는 경우 업로드
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const uploadResult = await uploadImage(columnId, formData);
        imageUrl = uploadResult.imageUrl; // 업로드된 이미지의 URL 저장
      }

      const cardData = {
        assigneeUserId: selectedAssignee,
        dashboardId,
        columnId,
        title,
        description,
        dueDate:
          dueDate.toISOString().split("T")[0] +
          " " +
          dueDate.toISOString().split("T")[1].slice(0, 5),
        tags,
        imageUrl,
      };

      // 카드 생성 API 호출
      await addCards(cardData);
      fetchCards();

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error adding card:", error);
      setError("카드를 추가하는 중 오류가 발생했습니다.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate(null);
    setTags([]);
    setTagInput("");
    setImage(null);
    setSelectedAssignee(null);
  };
  const isDisabled =
    !title ||
    !description ||
    !dueDate ||
    selectedAssignee === null ||
    tagInput.trim() === "";
  return (
    <form onSubmit={handleCreateCard} style={{ width: "578px" }}>
      {isSelectOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsSelectOpen(false)}
        />
      )}

      <div className={styles.modalContent}>
        <h2>할 일 생성</h2>
        <label className={styles.label}>담당자</label>
        <div className={styles.dropdown}>
          <div
            className={styles.selected}
            onClick={() => setIsSelectOpen((prev) => !prev)}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              {selectedUser ? (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    paddingLeft: "12px",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedUser.profileImageUrl ? (
                    <ProfileImage
                      src={selectedUser.profileImageUrl}
                      alt="프로필"
                    />
                  ) : (
                    <AssigneeCircle>{selectedUser?.nickname[0]}</AssigneeCircle>
                  )}
                  <div style={{ color: "black" }}>{selectedUser.nickname}</div>
                </div>
              ) : (
                "담당자를 선택하세요"
              )}
              <Image
                src="/icons/arrow_drop.svg"
                width={26}
                height={26}
                alt="dropdown icon"
              />
            </div>
          </div>
          {isSelectOpen && (
            <div className={styles.dropdownMenu}>
              {members?.map((member: any) => (
                <div
                  key={member.id}
                  className={styles.dropdownItem}
                  onClick={() => handleSelectUser(member)}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      paddingLeft: "12px",
                    }}
                  >
                    {member.profileImageUrl ? (
                      <ProfileImage src={member.profileImageUrl} alt="프로필" />
                    ) : (
                      <AssigneeCircle>{member?.nickname[0]}</AssigneeCircle>
                    )}
                    <div style={{ color: "black" }}>{member.nickname}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <label>제목 *</label>
        <input
          type="text"
          className={styles.input}
          placeholder="제목을 입력해 주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>설명 *</label>
        <textarea
          className={styles.textarea}
          placeholder="설명을 입력해 주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>마감일 *</label>

        <DatePicker
          className={styles.date}
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          dateFormat="yyyy-MM-dd HH:mm"
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={10}
          placeholderText="날짜를 입력해 주세요"
          required
        />

        <label>태그</label>
        <input
          type="text"
          className={styles.input}
          placeholder="입력 후 Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyPress}
        />
        <TaskTags tags={tags} />

        <label>이미지</label>
        <div className={styles.imageUpload}>
          <ImageUpload onImageUpload={setImage} />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonGroup}>
          <button className={styles.cancle} type="button" onClick={onClose}>
            취소
          </button>
          <button className={styles.create} type="submit" disabled={isDisabled}>
            생성
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddModal;

const ProfileImage = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
`;
const AssigneeCircle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #dbe6f7;
`;
