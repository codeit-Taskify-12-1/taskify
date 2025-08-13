import React, { useState } from "react";
import Image from "next/image";
import styles from "./ImageUpload.module.scss";

interface ImageUploadProps {
  onImageUpload: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onImageUpload(file); 

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        onImageUpload(file); 
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.imageUploadContainer}>
      <label className={styles.uploadBox}>
        {imagePreview ? (
          <Image src={imagePreview} alt="미리보기" width={76} height={76} />
        ) : (
          <span className={styles.plusIcon}>+</span>
        )}
        <input
          type="file"
          accept="image/png"
          onChange={handleImageUpload}
          className={styles.fileInput}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
};

export default ImageUpload;
