// 保留小数点

export const currentPoint = (number, tofixed = 2) => {
  /**
   * 这种舍入法基于四舍六入五成双的原则。
   * 简单来说，当要舍入的位数是5时，会考虑该位数后面的数字。
   * 如果后面的数字是0、5、6、7、8，则应向前一位数字进位；
   * 如果后面的数字是1、2、3、4，则舍去。
   * */
  if (!number && number != 0) return '';
  return Number(number).toFixed(tofixed);
};
