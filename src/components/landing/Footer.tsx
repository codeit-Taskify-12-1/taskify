import Image from "next/image";

import style from "./Footer.style.module.scss";


export default function LandingFooter() {
  return (
    <div className={style.footer}>
      <p>Ⓒcodeit - 2025</p>
      <p className={style.ptagspan}> 
        <span>Privacy Policy</span> 
        <span>FAQ</span>
      </p>
      <div>
        <Image className={style.img}src="/icons/socialIcon.png" alt="soicalIcons" width={92} height={22}/>
      </div>
    </div>

  );
}
