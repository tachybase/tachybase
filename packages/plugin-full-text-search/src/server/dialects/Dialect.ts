import { literal, Op, where } from '@tachybase/database';

import { WhereOptions } from 'sequelize';

import { escapeLike } from '../utils';

// a.b.c 转成 { a: { b: { c: 'xxx' } } }

export class Dialect {
  like = Op.like;

  likeOperator = 'LIKE';

  constructor(public type: string) {
    if (type === 'postgres') {
      this.like = Op.iLike;
      this.likeOperator = 'ILIKE';
    }
  }

  private convertToObj<T>(key: string, value: T) {
    const parts = key.split('.');
    const newKey = parts.shift();
    if (!parts.length) {
      return { [newKey]: value };
    }
    return { [newKey]: this.convertToObj(parts.join('.'), value) };
  }

  getFieldName(collectionName: string, field: string): string {
    return '';
  }

  handleJsonQuery(field: string, keyword: string) {
    return null;
  }

  formatDate(fieldName: string, utcOffset: string, formatStr: string): any {
    return null;
  }

  public handleStringQuery(field: string, keyword: string) {
    return this.convertToObj(field, { [this.like]: `%${escapeLike(keyword)}%` });
  }

  public handleNumberQuery(fieldName: string, keyword: string): WhereOptions<any> {
    return {
      [Op.and]: [
        where(literal(`CAST(${fieldName} AS TEXT)`), {
          [this.like]: `%${escapeLike(keyword)}%`,
        }),
      ],
    };
  }
}
