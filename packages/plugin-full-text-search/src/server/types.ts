import { Context } from '@tachybase/actions';
import { Collection } from '@tachybase/database';

import { Dialect } from './dialects/Dialect';

export interface SearchParams {
  keywords?: string[];
  fields?: string[];
  isSearchAllFields?: boolean;
}

export interface ProcessFieldParams {
  ctx: Context;
  field: string;
  handler: Dialect;
  collection: Collection;
  search: SearchParams;
}
