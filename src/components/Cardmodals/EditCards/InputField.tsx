import React from "react";
import styles from "./InputField.module.scss";

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  required,
  className,
}) => {
  return (
    <div className={`${styles.inputField} ${className || ""}`}>
      <label className={styles.label}>{label}</label>
      <div className={`${styles.inputWrapper} ${type === "textarea" ? styles.textarea : ""}`}>
        {type === "textarea" ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={styles.textarea}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
          />
        )}
      </div>
    </div>
  );
};

export default InputField;
