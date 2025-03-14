import { Context, Next } from '@tachybase/actions';
import Database from '@tachybase/database';
import { Application, Logger } from '@tachybase/server';
import { App, Db, InjectLog, Service } from '@tachybase/utils';

import * as ipaddr from 'ipaddr.js';

import { NAMESPACE } from '../../constants';

// 缓存数据类型
interface IPFilterCache {
  allowList: string[];
  blockList: string[];
  allowFirst: boolean;
  lastUpdated: Date;
}

@Service()
export class IPFilterService {
  @Db()
  db: Database;

  @App()
  app: Application;

  @InjectLog()
  private logger: Logger;

  // 缓存前缀
  private readonly CACHE_KEY = 'ipFilter:config';
  // 缓存过期时间（毫秒）
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5分钟

  // 内存缓存
  private config: IPFilterCache = {
    allowList: [],
    blockList: [],
    allowFirst: true,
    lastUpdated: new Date(0), // 初始设置为过期
  };

  async load() {
    // 添加中间件
    this.addMiddleWare();

    // 设置监听器
    this.setupIPFilterListener();

    this.app.on('afterStart', async () => {
      // 初始化IP过滤器配置
      await this.initIPFilterConfig();
    });
  }

  /**
   * 初始化IP过滤器配置
   */
  private async initIPFilterConfig(): Promise<void> {
    try {
      // 从缓存中获取配置
      const cachedConfig = await this.app.cache.get<IPFilterCache>(this.CACHE_KEY);
      if (cachedConfig) {
        this.config = cachedConfig;
        this.logger.info('Loaded IP filter config from cache');
        return;
      }

      // 如果缓存中没有，从数据库加载
      await this.loadConfigFromDBAtStart();
    } catch (error) {
      this.logger.error('Failed to initialize IP filter config:', error);
    }
  }

  private async loadConfigFromDBAtStart() {
    try {
      const ipFilterRepo = this.db.getRepository('ipFilter');
      const ipFilter = await ipFilterRepo.findOne();
      if (ipFilter) {
        await this.loadConfigFromDB(ipFilter);
      } else {
        // 创建默认配置
        await this.createDefaultConfig();
      }
    } catch (error) {
      this.logger.error('Failed to init ip filter:', error);
    }
  }

  /**
   * 从数据库加载IP过滤器配置
   */
  private async loadConfigFromDB(ipFilter: any): Promise<void> {
    try {
      // 解析配置
      const allowList = this.parseIPList(ipFilter.get('allowList') || '');
      const blockList = this.parseIPList(ipFilter.get('blockList') || '');
      const allowFirst = ipFilter.get('allowFirst') !== false; // 默认为true

      // 更新内存配置
      this.config = {
        allowList,
        blockList,
        allowFirst,
        lastUpdated: new Date(),
      };

      // 更新缓存
      await this.app.cache.set(this.CACHE_KEY, this.config, this.CACHE_TTL);

      this.logger.info(`Loaded IP filter config: ${allowList.length} allowed, ${blockList.length} blocked`);
    } catch (error) {
      this.logger.error('Failed to load IP filter config from database:', error);
    }
  }

  /**
   * 创建默认配置
   */
  private async createDefaultConfig(): Promise<void> {
    try {
      const ipFilterRepo = this.db.getRepository('ipFilter');
      await ipFilterRepo.create({
        values: {
          allowList: '',
          blockList: '',
          allowFirst: true,
        },
      });

      this.config = {
        allowList: [],
        blockList: [],
        allowFirst: true,
        lastUpdated: new Date(),
      };

      await this.app.cache.set(this.CACHE_KEY, this.config, this.CACHE_TTL);
      this.logger.info('Created default IP filter config');
    } catch (error) {
      this.logger.error('Failed to create default IP filter config:', error);
    }
  }

  /**
   * 解析IP列表文本为数组
   */
  private parseIPList(ipListText: string): string[] {
    if (!ipListText) return [];

    return ipListText
      .split('\n')
      .map((ip) => ip.trim())
      .filter((ip) => ip && !ip.startsWith('#')); // 过滤空行和注释
  }

  /**
   * 设置监听ipFilter表变动的事件
   */
  private setupIPFilterListener(): void {
    // 监听ipFilter表的更新事件
    this.app.db.on('ipFilter.afterUpdate', async (model) => {
      await this.loadConfigFromDB(model);
      this.logger.info('IP filter config updated');
    });
  }

  /**
   * 添加IP过滤中间件
   */
  private addMiddleWare(): void {
    // 添加IP检查中间件（全局，优先级高）
    this.app.resourcer.use(
      async (ctx: Context, next: Next) => {
        const clientIP = ctx.state.clientIp;

        // 检查IP是否被允许访问
        const isAllowed = await this.isIPAllowed(clientIP);
        if (!isAllowed) {
          ctx.throw(403, ctx.t('Your IP address is not allowed to access this resource', { ns: NAMESPACE }));
        }

        await next();
      },
      { tag: 'ipFilterControl', before: 'lockUserByPasswordPolicy' },
    );
  }

  /**
   * 检查IP是否被允许访问
   * @param ip 客户端IP地址
   * @returns 如果IP被允许访问，返回true；否则返回false
   */
  public async isIPAllowed(ip: string): Promise<boolean> {
    try {
      // 解析IP地址
      const parsedIP = ipaddr.parse(ip);

      // 检查是否在白名单中
      const inAllowList = this.isInList(parsedIP, this.config.allowList);

      // 检查是否在黑名单中
      const inBlockList = this.isInList(parsedIP, this.config.blockList);

      // 根据allowFirst决定返回结果
      if (this.config.allowFirst) {
        // 白名单优先：在白名单中或不在黑名单中
        return inAllowList || !inBlockList;
      } else {
        // 黑名单优先：不在黑名单中且在白名单中
        return !inBlockList && (inAllowList || this.config.allowList.length === 0);
      }
    } catch (error) {
      this.logger.error(`Error checking IP ${ip}:`, error);
      // 出错时默认允许访问
      return true;
    }
  }

  /**
   * 检查IP是否在列表中
   * @param ip 解析后的IP地址
   * @param list IP地址列表
   * @returns 如果IP在列表中，返回true；否则返回false
   */
  private isInList(ip: ipaddr.IPv4 | ipaddr.IPv6, list: string[]): boolean {
    for (const entry of list) {
      try {
        // 处理CIDR格式
        if (entry.includes('/')) {
          const cidr = ipaddr.parseCIDR(entry);
          if (ip.kind() === cidr[0].kind() && ip.match(cidr)) {
            return true;
          }
        }
        // 处理单个IP
        else {
          const listIP = ipaddr.parse(entry);
          if (ip.kind() === listIP.kind() && ip.toString() === listIP.toString()) {
            return true;
          }
        }
      } catch (error) {
        this.logger.error(`Invalid IP or CIDR in list: ${entry}`, error);
      }
    }
    return false;
  }
}
