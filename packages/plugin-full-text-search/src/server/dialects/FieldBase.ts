import { literal, Op, where } from '@tachybase/database';

import { col, WhereOptions } from 'sequelize';

import { escapeLike } from '../utils';

type NestedRecord<T, K extends string> = K extends `${infer Head}.${infer Tail}`
  ? { [Key in Head]: NestedRecord<T, Tail> }
  : { [Key in K]: T };
export class FieldBase {
  type = '';
  like = Op.like;
  likeOperator = 'LIKE';

  constructor() {}

  public getFormateDateStr(field: string, fieldInfo): string {
    return 'YYYY-MM-DD HH:mm:ss';
  }

  public date(field: string, keyword: string, formatStr: string, timezone: string): any {
    return null;
  }

  public string(field: string, keyword: string, fields: any): WhereOptions<any> | any | null {
    const fieldInfo = fields.get(field);
    if (fieldInfo?.options?.uiSchema?.['x-component'] === 'Select') {
      const enumList = fieldInfo?.options.uiSchema.enum;
      const matchEnum = [];
      for (const item of enumList) {
        if (item.label.toLowerCase().includes(keyword.toLowerCase())) {
          matchEnum.push(item.value);
        }
      }
      if (!matchEnum.length) {
        return null;
      }
      if (fieldInfo?.options?.uiSchema?.type === 'array') {
        return this.getMultiSelectFilter(field, matchEnum);
      }
      return this.convertToObj(field, { [Op.in]: matchEnum });
    }

    // 受核心限制这里实际只能套两层
    return this.convertToObj(field, { [this.like]: `%${escapeLike(keyword)}%` });
  }

  public number(field: string, keyword: string): WhereOptions<any> {
    return {
      [Op.and]: [
        where(
          literal(`CAST(${col(field).col} AS TEXT)`), // 确保不加引号，直接插入 SQL 表达式
          {
            [Op.like]: `%${escapeLike(keyword)}%`,
          },
        ),
      ],
    };
  }

  json(field: string, keyword: string): any {
    return null;
  }

  // a.b.c = xxx 转成 { a: { b: { c: 'xxx' } } }
  protected convertToObj<T, K extends string>(key: K, value: T): NestedRecord<T, K> {
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

  // 多选框如何生成filter
  protected getMultiSelectFilter(field: string, matchEnum: string[]): WhereOptions<any> {
    return this.convertToObj(field, { [Op.contains]: matchEnum });
  }
}
