import { PASSWORD_MIN_LENGTH } from "../validation";
import { PASSWORD_MAX_LENGTH } from "../validation";

// signIn, Up 관련 error
export const errors = {
  userNameEmpty: "이름을 입력해 주세요.",
  userNameInvalid: "이름을 2자 이상 입력해 주세요.",
  emailEmpty: "이메일을 입력해 주세요.",
  emailInvalid: "잘못된 이메일 형식입니다.",
  telNumberEmpty: "전화번호를 입력해 주세요.",
  telNumberInvalid: "010-XXXX-XXXX 형식으로 입력해 주세요.",
  nicknameEmpty: "닉네임을 입력해 주세요.",
  passwordEmpty: "비밀번호를 입력해 주세요.",
  passwordInvalid: `비밀번호는 ${PASSWORD_MIN_LENGTH}자 이상 ${PASSWORD_MAX_LENGTH}자 이하로 입력해 주세요.`,
  passwordMismatch: "비밀번호가 일치하지 않습니다.",
  emailExists: "사용 중인 이메일입니다.",
  // TODO: 사용 안함
  signupSuccess: "회원가입이 성공적으로 처리되었습니다.",
  loginError: "존재하지 않는 이메일, 혹은 비밀번호입니다.",
} as const;

// ProfileForm 관련 error
export const error = {
  nickNameEmpty: "별명을 입력해주세요.",
  histotyInvalid: "숫자만 입력해주세요.",
  overViewInvalid: "8자 이상 입력해주세요.",
  details: "10자 이상 입력해주세요.",
  service: "*1개 이상 선택해주세요.",
  serviceArea: "*1개 이상 선택해주세요.",
} as const;
