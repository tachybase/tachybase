import { useContext } from 'react';

import { Schema } from '@formily/json-schema';

import { SchemaContext } from '../shared';

export const useFieldSchema = (): Schema => {
  return useContext(SchemaContext);
};
