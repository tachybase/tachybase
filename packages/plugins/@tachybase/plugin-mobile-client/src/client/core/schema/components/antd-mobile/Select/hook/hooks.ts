import { useCallback } from 'react';
import { useDesignable } from '@tachybase/client';
import { GeneralField, reaction, useField, useFieldSchema } from '@tachybase/schema';
import { flatten, getValuesByPath } from '@tachybase/utils/client';

import _, { isString } from 'lodash';
import cloneDeep from 'lodash/cloneDeep';

export const useInsertSchema = (component, fieldSchema, insertAfterBegin) => {
  const insert = (ss) => {
    const schema = fieldSchema.reduceProperties((buf, s) => {
      if (s['x-component'] === 'AssociationField.' + component) {
        return s;
      }
      return buf;
    }, null);
    if (!schema) {
      insertAfterBegin(cloneDeep(ss));
    }
  };

  return insert;
};
