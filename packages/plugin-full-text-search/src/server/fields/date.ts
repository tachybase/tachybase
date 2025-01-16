import { Op, where } from '@tachybase/database';

import { Dialect } from '../dialects/Dialect';
import { escapeLike } from '../utils';

interface HandleDateFieldParams {
  fieldName: string;
  keywords: string[];
  handler: Dialect;
  timezone: string;
  fieldInfo: any;
}

export function handleDateField({ fieldName, keywords, handler, timezone, fieldInfo }: HandleDateFieldParams): any[] {
  let formatStr = 'YYYY-MM-DD HH:mm:ss';

  if (fieldInfo?.get(fieldName)?.options?.uiSchema?.['x-component-props']?.dateFormat) {
    const props = fieldInfo.get(fieldName).options.uiSchema['x-component-props'];
    formatStr = props.dateFormat;
    if (props.showTime) {
      formatStr += props.timeFormat.endsWith(' a') ? ' HH12:MI:SS' : ' HH24:MI:SS';
    }
  }

  const conditions = [];

  // TODO: 这里要区分dialect
  for (const keyword of keywords) {
    const condition = handler.formatDate(fieldName, timezone, formatStr);
    if (!condition) {
      continue;
    }
    conditions.push(
      where(condition, {
        [Op.iLike]: `%${escapeLike(keyword)}%`,
      }),
    );
  }

  return conditions;
}
