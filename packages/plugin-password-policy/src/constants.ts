export const NAMESPACE = 'password-policy';

export enum PasswordStrengthLevel {
  None = 0,
  NumberAndLetter = 1,
  NumberAndLetterAndSymbol = 2,
  NumberAndLetterAndUpperAndLower = 3,
  NumberAndLetterAndUpperAndLowerAndSymbol = 4,
  NumberAndLetterAndUpperAndLowerAndSymbol3 = 5,
}

export const WINDOW_SECONDS = 300; // 默认5分钟内操作
export const LOCK_SECONDS = 1800; // 默认锁定30分钟
