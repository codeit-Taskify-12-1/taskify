"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosinstance from "../../src/api/axios";
import loginlogo from "@/public/icons/loginlogo.png";
import Image from "next/image";
import style from "./index.module.scss";
import passwordeye from "@/public/images/passwordeye.png";
import passwordeyeopen from "@/public/images/passwordeyeopen.png";
import CustomModal from "@/src/components/modal/CustomModal";
import loginStyles from "./modal.module.scss";
import CustomButton from "@/src/components/button/CustomButton";
import buttonStyles from "./button.module.scss";

import axios from "axios"; 


export default function LoginPage() {

  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setValues((prevValues) => {
      const newValues = { ...prevValues, [name]: value };

      const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      if (name === "email") {
        if (value === "") {
          setEmailErrorMessage("");
        } else if (!validateEmail(value)) {
          setEmailErrorMessage("이메일 형식으로 입력해주세요");
        } else {
          setEmailErrorMessage("");
        }
      }

      if (name === "password") {
        if (value === "") {
          setPasswordError("");
        } else if (value.length < 8) {
          setPasswordError("비밀번호는 8자 이상이어야 합니다");
        } else {
          setPasswordError("");
        }
      }

      setIsButtonDisabled(
        !(validateEmail(newValues.email) && newValues.password.length >= 8)
      );

      return newValues;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { email, password } = values;

    try {
      const response = await axiosinstance.post("/auth/login", {
        email,
        password,
      });
    
      const { accessToken } = response.data;
    
      if (!accessToken) {
        console.error("🚨 서버에서 accessToken을 받지 못했습니다.");
        setIsModalOpen(true);
        return;
      }
    
      // ✅ 토큰 저장 후 약간의 딜레이를 준 후 페이지 이동
      sessionStorage.setItem("accessToken", accessToken);
      setTimeout(() => {
        router.push("/dashboard");
      }, 100); // 🔹 100ms 딜레이 추가
    
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("로그인 실패:", error.response?.data || error.message);
      } else {
        console.error("알 수 없는 오류 발생:", error);
      }
      setIsModalOpen(true);
    }
  }
    
  function handleSignupClick() {
    router.push("/signup");
  }

  function handleLogoClick() {
    router.push("/");
  }

  const passwordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={style.container}>
      <Image
        className={style.logo}
        onClick={handleLogoClick}
        src={loginlogo}
        alt="loginlogo"
      />
      <p className={style.logotext}>오늘도 만나서 반가워요!</p>

      <form onSubmit={handleSubmit}>
        <p className={style.tag}>이메일</p>
        <input
          placeholder="이메일을 입력해주세요"
          className={`${style.input} ${
            emailErrorMessage ? style.inputError : ""
          }`}
          name="email"
          type="email"
          onChange={handleChange}
          value={values.email}
        />
        {emailErrorMessage && (
          <span className={style.error}>{emailErrorMessage}</span>
        )}

        <p className={style.tag}>비밀번호</p>
        <div className={style.passwordWrapper}>
          <input
            className={`${style.passwordinput} ${
              passwordError ? style.inputError : ""
            }`}
            placeholder="비밀번호를 입력해 주세요"
            name="password"
            onChange={handleChange}
            value={values.password}
            type={isPasswordVisible ? "text" : "password"}
          />

          <span onClick={passwordVisible} className={style.passwordimg}>
            <Image
              className={
                isPasswordVisible ? style.passwordeyeopen : style.passwordeye
              }
              src={isPasswordVisible ? passwordeyeopen : passwordeye}
              alt="Toggle Password Visibility"
            />
          </span>
          <span
            className={`${style.passwordError} ${
              passwordError ? style.show : ""
            }`}
          >
            {passwordError}
          </span>
        </div>

        <button
          className={`${style.loginbutton} ${
            !isButtonDisabled ? style.buttonActivated : ""
          }`}
          disabled={isButtonDisabled}
        >
          로그인
        </button>

        <p className={style.signuptext}>
          회원이 아니신가요?{" "}
          <span className={style.signuptextbutton} onClick={handleSignupClick}>
            회원가입하기
          </span>
        </p>
      </form>

      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className={loginStyles.modalOverlay}>
          <div className={loginStyles.contentstyle}>
            <div className={loginStyles.textandbutton}>
              <p className={loginStyles.tag}>비밀번호가 일치하지 않습니다.</p>
              <CustomButton
                width={240}
                height={48}
                className={buttonStyles.button1}
                onClick={() => setIsModalOpen(false)}
              >
                확인
              </CustomButton>
            </div>
          </div>
          {/* </div> */}
        </div>
      </CustomModal>
    </div>
  );
}
