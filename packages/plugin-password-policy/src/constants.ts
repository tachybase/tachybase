export const NAMESPACE = 'password-policy';

export enum PasswordStrengthLevel {
  None = 0,
  NumberAndLetter = 1,
  NumberAndLetterAndSymbol = 2,
  NumberAndLetterAndUpperAndLower = 3,
  NumberAndLetterAndUpperAndLowerAndSymbol = 4,
  NumberAndLetterAndUpperAndLowerAndSymbol3 = 5,
}
