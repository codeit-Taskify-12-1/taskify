import React, { useState } from "react";
import TaskTags from "../TaskCards/TaskTags";
import styles from "./TagInput.module.scss";

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags }) => {
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
      e.currentTarget.innerText = "";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  return (
    <div className={styles.tagInputContainer}>
      <label className={styles.label}>태그 *</label>
      <div className={styles.tagInput}>
        <TaskTags tags={tags} />
        <input
          type="text"
          placeholder={tags.length > 0 ? "" : "입력 후 Enter"}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyPress}
          onKeyUp={handleKeyDown}
          className={styles.tagInputField}
        />
      </div>
    </div>
  );
};

export default TagInput;
