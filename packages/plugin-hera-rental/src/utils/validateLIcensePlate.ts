/**
 * @description: 识别车牌号
 * @param {string} plateNumber 车牌号
 * @return {boolean} 是否识别
 */

const validateLicensePlate = (plateNumber: string): boolean => {
  if (!plateNumber) {
    return false;
  }
  const regularExpression = /^[\u4e00-\u9fa5]{1}[A-Z]{1}([A-Z_0-9]{4}|[A-Z_0-9]{5})[A-Z0-9挂学警港澳]{1}$/;
  return regularExpression.test(plateNumber);
};

export default validateLicensePlate;
