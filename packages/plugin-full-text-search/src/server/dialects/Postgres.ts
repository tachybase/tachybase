import { literal, Op, where } from '@tachybase/database';

import { escapeLike } from '../utils';
import { Dialect } from './Dialect';

export class Postgres extends Dialect {
  getFieldName(collectionName: string, field: string): string {
    return `"${collectionName}"."${field}"`;
  }

  handleJsonQuery(field: string, keyword: string) {
    return where(literal(`${field}->>0`), {
      [Op.iLike]: `%${escapeLike(keyword)}%`,
    });
  }

  formatDate(fieldName: string, utcOffset: string, formatStr: string) {
    return null;
    return literal(`TO_CHAR((${fieldName} AT TIME ZONE 'UTC') AT TIME ZONE '${utcOffset}', '${formatStr}')`);
  }
}
