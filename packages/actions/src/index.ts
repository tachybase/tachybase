import { Cache } from '@tachybase/cache';
import { Database } from '@tachybase/database';
import { Action } from '@tachybase/resourcer';

import Koa from 'koa';
import lodash from 'lodash';

import * as actions from './actions';

export * as utils from './utils';

export * from './constants';

export type Next = () => Promise<any>;

export interface Context extends Koa.Context {
  db: Database;
  cache: Cache;
  action: Action;
  body: any;
  app: any;

  /**
   * 是否包裹 data 对象，比如返回的 body 为 "success"，withoutDataWrapping 为 false 的时候，返回的 body 会被包成 { "data": "success" }
   */
  withoutDataWrapping?: boolean;

  [key: string]: any;
}

export function registerActions(api: any) {
  api.actions(
    lodash.pick(actions, [
      'add',
      'create',
      'destroy',
      'get',
      'list',
      'remove',
      'set',
      'toggle',
      'update',
      'move',
      'firstOrCreate',
      'updateOrCreate',
    ]),
  );
}

export default actions;
