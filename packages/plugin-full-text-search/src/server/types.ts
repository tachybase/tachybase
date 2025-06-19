import { Context } from '@tachybase/actions';
import { Collection } from '@tachybase/database';

import { FieldBase } from './dialects/FieldBase';

// 完整的fields 如"table"."field"
export type FiledName = string;
export interface SearchParams {
  keywords?: string[];
  fields?: string[];
  isSearchAllFields?: boolean;
}

export interface ProcessFieldParams {
  ctx: Context;
  field: string;
  handler: FieldBase;
  collection: Collection;
  search: SearchParams;
  // '+08:00'
  timezone: string;
}

export type handleFieldParams = {
  // TODO: 这样做只能做到一级关联, 以后需要支持多级关联
  collectionName?: string;
  field: string;
  keyword: string;
  fields: Map<string, any>;
  timezone?: string;
  dateStr?: string;
};
