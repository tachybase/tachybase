import { encryptSearchValueSync } from './tools';

/** 加密字段-非全等查询 */
export function $encryptionNe(str, ctx) {
  const ne = ctx.db.operators.get('$ne');
  if (!str) {
    return ne(str, ctx);
  }

  const encryptedStr = encryptSearchValueSync(str, ctx);

  return ne(encryptedStr, ctx);
}
