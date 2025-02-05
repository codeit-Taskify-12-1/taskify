import styles from "./SideBar.module.scss";
import Image from "next/image";
import Link from "next/link";

export default function SideBar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarcontent}>
        <Link href="/">
          <Image
            src="/icons/dashboardlogo.svg"
            width={110}
            height={34}
            alt="dashboardlogo.svg"
            priority
          />
        </Link>
        <div className={styles.subtitles}>
          <div className={styles.subtitle}>Dash Boards</div>
          <div>
            <Link href="/">
              <Image
                src="/icons/add_box.svg"
                width={20}
                height={20}
                alt="더하기 버튼"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
