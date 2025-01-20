import Database, { Collection } from '@tachybase/database';

import { FieldBase } from './dialects/FieldBase';
import { ProcessFieldParams } from './types';

const fieldTypes = {
  string: ['string', 'text', 'sequence', 'uid', 'integer', 'float', 'array'],
  number: ['bigInt', 'double'],
  date: ['date', 'datetime', 'timestamp'],
  json: ['json', 'jsonb'],
};

function isFieldType(type: string, fieldType: keyof typeof fieldTypes): boolean {
  return fieldTypes[fieldType].includes(type);
}

function getCollectionField(collection: Collection, fieldStr: string, db: Database) {
  if (!fieldStr.includes('.')) {
    return {
      collection,
      fieldStr,
    };
  }
  const parts = fieldStr.split('.');
  const associationTable = parts.shift(); // 第一部分是关联表
  const fields = collection.getFields();
  const foreignField = fields.find((v) => v.name === associationTable);

  // TODO: 此处foreignField为空,怎么处理
  const newCollection = db.getCollection(foreignField.target);
  const newField = parts.join('.'); // 剩余部分
  return getCollectionField(newCollection, newField, db);
}

export function handleField(fieldName: string, keywords: string[], handler: FieldBase, func: string): any[] {
  const conditions = [];
  for (const keyword of keywords) {
    const condition = handler[func](fieldName, keyword);
    if (condition) {
      conditions.push(condition);
    }
  }
  return conditions;
}

export function processField({ field, handler, collection, ctx, search, timezone }: ProcessFieldParams): any[] {
  let type: string;
  let fields: Map<string, any>;

  if (!field.includes('.')) {
    fields = collection.fields;
    type = fields.get(field)?.type;
  } else {
    const { collection: targetCollection, fieldStr } = getCollectionField(collection, field, ctx.db);
    fields = targetCollection.fields;
    type = fields.get(fieldStr)?.type;
    fields = collection.fields;
  }

  if (fields.get(field)?.options?.isForeignKey) {
    return [];
  }

  if (isFieldType(type, 'string')) {
    // string支持关联字段
    // return handleField(field, search.keywords, handler, 'string');
    const list = [];
    for (const keyword of search.keywords) {
      const condition = handler.string(field, keyword, fields);
      if (condition) {
        list.push(condition);
      }
    }
    return list;
  } else if (isFieldType(type, 'number')) {
    // 暂不支持关联字段 TODO 后续考虑抽成装饰器
    if (!field.includes('.')) {
      return handleField(field, search.keywords, handler, 'number');
    }
  } else if (isFieldType(type, 'date')) {
    // 暂不支持关联字段
    if (!field.includes('.')) {
      const formatStr = handler.getFormateDateStr(field, fields);
      const list = [];
      for (const keyword of search.keywords) {
        const condition = handler.date(field, keyword, formatStr, timezone);
        if (condition) {
          list.push(condition);
        }
      }
      return list;
    }
  } else if (isFieldType(type, 'json')) {
    // 暂不支持关联字段
    if (!field.includes('.')) {
      return handleField(field, search.keywords, handler, 'json');
    }
  }

  return [];
}
