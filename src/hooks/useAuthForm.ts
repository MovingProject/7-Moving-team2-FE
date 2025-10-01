import { useState } from "react";
import { isValidEmail, isValidPassword, isValidTel, isValidName } from "@/utils/validation";
import { errors } from "@/utils/constant/error";

export function useAuthForm() {
  // 공통 상태
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // 회원가입용 추가 상태
  const [userName, setUserName] = useState<string>("");
  const [userNameError, setUserNameError] = useState<string>("");
  const [telNumber, setTelNumber] = useState<string>("");
  const [telNumberError, setTelNumberError] = useState<string>("");
  const [passwordCheck, setPasswordCheck] = useState<string>("");
  const [passwordCheckError, setPasswordCheckError] = useState<string>("");

  // 공통 유효성 검사 함수
  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError(errors.emailEmpty);
    } else if (!isValidEmail(value)) {
      setEmailError(errors.emailInvalid);
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) {
      setPasswordError(errors.passwordEmpty);
    } else if (!isValidPassword(value)) {
      setPasswordError(errors.passwordInvalid);
    } else {
      setPasswordError("");
    }
  };

  const validatePasswordCheck = (value: string) => {
    if (!value.trim()) {
      setPasswordCheckError(errors.passwordEmpty);
    } else if (value !== password) {
      setPasswordCheckError(errors.passwordMismatch);
    } else {
      setPasswordCheckError("");
    }
  };

  const validateUserName = (value: string) => {
    if (!value.trim()) {
      setUserNameError(errors.userNameEmpty);
    } else if (!isValidName(value)) {
      setUserNameError(errors.userNameInvalid);
    } else {
      setUserNameError("");
    }
  };

  const validateTelNumber = (value: string) => {
    if (!value.trim()) {
      setTelNumberError(errors.telNumberEmpty);
    } else if (!isValidTel(value)) {
      setTelNumberError(errors.telNumberInvalid);
    } else {
      setTelNumberError("");
    }
  };

  return {
    //상태들
    email,
    setEmail,
    emailError,
    setEmailError,
    password,
    setPassword,
    passwordError,
    passwordCheck,
    setPasswordCheck,
    passwordCheckError,
    userName,
    setUserName,
    userNameError,
    telNumber,
    telNumberError,
    setTelNumber,

    //유효성 검사 함수
    validateEmail,
    validatePassword,
    validateUserName,
    validatePasswordCheck,
    validateTelNumber,
  };
}
