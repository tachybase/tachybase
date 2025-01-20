import Database, { Collection } from '@tachybase/database';

import { FieldBase } from './dialects/FieldBase';
import { handleFieldParams, ProcessFieldParams } from './types';

const fieldTypes = {
  string: ['string', 'text', 'sequence', 'uid', 'integer', 'float'],
  number: ['bigInt', 'double'],
  date: ['date', 'datetime', 'timestamp'],
  json: ['json', 'jsonb'],
  array: ['array'],
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
  if (!foreignField) {
    db.logger.error(`Foreign field '${associationTable}' not found in collection '${collection.name}'`);
  }

  const newCollection = db.getCollection(foreignField.target);
  const newField = parts.join('.'); // 剩余部分
  return getCollectionField(newCollection, newField, db);
}

export function handleField(
  handler: FieldBase,
  func: Function,
  field: string,
  fields: Map<string, any>,
  keywords: string[],
  extraParams: {
    timezone?: string;
    dateStr?: string;
  } = {},
): any[] {
  const conditions = [];
  for (const keyword of keywords) {
    const params: handleFieldParams = {
      field,
      fields,
      keyword,
      timezone: extraParams.timezone,
      dateStr: extraParams.dateStr,
    };
    const condition = func.call(handler, params);
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
    // 为以后支持关联字段做支持
    // 目前只支持关联到string,关联到bigint,date可能会有问题
    const { collection: targetCollection, fieldStr } = getCollectionField(collection, field, ctx.db);
    fields = targetCollection.fields;
    type = fields.get(fieldStr)?.type;
  }

  if (fields.get(field)?.options?.isForeignKey) {
    return [];
  }

  if (isFieldType(type, 'string')) {
    // string支持关联字段
    return handleField(handler, handler.string, field, fields, search.keywords);
  } else if (isFieldType(type, 'number')) {
    // 暂不支持关联字段 TODO 后续考虑抽成装饰器
    if (!field.includes('.')) {
      return handleField(handler, handler.number, field, fields, search.keywords);
    }
  } else if (isFieldType(type, 'date')) {
    // 暂不支持关联字段
    if (!field.includes('.')) {
      const dateStr = handler.getFormateDateStr(field, fields);
      return handleField(handler, handler.date, field, fields, search.keywords, {
        timezone,
        dateStr,
      });
    }
  } else if (isFieldType(type, 'json')) {
    // 暂不支持关联字段
    if (!field.includes('.')) {
      return handleField(handler, handler.json, field, fields, search.keywords);
    }
  } else if (isFieldType(type, 'array')) {
    // 暂不支持关联字段
    if (!field.includes('.')) {
      return handleField(handler, handler.array, field, fields, search.keywords);
    }
  }

  return [];
}
