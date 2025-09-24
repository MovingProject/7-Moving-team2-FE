const EMAIL_STRICT = /^[A-Za-z0-9._%+-]+@(?:(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,}$/;
export const PASSWORD_LENGTH = 4;

export function isValidEmail(email: string): boolean {
  return EMAIL_STRICT.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= PASSWORD_LENGTH;
}
