import SideBar from "@/src/components/sidebar/SideBar";
import NavBar from "@/src/components/nav/NavBar";
import Board from "@/src/components/dashboard/Board";
import styles from "./index.module.scss";
import useAuth from "@/src/hooks/useRequireAuth";


export default function Page() {

  useAuth();

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
