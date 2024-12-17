import { importModule, Toposort, ToposortOptions } from '@tachybase/utils';

import { globSync } from 'glob';
import compose from 'koa-compose';
import _ from 'lodash';
import { pathToRegexp } from 'path-to-regexp';

import Action, { ActionName } from './action';
import Resource, { ResourceOptions } from './resource';
import { getNameByParams, ParsedParams, parseQuery, parseRequest } from './utils';

export interface ResourcerContext {
  resourcer?: Resourcer;
  action?: Action;
  [key: string]: any;
}

export interface KoaMiddlewareOptions {
  skipIfDataSourceExists?: boolean;

  /**
   * 前缀
   */
  prefix?: string;

  /**
   * 自定义 resource name 的获取规则
   *
   * 默认规则 relatedTable ? relatedTable.table : table
   */
  nameRule?: (params: ParsedParams) => string;

  /**
   * 自定义 action name
   *
   * 默认为
   *
   * - list 查看列表
   * - create 新增数据
   * - get 查看数据详情
   * - update 更新数据
   * - delete 删除数据
   */
  accessors?: {
    /**
     * 查看列表
     */
    list?: string;

    /**
     * 新增数据
     */
    create?: string;

    /**
     * 查看数据详情
     */
    get?: string;

    /**
     * 更新数据
     */
    update?: string;

    /**
     * 删除数据
     */
    delete?: string;
  };
}

export interface ResourcerOptions {
  /**
   * 前缀
   */
  prefix?: string;

  /**
   * 自定义 action name
   *
   * 默认为
   *
   * - list 查看列表
   * - create 新增数据
   * - get 查看数据详情
   * - update 更新数据
   * - delete 删除数据
   */
  accessors?: {
    /**
     * 查看列表
     */
    list?: string;

    /**
     * 新增数据
     */
    create?: string;

    /**
     * 查看数据详情
     */
    get?: string;

    /**
     * 更新数据
     */
    update?: string;

    /**
     * 删除数据
     */
    delete?: string;
  };
}

export interface ExecuteOptions {
  /**
   * 资源名称
   */
  resource: string;

  /**
   * 自定义 action name
   *
   * 默认
   * - list 查看列表
   * - create 新增数据
   * - get 查看数据详情
   * - update 更新数据
   * - delete 删除数据
   */
  action: ActionName;
}

export type HandlerType = (ctx: ResourcerContext, next: () => Promise<any>) => any;

export interface Handlers {
  [key: string]: HandlerType;
}

export interface ImportOptions {
  /**
   * 指定配置所在路径
   */
  directory: string;

  /**
   * 文件后缀，默认值 ['js', 'ts', 'json']
   */
  extensions?: string[];
}

export class Resourcer {
  /**
   * @internal
   */
  public readonly options: ResourcerOptions;
  protected resources = new Map<string, Resource>();
  /**
   * 全局定义的 action handlers
   */
  protected handlers = new Map<ActionName, any>();
  protected actionHandlers = new Map<ActionName, any>();
  protected middlewareHandlers = new Map<string, any>();
  protected middlewares: Toposort<any>;
  public middlewareSourceMap: WeakMap<Function, string> = new WeakMap();

  constructor(options: ResourcerOptions = {}) {
    this.options = options;
    this.middlewares = new Toposort<any>();
  }

  /**
   * 载入指定目录下的 resource 配置（配置的文件驱动）
   *
   * TODO: 配置的文件驱动现在会全部初始化，大数据时可能存在性能瓶颈，后续可以加入动态加载
   *
   * @param {object}   [options]
   * @param {string}   [options.directory] 指定配置所在路径
   * @param {array}    [options.extensions = ['js', 'ts', 'json']] 文件后缀
   *
   */
  public async import(options: ImportOptions): Promise<Map<string, Resource>> {
    const { extensions = ['js', 'ts', 'json'], directory } = options;
    const patten = `${directory}/*.{${extensions.join(',')}}`;
    const files = globSync(patten, {
      ignore: ['**/*.d.ts'],
    });
    const resources = new Map<string, Resource>();
    for (const file of files) {
      const options = await importModule(file);
      const table = this.define(typeof options === 'function' ? options(this) : options);
      resources.set(table.getName(), table);
    }
    return resources;
  }

  /**
   * resource 配置
   *
   * @param name
   * @param options
   */
  define(options: ResourceOptions) {
    const { name } = options;
    const resource = new Resource(options, this);
    this.resources.set(name, resource);
    return resource;
  }

  isDefined(name: string) {
    return this.resources.has(name);
  }

  /**
   * @internal
   */
  removeResource(name) {
    return this.resources.delete(name);
  }

  /**
   * This method is deprecated and should not be used.
   * Use {@link this.registerActionHandler()} instead.
   * @deprecated
   */
  registerAction(name: ActionName, handler: HandlerType) {
    this.registerActionHandler(name, handler);
  }

