import { fn, literal, Op, where } from '@tachybase/database';

import { col, WhereOptions } from 'sequelize';

import { handleFieldParams } from '../types';
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

  date(params: handleFieldParams): { [Op.and]: any[] } {
    const { field, keyword, dateStr, timezone } = params;
    return {
      [Op.and]: [
        where(fn('strftime', dateStr, fn('datetime', col(field), convertTimezoneOffset(timezone))), {
          [this.like]: `%${escapeLike(keyword)}%`,
        }),
      ],
    };
  }

  json(params: handleFieldParams): { [Op.and]: any[] } {
    const { field, keyword } = params;
    return {
      [Op.and]: [
        where(literal(`json_extract(${field}, '$')`), {
          [this.like]: `%${escapeLike(keyword)}%`,
        }),
      ],
    };
  }

  public getMultiSelectFilter(field: string, matchEnum: string[]): WhereOptions<any> {
    const matchList = matchEnum.map((value) => `'${value}'`).join(',');
    return {
      [Op.and]: [
        literal(`
        EXISTS (
          SELECT 1
          FROM json_each(${col(field).col})
          WHERE json_each.value IN (${matchList})
        )
      `),
      ],
    };
  }
}
