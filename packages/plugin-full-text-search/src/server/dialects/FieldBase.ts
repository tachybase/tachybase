import { Collection, literal, Op, where } from '@tachybase/database';

import { col, WhereOptions } from 'sequelize';

import { handleFieldParams } from '../types';
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

  public date(params: handleFieldParams): any {
    return null;
  }

  public string(params: handleFieldParams): WhereOptions<any> | null {
    const { field, fields, keyword } = params;
    const fieldInfo = fields.get(field);
    if (fieldInfo?.options?.uiSchema?.['x-component'] === 'Select') {
      const matchEnum = this.getMatchEnum(fieldInfo, keyword);
      if (!matchEnum.length) {
        return null;
      }
      return this.convertToObj(field, { [Op.in]: matchEnum });
    }

    // 受核心限制这里实际只能套两层
    return this.convertToObj(field, { [this.like]: `%${escapeLike(keyword)}%` });
  }

  public number(params: handleFieldParams): WhereOptions<any> {
    const { field, keyword, collectionName, collection } = params;
    // keyword不是数字则不作为搜索条件
    if (isNaN(Number(keyword))) {
      return null;
    }
    return {
      [Op.and]: [
        where(
          literal(`CAST(${this.getCollectionFieldColName(field, collection, collectionName)} AS TEXT)`), // 确保不加引号，直接插入 SQL 表达式
          {
            [Op.like]: `%${escapeLike(keyword)}%`,
          },
        ),
      ],
    };
  }

  json(params: handleFieldParams): any {
    return null;
  }

  // a.b.c = xxx 转成 { a: { b: { c: 'xxx' } } }
  protected convertToObj<T, K extends string>(key: K, value: T): NestedRecord<T, K> {
    const MAX_DEPTH = 3;
    const parts = key.split('.');
    if (parts.length > MAX_DEPTH) {
      throw new Error(`Maximum nesting depth of ${MAX_DEPTH} exceeded`);
    }
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
  public getMultiSelectFilter(rawField: string, matchEnum: string[]): WhereOptions<any> {
    return this.convertToObj(rawField, { [Op.contains]: matchEnum });
  }

  public array(params: handleFieldParams) {
    const { field, keyword, fields, collectionName, collection } = params;
    const fieldInfo = fields.get(field);
    if (fieldInfo?.options?.uiSchema?.['x-component'] === 'Select') {
      const matchEnum = this.getMatchEnum(fieldInfo, keyword);
      if (!matchEnum.length) {
        return null;
      }
      return this.getMultiSelectFilter(this.getCollectionFieldColName(field, collection, collectionName), matchEnum);
    }
    return null;
  }

  private getMatchEnum(fieldInfo, keyword: string) {
    const matchEnum = [];
    const enumList = fieldInfo?.options.uiSchema.enum || [];
    const lowerKeyword = keyword.toLowerCase();
    for (const item of enumList) {
      if (typeof item?.label === 'string' && item.label.toLowerCase().includes(lowerKeyword)) {
        matchEnum.push(item.value);
      }
    }
    return matchEnum;
  }

  protected getCollectionField(fieldName: string, collection: Collection, collectionName?: string) {
    let rawFieldName = fieldName;
    if (collection) {
      rawFieldName = collection.model.rawAttributes[fieldName]?.field || fieldName;
    }
    if (!collectionName) {
      return col(rawFieldName);
    }
    return col(`${collectionName}.${rawFieldName}`);
  }

  protected getCollectionFieldColName(fieldName: string, collection: Collection, collectionName?: string) {
    return this.getCollectionField(fieldName, collection, collectionName).col;
  }
}
