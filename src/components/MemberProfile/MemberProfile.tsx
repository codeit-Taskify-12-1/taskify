// components/MemberProfile.tsx
import React from "react";
import styles from "./MemberProfile.module.scss";

interface MemberProfileProps {
  nickname: string;
  id: string | number;
}

const MemberProfile: React.FC<MemberProfileProps> = ({ nickname, id }) => {
  const colors = ["#F9EEE3", "#E7F7DB", "#F7DBF0", "#DBE6F7", "#9C33FF"];

  const randomColor = colors[parseInt(String(id), 10) % colors.length];

  return (
    <div
      className={styles.memberCircle}
      style={{ backgroundColor: randomColor }}
    >
      {nickname[0]}
    </div>
  );
};

export default MemberProfile;