  /**
   * This method is deprecated and should not be used.
   * Use {@link this.registerActionHandlers()} instead.
   * @deprecated
   */
  registerActions(handlers: Handlers) {
    this.registerActionHandlers(handlers);
  }

  /**
   * 注册全局的 action handlers
   *
   * @param handlers
   */
  registerActionHandlers(handlers: Handlers) {
    for (const [name, handler] of Object.entries(handlers)) {
      this.registerActionHandler(name, handler);
    }
  }

  registerActionHandler(name: ActionName, handler: HandlerType) {
    this.actionHandlers.set(name, handler);
  }

  /**
   * @internal
   */
  getRegisteredHandler(name: ActionName) {
    return this.actionHandlers.get(name);
  }

  /**
   * @internal
   */
  getRegisteredHandlers() {
    return this.actionHandlers;
  }

  /**
   * @internal
   */
  getResource(name: string): Resource {
    if (!this.resources.has(name)) {
      throw new Error(`${name} resource does not exist`);
    }
    return this.resources.get(name);
  }

  /**
   * @internal
   */
  getAction(name: string, action: ActionName): Action {
    // 支持注册局部 action
    if (this.actionHandlers.has(`${name}:${action}`)) {
      return this.getResource(name).getAction(`${name}:${action}`);
    }
    return this.getResource(name).getAction(action);
  }

  /**
   * @internal
   */
  getMiddlewares() {
    return this.middlewares.nodes;
  }

  setStackTrace(middlewares) {
    const myObject = { stack: '' };
    Error.captureStackTrace(myObject);
    const stackLines = myObject.stack.split('\n');
    stackLines.splice(0, 3);
    this.middlewareSourceMap.set(middlewares, stackLines.join('\n'));
  }

  use(middlewares: HandlerType | HandlerType[], options: ToposortOptions = {}) {
    this.setStackTrace(middlewares);
    this.middlewares.add(middlewares, options);
  }

  /**
   * This method is deprecated and should not be used.
   * Use {@link this.middleware()} instead.
   * @deprecated
   */
  restApiMiddleware({ prefix, accessors, skipIfDataSourceExists = false }: KoaMiddlewareOptions = {}) {
    return async (ctx: ResourcerContext, next: () => Promise<any>) => {
      if (skipIfDataSourceExists) {
        const dataSource = ctx.get('x-data-source');
        if (dataSource) {
          return next();
        }
      }

      ctx.resourcer = this;

      let params = parseRequest(
        {
          path: ctx.request.path,
          method: ctx.request.method,
        },
        {
          prefix: this.options.prefix || prefix,
          accessors: this.options.accessors || accessors,
        },
      );

      if (!params) {
        return next();
      }

      try {
        const resource = this.getResource(getNameByParams(params));

        // 为关系资源时，暂时需要再执行一遍 parseRequest
        if (resource.options.type && resource.options.type !== 'single') {
          params = parseRequest(
            {
              path: ctx.request.path,
              method: ctx.request.method,
              type: resource.options.type,
            },
            {
              prefix: this.options.prefix || prefix,
              accessors: this.options.accessors || accessors,
            },
          );

          if (!params) {
            return next();
          }
        }

        // action 需要 clone 之后再赋给 ctx
        ctx.action = this.getAction(getNameByParams(params), params.actionName).clone();

        ctx.action.setContext(ctx);
        ctx.action.actionName = params.actionName;
        ctx.action.sourceId = params.associatedIndex;
        ctx.action.resourceOf = params.associatedIndex;
        ctx.action.resourceName = params.associatedName
          ? `${params.associatedName}.${params.resourceName}`
          : params.resourceName;
        ctx.action.params.filterByTk = params.resourceIndex;
        const query = parseQuery(ctx.request.querystring);
        if (pathToRegexp('/resourcer/{:associatedName.}?:resourceName{\\::actionName}').test(ctx.request.path)) {
          ctx.action.mergeParams({
            ...query,
            ...params,
            ...ctx.request.body,
          });
        } else {
          ctx.action.mergeParams({
            ...query,
            ...params,
            ...(_.isEmpty(ctx.request.body) ? {} : { values: ctx.request.body }),
          });
        }
        return compose(ctx.action.getHandlers())(ctx, next);
      } catch (error) {
        console.log(error);
        return next();
      }
    };
  }

  middleware(options: KoaMiddlewareOptions = {}) {
    return this.restApiMiddleware(options);
  }

  /**
   * @internal
   */
  async execute(options: ExecuteOptions, context: ResourcerContext = {}, next?: any) {
    const { resource, action } = options;
    context.resourcer = this;
    context.action = this.getAction(resource, action);
    return await context.action.execute(context, next);
  }
}

export default Resourcer;
