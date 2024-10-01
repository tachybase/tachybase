import { paramsMap } from '../../../constants/mapListve';
import { getSchemaAction } from './getSchemaAction';

export function getSchemaParam(actionKey, form) {
  const schemaChild = {};

  const targetParams = paramsMap[actionKey] || [];

  const schemaMap = getSchemaAction(form, actionKey);

  for (const param of targetParams) {
    schemaChild[param] = schemaMap[param];
  }

  return schemaChild;
}
