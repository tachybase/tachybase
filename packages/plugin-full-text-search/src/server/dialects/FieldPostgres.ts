import { fn, Op, where } from '@tachybase/database';

import { col } from 'sequelize';

import { escapeLike } from '../utils';
import { FieldBase } from './FieldBase';

export class FieldPostgres extends FieldBase {
  type = 'postgres';
  like = Op.iLike;
  likeOperator = 'ILIKE';

  public getFormateDateStr(field: string, fieldInfo): string {
    let formatStr = 'YYYY-MM-DD HH:mm:ss';
    if (fieldInfo?.get(field)?.options?.uiSchema?.['x-component-props']?.dateFormat) {
      const props = fieldInfo.get(field).options.uiSchema['x-component-props'];
      formatStr = props.dateFormat;
      if (props.showTime) {
        formatStr += props.timeFormat.endsWith(' a') ? ' HH12:MI:SS' : ' HH24:MI:SS';
      }
    }
    return formatStr;
  }

  public date(field: string, keyword: string, formatStr: string, timezone: string): any {
    return {
      [Op.and]: [
        where(
          fn(
            'TO_CHAR',
            fn(
              'TIMEZONE',
              timezone, // 参数1：目标时区
              fn('TIMEZONE', 'UTC', col(field)), // 参数2：UTC 转换后的字段
            ),
            formatStr, // 参数3：格式化字符串
          ),
          {
            [Op.like]: `%${escapeLike(keyword)}%`,
          },
        ),
      ],
    };
  }

  json(field: string, keyword: string): any {
    // 追加关联字段支持
    return this.convertToObj(field, {
      ['::text']: {
        [this.like]: `%${escapeLike(keyword)}%`,
      },
    });
  }
}
