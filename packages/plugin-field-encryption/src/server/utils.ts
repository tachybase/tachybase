import crypto, { BinaryLike, CipherKey } from 'node:crypto';

const algorithm: string = 'aes-256-cbc';

const keyString = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012';

const key = Buffer.from(keyString, 'utf8') as unknown as CipherKey;

/** 加密算法 */
export function encryptSync(text: string, ivString: string) {
  const iv = Buffer.from(ivString, 'utf8') as unknown as BinaryLike;
  const cipher = crypto.createCipheriv(algorithm, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return encrypted;
}

/** 解密算法 */
export function decryptSync(encrypted: string, ivString: string) {
  const iv = Buffer.from(ivString, 'utf8') as unknown as BinaryLike;
  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
