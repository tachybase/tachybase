import { fn, literal, Op, where } from '@tachybase/database';

import { col } from 'sequelize';

import { convertTimezoneOffset, escapeLike } from '../utils';
import { FieldBase } from './FieldBase';

export class FieldSqlite extends FieldBase {
  type = 'sqlite';

  public getFormateDateStr(field: string, fieldInfo): string {
    let formatStr = '%Y-%m-%d';
    if (fieldInfo?.get(field)?.options?.uiSchema?.['x-component-props']?.dateFormat) {
      const props = fieldInfo.get(field).options.uiSchema['x-component-props'];
      formatStr = props.dateFormat.replace('YYYY', '%Y').replace('MM', '%m').replace('DD', '%d');
      if (props.showTime) {
        if (props.timeFormat.endsWith(' a')) {
          formatStr += ' %I:%M:%S %p'; // SQLite 12小时制，%p 显示 AM/PM
        } else {
          formatStr += ' %H:%M:%S'; // SQLite 24小时制
        }
      }
    }
    return formatStr;
  }

  date(field: string, keyword: string, formatStr: string, timezone: string): { [Op.and]: any[] } {
    return {
      [Op.and]: [
        where(fn('strftime', formatStr, fn('datetime', col(field), convertTimezoneOffset(timezone))), {
          [this.like]: `%${escapeLike(keyword)}%`,
        }),
      ],
    };
  }

  json(field: string, keyword: string): { [Op.and]: any[] } {
    return {
      [Op.and]: [
        where(literal(`json_extract(${field}, '$')`), {
          [this.like]: `%${escapeLike(keyword)}%`,
        }),
      ],
    };
  }
}
