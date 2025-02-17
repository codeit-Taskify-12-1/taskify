import SideBar from "@/src/components/sidebar/SideBar";
import NavBar from "@/src/components/nav/NavBar";
import Board from "@/src/components/dashboard/Board";
import styles from "./index.module.scss";


export default function Page() {


  return (
    <>
      <SideBar />
      <NavBar />
      <div className={styles.Contents}>
        <div className={styles.Container}>
          <Board />
        </div>
      </div>
    </>
  );
}
