//signUp 페이지 유효성 검사 규칙
const EMAIL_STRICT = /^[A-Za-z0-9._%+-]+@(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,}$/;

export const NAME_MIN_LENGTH = 2;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 20;

export const OVERVIEW_MIN_LENGTH = 8;
export const DETAILS_MIN_LENGTH = 10;

export function isValidName(name: string): boolean {
  return name.length >= NAME_MIN_LENGTH;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_STRICT.test(email);
}

export function isValidTel(tel: string): boolean {
  return /^010-\d{4}-\d{4}$/.test(tel);
}

export function isValidPassword(password: string): boolean {
  const length = password.length;
  return length >= PASSWORD_MIN_LENGTH && length <= PASSWORD_MAX_LENGTH;
}

//driverProfileForm 유효성 검사 규칙
export function isValidNickName(nickName: string): boolean {
  return nickName.length >= NAME_MIN_LENGTH;
}

export function isValidHistory(history: string): boolean {
  return /^[0-9]+$/.test(history);
}

export function isValidOverView(overView: string): boolean {
  return overView.length >= OVERVIEW_MIN_LENGTH;
}

export function isValidDetails(details: string): boolean {
  return details.length >= DETAILS_MIN_LENGTH;
}
