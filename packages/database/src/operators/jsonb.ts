import { Op } from 'sequelize';

import { isPg } from './utils';

function escapeLike(value: string) {
  return value.replace(/[_%]/g, '\\$&');
}

export default {
  $containsJsonbValue(value, ctx) {
    if (Array.isArray(value)) {
      const conditions = value.map((item) => ({
        ['::text']: {
          [isPg(ctx) ? Op.iLike : Op.like]: `%${escapeLike(item)}%`,
        },
      }));
      return {
        [Op.or]: conditions,
      };
    }

    return {
      // 先将 jsonb 转换为字符串, 实际测试发现这种语法可行
      ['::text']: {
        // 使用 Op.like 操作符来检查 JSONB 字段是否包含特定的字符串
        [isPg(ctx) ? Op.iLike : Op.like]: `%${escapeLike(value)}%`,
      },
    };
  },
} as Record<string, any>;
