import { Op } from '@tachybase/database';

import { escapeLike } from '../utils';

// a.b.c 转成 { a: { b: { c: 'xxx' } } }

export class Dialect {
  like = Op.like;

  constructor(public type: string) {
    if (type === 'postgres') {
      this.like = Op.iLike;
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

  getFieldName(collectionName: string, field: string) {}

  handleJsonQuery(field: string, keyword: string) {}

  formatDate(fieldName: string, utcOffset: string, formatStr: string) {}

  handleStringQuery(field: string, keyword: string) {
    return this.convertToObj(field, { [this.like]: `%${escapeLike(keyword)}%` });
  }

  handleNumberQuery(fieldName: string, keyword: string) {}
}
