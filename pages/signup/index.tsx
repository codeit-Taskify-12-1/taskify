"use client";

import { useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosinstance from "../../src/api/axios";
import passwordeye from "@/public/images/passwordeye.png";
import passwordeyeopen from "@/public/images/passwordeyeopen.png";
import loginlogo from "@/public/icons/loginlogo.png";
import Image from "next/image";
import style from "./index.module.scss";
import CustomModal from "@/src/components/modal/CustomModal";
import registerStyles from "./modal.module.scss";
import CustomButton from "@/src/components/button/CustomButton";
import buttonStyles from "./button.module.scss";
import useDevice from "@/src/hooks/useDevice";

export default function RegisterPage() {
  const device = useDevice();
  const [values, setValues] = useState({
    email: "",
    nickname: "",
    password: "",
    passwordRepeat: "",
  });

  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordRepeatError, setPasswordRepeatError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordRepeatVisible, setIsPasswordRepeatVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState<() => void>(() => {});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isChecked, setIsChecked] = useState(false);
  const router = useRouter();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const isValid =
      validateEmail(values.email) &&
      values.nickname.trim() !== "" &&
      values.nickname.length <= 10 &&
      values.password.length >= 8 &&
      values.password === values.passwordRepeat &&
      isChecked === true;

    setIsButtonDisabled(!isValid);
  }, [values, isChecked]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setValues((prevValues) => ({ ...prevValues, [name]: value }));

    setEmailErrorMessage("");
    setPasswordError("");
    setPasswordRepeatError("");
    setNicknameError("");

    if (name === "email") {
      if (value === "") {
        setEmailErrorMessage("");
      } else if (!validateEmail(value)) {
        setEmailErrorMessage("이메일 형식으로 입력해주세요");
      } else {
        setEmailErrorMessage("");
      }
    }

    if (name === "nickname") {
      {
        if (value === "") setNicknameError("");
      }
      if (value.length > 10) {
        setNicknameError("열 자 이하로 작성해주세요");
      } else {
        setNicknameError("");
      }
    }

    if (name === "password") {
      if (value === "") {
        setPasswordError("");
      }
      if (value.length < 8) {
        setPasswordError("비밀번호는 8자 이상이어야 합니다");
      } else {
        setPasswordError("");
      }
    }

    if (name === "passwordRepeat") {
      if (value === "") {
        setPasswordRepeatError("");
      }
      if (values.password !== value) {
        setPasswordRepeatError("비밀번호가 동일하지 않습니다");
      } else {
        setPasswordRepeatError("");
      }
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { email, nickname, password } = values;

    try {
      const response = await axiosinstance.post("/users", {
        email,
        nickname,
        password,
      });

      if (response.status === 201) {
        setIsModalOpen(true);
        setModalMessage("가입이 완료되었습니다!");
        setTimeout(() => {
          setModalAction(() => registerSuccessButton);
        }, 0);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        setIsModalOpen(true);
        setModalMessage("이미 사용중인 이메일 입니다.");
        setTimeout(() => {
          setModalAction(() => () => setIsModalOpen(false));
        }, 0);
      }
    }
  }
  //로고누르면 마이대쉬보드로 이동동
  function handleLogoClick() {
    router.push("/");
  }
  //비밀번호 눈알
  const passwordVisible = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  //비밀번호 확인 눈알
  const passwordRepeatVisible = () => {
    setIsPasswordRepeatVisible(!isPasswordRepeatVisible);
  };

  //가입완료 모달창 버튼 클릭시 화면 이동
  const registerSuccessButton = () => {
    setIsModalOpen(false);
    router.push("/login");
  };

  //로그인페이지로 이동
  const handleSignupClick = () => {
    router.push("/login");
  };

  return (
    <div className={style.container}>
      <Image
        className={style.logo}
        onClick={handleLogoClick}
        src={loginlogo}
        alt="loginlogo"
      />
      <p className={style.logotext}>첫 방문을 환영합니다!</p>

      <form onSubmit={handleSubmit}>
        <p className={style.tag}>이메일</p>
        <input
          placeholder="이메일을 입력해 주세요"
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

        <p className={style.tag}>이름</p>
        <input
          placeholder="이름을 입력해 주세요"
          name="nickname"
          type="text"
          onChange={handleChange}
          value={values.nickname}
          className={`${style.input} ${nicknameError ? style.inputError : ""}`}
        />
        {nicknameError && <span className={style.error}>{nicknameError}</span>}

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

        <p className={style.tag}>비밀번호 확인</p>
        <div className={style.passwordWrapper2}>
          <input
            name="passwordRepeat"
            type={isPasswordRepeatVisible ? "text" : "password"}
            onChange={handleChange}
            value={values.passwordRepeat}
            className={`${style.passwordinput} ${
              passwordRepeatError ? style.inputError : ""
            }`}
            placeholder="비밀번호를 한번 더 입력해주세요"
          />

          <span className={style.passwordimg2} onClick={passwordRepeatVisible}>
            <Image
              className={
                isPasswordRepeatVisible
                  ? style.passwordeyeopen
                  : style.passwordeye
              }
              src={isPasswordRepeatVisible ? passwordeyeopen : passwordeye}
              alt="Toggle Password Visibility"
            />
          </span>
          {passwordRepeatError && (
            <span className={style.error}>{passwordRepeatError}</span>
          )}
        </div>

        <label className={style.agreementlabel}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className={style.customcheckbox}
          />
          <p>이용약관에 동의합니다.</p>
        </label>

        <button
          className={`${style.registerbutton} ${
            !isButtonDisabled ? style.buttonActivated : ""
          }`}
          disabled={isButtonDisabled}
        >
          가입하기
        </button>

        <p className={style.logintext}>
          이미 회원이신가요?{" "}
          <span className={style.logintextbutton} onClick={handleSignupClick}>
            로그인하기
          </span>
        </p>
      </form>

      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className={registerStyles.modalOverlay}>
          <div className={registerStyles.contentstyle}>
            <div className={registerStyles.textandbutton}>
              <p>{modalMessage}</p>
              <CustomButton
                width={240}
                height={48}
                className={buttonStyles.button1}
                onClick={modalAction}
              >
                확인
              </CustomButton>
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}

{
}
