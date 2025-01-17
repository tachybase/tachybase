import { literal, Op, where } from '@tachybase/database';

import { escapeLike } from '../utils';
import { Close, FieldBase } from './FieldBase';

export class FieldPostgres extends FieldBase {
  getFieldName(collectionName: string, field: string): string {
    return `"${collectionName}"."${field}"`;
  }

  handleJsonQuery(field: string, keyword: string) {
    return where(literal(`${field}->>0`), {
      [Op.iLike]: `%${escapeLike(keyword)}%`,
    });
  }

  @Close()
  formatDate(fieldName: string, utcOffset: string, formatStr: string) {
    return null;
    return literal(`TO_CHAR((${fieldName} AT TIME ZONE 'UTC') AT TIME ZONE '${utcOffset}', '${formatStr}')`);
  }
}
