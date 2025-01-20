import { fn, literal, Op, where } from '@tachybase/database';

import { col, WhereOptions } from 'sequelize';

import { escapeLike } from '../utils';
import { FieldBase } from './FieldBase';

export class FieldMariadb extends FieldBase {
  type = 'mariadb';

  public getFormateDateStr(field: string, fieldInfo): string {
    let formatStr = '%Y-%m-%d';
    if (fieldInfo?.get(field)?.options?.uiSchema?.['x-component-props']?.dateFormat) {
      const props = fieldInfo.get(field).options.uiSchema['x-component-props'];
      formatStr = props.dateFormat.replace('YYYY', '%Y').replace('MM', '%m').replace('DD', '%d');
      if (props.showTime) {
        if (props.timeFormat.endsWith(' a')) {
          formatStr += ' %I:%i:%s %p'; // MySQL 12小时制，%p 显示 AM/PM
        } else {
          formatStr += ' %H:%i:%s'; // MySQL 24小时制
        }
      }
    }
    return formatStr;
  }

  public number(field: string, keyword: string): WhereOptions<any> {
    return {
      [Op.and]: [
        where(
          literal(`CAST(${col(field).col} AS CHAR)`), // 确保不加引号，直接插入 SQL 表达式
          {
            [Op.like]: `%${escapeLike(keyword)}%`,
          },
        ),
      ],
    };
  }

  date(field: string, keyword: string, formatStr: string, timezone: string): WhereOptions<any> {
    return {
      [Op.and]: [
        where(fn('DATE_FORMAT', fn('CONVERT_TZ', col(field), '+00:00', timezone), formatStr), {
          [this.like]: `%${escapeLike(keyword)}%`,
        }),
      ],
    };
  }

  json(field: string, keyword: string): WhereOptions<any> {
    return {
      [Op.and]: [
        where(literal(`JSON_UNQUOTE(JSON_EXTRACT(${field}, '$'))`), {
          [Op.like]: `%${escapeLike(keyword)}%`,
        }),
      ],
    };
  }

  protected getMultiSelectFilter(field: string, matchEnum: string[]): WhereOptions<any> {
    return {
      [Op.and]: [literal(`JSON_CONTAINS(${col(field).col}, '${JSON.stringify(matchEnum)}')`)],
    };
  }
}
