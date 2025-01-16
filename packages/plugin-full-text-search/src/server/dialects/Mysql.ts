import { fn, literal, Op, where } from '@tachybase/database';

import { escapeLike } from '../utils';
import { Dialect } from './Dialect';

export class Mysql extends Dialect {
  handleJsonQuery(field: string, keyword: string) {
    return where(literal(`JSON_UNQUOTE(JSON_EXTRACT(${field}, '$'))`), {
      [Op.like]: `%${escapeLike(keyword)}%`,
    });
  }

  formatDate(fieldName: string, utcOffset: string, formatStr: string) {
    return fn('DATE_FORMAT', fn('CONVERT_TZ', fieldName, '+00:00', utcOffset), formatStr);
  }

  handleStringQuery(fieldName: string, keyword: string) {
    return where(literal(fieldName), {
      [Op.like]: `%${escapeLike(keyword)}%`,
    });
  }

  handleNumberQuery(fieldName: string, keyword: string) {
    const castFunction = `CAST(${fieldName} AS CHAR)`;
    return where(literal(castFunction), {
      [Op.like]: `%${escapeLike(keyword)}%`,
    });
  }

  getFieldName(collectionName: string, field: string): string {
    return `\`${collectionName}\`.\`${field}\``;
  }
}
