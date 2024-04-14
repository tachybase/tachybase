/**
 *
 * @param v int value
 * @param digit bit len of v
 * @param flag true or false
 * @returns
 */
const bitmap = (v: number, digit: number, flag: boolean) => {
  const b = 1 << digit;
  return flag ? v | b : v ^ b;
};
export default bitmap;
