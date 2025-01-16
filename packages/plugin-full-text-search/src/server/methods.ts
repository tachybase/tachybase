import Database, { Collection } from '@tachybase/database';

import { handleDateField } from './fields/date';
import { handleJsonField } from './fields/json';
import { handleNumberField } from './fields/number';
import { handleStringField } from './fields/string';
import { ProcessFieldParams } from './types';

const fieldTypes = {
  string: ['string', 'text', 'sequence', 'uid', 'integer', 'float'],
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

export function processField({ field, handler, collection, ctx, search }: ProcessFieldParams): any[] {
  let type: string;
  let fieldName: string;
  let fields: Map<string, any>;

  if (!field.includes('.')) {
    fieldName = handler.getFieldName(ctx.action.resourceName, field);
    fields = collection.fields;
    type = fields.get(field)?.type;
  } else {
    const { collection: targetCollection, fieldStr } = getCollectionField(collection, field, ctx.db);
    fields = targetCollection.fields;
    type = fields.get(fieldStr)?.type;
    fieldName = handler.getFieldName(targetCollection.name, fieldStr);
    fields = collection.fields;
  }

  if (isFieldType(type, 'string')) {
    // string支持关联字段
    return handleStringField(field, search.keywords, handler);
  }
  if (isFieldType(type, 'number')) {
    // 暂不支持关联字段
    if (!field.includes('.')) {
      return handleNumberField(fieldName, search.keywords, handler);
    }
  }
  if (isFieldType(type, 'date')) {
    // 暂不支持关联字段
    if (!field.includes('.')) {
      return handleDateField({
        fieldName,
        keywords: search.keywords,
        handler,
        timezone: ctx.get('X-Timezone') || '+00:00',
        fieldInfo: fields,
      });
    }
  }
  if (isFieldType(type, 'json')) {
    // 暂不支持关联字段
    if (!field.includes('.')) {
      return handleJsonField(fieldName, search.keywords, handler);
    }
  }

  return [];
}
