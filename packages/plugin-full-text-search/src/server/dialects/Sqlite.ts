import { fn, literal, Op, where } from '@tachybase/database';

import { convertTimezoneOffset, escapeLike } from '../utils';
import { Dialect } from './Dialect';

export class Sqlite extends Dialect {
  handleJsonQuery(field: string, keyword: string) {
    return where(literal(`json_extract(${field}, '$')`), {
      [Op.like]: `%${escapeLike(keyword)}%`,
    });
  }

  formatDate(fieldName: string, utcOffset: string, formatStr: string) {
    return fn('strftime', formatStr, fn('datetime', fieldName, convertTimezoneOffset(utcOffset)));
  }

  handleStringQuery(fieldName: string, keyword: string) {
    return where(literal(fieldName), {
      [Op.like]: `%${escapeLike(keyword)}%`,
    });
  }

  handleNumberQuery(fieldName: string, keyword: string) {
    const castFunction = `CAST(${fieldName} AS TEXT)`;
    return where(literal(castFunction), {
      [Op.like]: `%${escapeLike(keyword)}%`,
    });
  }

  getFieldName(collectionName: string, field: string): string {
    return `"${collectionName}"."${field}"`;
  }
}
