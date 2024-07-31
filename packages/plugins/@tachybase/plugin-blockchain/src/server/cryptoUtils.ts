import crypto from 'crypto';

/**
 * 生成盐
 * @returns {string} 盐字符串
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

/**
 * 使用盐和数据进行加密
 * @param {string} data 数据字符串
 * @param {string} salt 盐字符串
 * @returns {string} 加密后的哈希值
 */
export function hashWithSalt(data: string, salt: string): string {
  return crypto
    .createHash('sha256')
    .update(data + salt)
    .digest('hex');
}
