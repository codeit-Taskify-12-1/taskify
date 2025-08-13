import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./DateInputField.module.scss";

interface DateInputFieldProps {
  label: string;
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const DateInputField: React.FC<DateInputFieldProps> = ({
  label,
  selectedDate,
  onDateChange,
}) => {
  return (
    <div className={styles.dateInputField}>
      <label className={styles.label}>{label}</label>
      <div className={styles.datePickerWrapper}>
        <img
          src="/icons/calendar.svg"
          alt="캘린더 아이콘"
          width={16}
          height={18}
          className={styles.calendarIcon}
        />
        <DatePicker
          selected={selectedDate}
          onChange={onDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          dateFormat="yyyy.MM.dd HH:mm"
          className={styles.reactDatePickerInput}
        />
      </div>
    </div>
  );
};

export default DateInputField;
