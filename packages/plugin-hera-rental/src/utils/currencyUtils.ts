export enum FormatType {
  /**
   * 金额
   */
  currency = 'currency',
  /**
   * 百分比
   */
  percent = 'percent',
  /**
   * 数量
   */
  quantity = 'quantity',
}

/**
 * 格式化数字，支持金额、百分比、数量等
 * @param _number 数字
 * @param fractionDigits 保留位数
 * @param formatType 格式化类型: 'currency' | 'percent' | 'quantity' / 金额，百分比，数量
 * @returns 格式化后的字符串
 */
const format = (_number: number, fractionDigits: number, formatType: FormatType): string => {
  const number = typeof _number === 'undefined' || Number.isNaN(_number) ? 0 : _number;
  let style;
  let currency;

  switch (formatType) {
    case 'currency':
      style = 'currency';
      currency = 'CNY';
      break;
    case 'percent':
      style = 'percent';
      break;
    case 'quantity':
      style = 'decimal';
      break;
    default:
      throw new Error('Invalid formatType. Supported values are "currency", "percent", and "quantity".');
  }
  const options = {
    style,
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  };
  const numberFormat = new Intl.NumberFormat('zh-CN', options);
  return numberFormat.format(number);
};

// Examples
/**
 * 计算金额
 * @param number 金额
 * @param fractionDigits 需要保留的位数
 * @returns
 */
export const formatCurrency = (number: number, fractionDigits: number) =>
  format(number, fractionDigits, FormatType.currency); // ￥10,000.00
/**
 *计算百分比
 * @param number 需要转化的百分比
 * @param fractionDigits 保留位数
 * @returns
 */
export const formatPercent = (number: number, fractionDigits: number) =>
  format(number, fractionDigits, FormatType.percent); // 75.00%
/**
 * 计算数量
 * @param number 数字
 * @param fractionDigits  需要保留的位数
 * @returns
 */
export const formatQuantity = (number: number, fractionDigits = 2) =>
  format(number, fractionDigits, FormatType.quantity); // 12,345.679

export default format;

/**
 * 判断数字是否是整数
 * @param num
 * @returns
 */
function _isDecimal(num: number): boolean {
  return Number.isFinite(num) && !Number.isInteger(num);
}
