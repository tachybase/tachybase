import { literal, Op, where } from '@tachybase/database';

import { WhereOptions } from 'sequelize';

import { escapeLike } from '../utils';

type NestedRecord<T, K extends string> = K extends `${infer Head}.${infer Tail}`
  ? { [Key in Head]: NestedRecord<T, Tail> }
  : { [Key in K]: T };

// 是否支持关联字段搜索
type CloseType = 'association';

export function Close(flag?: CloseType): MethodDecorator {
  // 这里返回一个装饰器函数
  return function (target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor): void {
    const originalMethod = descriptor.value; // 保存原方法

    descriptor.value = function (...args: any[]) {
      if (flag) {
        return null;
      }

      // 如果 flag 是 'association' 且第一个参数包含 '.'，返回 null
      if (flag === 'association' && typeof args[0] === 'string' && args[0].includes('.')) {
        return null;
      }

      // 其他情况调用原始方法
      return originalMethod.apply(this, args);
    };
  };
}

export class FieldBase {
  like = Op.like;
  likeOperator = 'LIKE';

  constructor(public type: string) {
    if (type === 'postgres') {
      this.like = Op.iLike;
      this.likeOperator = 'ILIKE';
    }
  }

  getFieldName(collectionName: string, field: string): string {
    return '';
  }

  @Close('association')
  handleJsonQuery(field: string, keyword: string) {
    return null;
  }

  formatDate(fieldName: string, utcOffset: string, formatStr: string): any {
    return null;
  }

  public handleStringQuery(field: string, keyword: string) {
    // 受核心限制这里实际只能套两层
    return this.convertToObj(field, { [this.like]: `%${escapeLike(keyword)}%` });
  }

  public handleNumberQuery(field: string, keyword: string): WhereOptions<any> {
    return {};
    // return {
    //   [Op.and]: [
    //     where(literal(`CAST(${fieldName} AS TEXT)`), {
    //       [this.like]: `%${escapeLike(keyword)}%`,
    //     }),
    //   ],
    // };
  }

  // a.b.c = xxx 转成 { a: { b: { c: 'xxx' } } }
  private convertToObj<T, K extends string>(key: K, value: T): NestedRecord<T, K> {
    const parts = key.split('.');
    const newKey = parts.shift();
    if (!newKey) {
      throw new Error('Invalid key');
    }
    if (!parts.length) {
      return { [newKey]: value } as NestedRecord<T, K>;
    }
    return { [newKey]: this.convertToObj(parts.join('.'), value) } as NestedRecord<T, K>;
  }
}
