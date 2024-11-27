import { encryptSearchValueSync } from './tools';

/** 加密字段-全等查询 */
export function $encryptionEq(str, ctx) {
  const eq = ctx.db.operators.get('$eq');

  if (!str) {
    return eq(str, ctx);
  }

  const encrypted = encryptSearchValueSync(str, ctx);
  return eq(encrypted, ctx);
}
