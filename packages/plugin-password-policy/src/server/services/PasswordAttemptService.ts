import { createContext, Script } from 'node:vm';
import { Context, Next } from '@tachybase/actions';
import Database, { PasswordField } from '@tachybase/database';
import { Application, Logger } from '@tachybase/server';
import { App, Db, Inject, InjectLog, Service } from '@tachybase/utils';

import * as geoip from 'geoip-lite';

import { LOCK_SECONDS, NAMESPACE, WINDOW_SECONDS } from '../../constants';

interface SignInFailConfig {
  windowSeconds: number; // 检查时间窗口（秒）
  maxAttempts: number; // 最大失败次数，0表示不启用防护
  lockSeconds: number; // 锁定时间（秒）
  strictLock: boolean; // 是否严格控制使用
}

interface FailureRecord {
  userId: number;
  createdAt: Date;
}

interface LockedUserInfo {
  id: number;
  expireAt: Date | null; // 允许为null表示用户未被锁定
  lastChecked: Date;
}

interface GeoLocation {
  country?: string;
  region?: string;
  city?: string;
}

@Service()
export class PasswordAttemptService {
  @Db()
  db: Database;

  @App()
  app: Application;

  @InjectLog()
  private logger: Logger;

  private config: SignInFailConfig;

  // 内存缓存，用于存储最近的失败记录
  private failureRecords: Map<number, FailureRecord[]> = new Map();

  // 缓存前缀
  private readonly CACHE_PREFIX = 'passwordAttempt';

  // 缓存过期时间（毫秒）
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5分钟

  async load() {
    this.addMiddleWare();

    this.app.on('afterStart', async () => {
      // 从配置中读取参数
      const config = await this.db.getRepository('passwordAttempt').findOne();
      await this.refreshConfig(config);

      // 初始化锁定用户缓存
      await this.initLockedUsersCache();

      // 监听userLocks表的变动
      this.setupLockedUsersListener();
    });
    this.db.on('passwordAttempt.afterSave', async (model) => {
      await this.refreshConfig(model);
    });
  }

  /**
   * 获取用户锁定信息的缓存键
   * @param userId 用户ID
   * @returns 缓存键
   */
  private getUserLockCacheKey(userId: number): string {
    return `${this.CACHE_PREFIX}:locked:${userId}`;
  }

  /**
   * 初始化被锁定用户的缓存
   */
  private async initLockedUsersCache(): Promise<void> {
    try {
      const now = new Date();
      const lockedUsersRepo = this.db.getRepository('userLocks');
      const lockedUsers = await lockedUsersRepo.find({
        filter: {
          expireAt: {
            $gt: now,
          },
        },
      });

      // 清除旧缓存
      // 注意：这里我们不能清除所有缓存，因为可能有其他服务也在使用app.cache

      // 添加新缓存
      for (const user of lockedUsers) {
        const userId = user.get('userId');
        const expireAt = user.get('expireAt');

        await this.app.cache.set(
          this.getUserLockCacheKey(userId),
          {
            id: userId,
            expireAt,
            lastChecked: now,
          },
          this.CACHE_TTL,
        );
      }

      this.logger.info(`Loaded ${lockedUsers.length} locked users into cache`);
    } catch (error) {
      this.logger.error('Failed to load locked users into cache:', error);
    }
  }

  /**
   * 设置监听userLocks表变动的事件
   */
  private setupLockedUsersListener(): void {
    // 监听userLocks表的创建事件
    this.app.db.on('userLocks.afterCreate', async (model) => {
      const userId = model.get('userId');
      const expireAt = model.get('expireAt');

      await this.app.cache.set(
        this.getUserLockCacheKey(userId),
        {
          id: userId,
          expireAt,
          lastChecked: new Date(),
        },
        this.CACHE_TTL,
      );

      this.logger.info(`Added user ${userId} to locked users cache`);
    });

    // 监听userLocks表的更新事件
    this.app.db.on('userLocks.afterUpdate', async (model) => {
      const userId = model.get('userId');
      if (!userId && model.previous('userId')) {
        const userId = model.previous('userId');
        await this.app.cache.del(this.getUserLockCacheKey(userId));
        await this.clearUserFailRecords(userId);
        this.logger.info(`Removed user ${userId} from locked users cache (deleted)`);
        return;
      }
      const expireAt = model.get('expireAt');
      const now = new Date();

      if (expireAt > now) {
        await this.app.cache.set(
          this.getUserLockCacheKey(userId),
          {
            id: userId,
            expireAt,
            lastChecked: now,
          },
          this.CACHE_TTL,
        );
        this.logger.info(`Updated user ${userId} in locked users cache`);
      } else {
        // 锁定过期，清除缓存并清空失败记录
        await this.app.cache.del(this.getUserLockCacheKey(userId));
        await this.clearUserFailRecords(userId);
        this.logger.info(`Removed user ${userId} from locked users cache (expired)`);
      }
    });

    // 监听userLocks表的删除事件
    this.app.db.on('userLocks.afterDestroy', async (model) => {
      const userId = model.get('userId');
      await this.app.cache.del(this.getUserLockCacheKey(userId));
      // 用户被解锁，清空失败记录
      await this.clearUserFailRecords(userId);
      this.logger.info(`Removed user ${userId} from locked users cache (deleted)`);
    });
  }

  /**
   * 清空用户的登录失败记录
   * @param userId 用户ID
   */
  private async clearUserFailRecords(userId: number): Promise<void> {
    try {
      // 从数据库中删除失败记录
      await this.db.getRepository('signInFails').update({
        filter: {
          userId,
        },
        values: {
          status: false,
        },
      });

      // 从内存缓存中删除
      this.failureRecords.delete(userId);

      this.logger.info(`Cleared sign-in failure records for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to clear sign-in failure records for user ${userId}:`, error);
    }
  }

  /**
   * 检查用户是否被锁定
   * @param userId 用户ID
   * @returns 如果用户被锁定，返回true；否则返回false
   */
  private async isUserLocked(userId: number): Promise<boolean> {
    const now = new Date();
    const cacheKey = this.getUserLockCacheKey(userId);
    const cachedInfo = await this.app.cache.get<LockedUserInfo>(cacheKey);

    // 如果缓存中有数据
    if (cachedInfo) {
      // 检查缓存是否过期需要刷新
      const isCacheExpired = now.getTime() - cachedInfo.lastChecked.getTime() > this.CACHE_TTL;

      // 如果缓存已过期，在后台刷新缓存
      if (isCacheExpired) {
        this.refreshLockedUserCache(userId);
      }

      // 如果expireAt为null，表示用户未被锁定
      if (!cachedInfo.expireAt) {
        return false;
      }

      // 检查锁定是否已过期
      if (cachedInfo.expireAt > now) {
        return true;
      } else {
        // 锁定已过期，更新缓存为未锁定状态
        cachedInfo.expireAt = null;
        cachedInfo.lastChecked = now;
        await this.app.cache.set(cacheKey, cachedInfo, this.CACHE_TTL);
        // 清空失败记录
        await this.clearUserFailRecords(userId);
        return false;
      }
    }

    // 缓存中没有，从数据库查询并缓存结果
    return await this.checkAndCacheLockedUser(userId);
  }

  /**
   * 从数据库检查并缓存用户锁定状态
   * @param userId 用户ID
   * @returns 如果用户被锁定，返回true；否则返回false
   */
  private async checkAndCacheLockedUser(userId: number): Promise<boolean> {
    try {
      const now = new Date();
      const userRepository = this.db.getRepository('users');
      const user = await userRepository.findOne({
        fields: ['id'],
        filter: { id: userId },
        appends: ['lock'],
      });

      const cacheKey = this.getUserLockCacheKey(userId);

      // 无论用户是否被锁定，都缓存结果
      if (user && user.lock?.expireAt && user.lock.expireAt > now) {
        // 用户被锁定，添加到缓存
        await this.app.cache.set(
          cacheKey,
          {
            id: userId,
            expireAt: user.lock.expireAt,
            lastChecked: now,
          },
          this.CACHE_TTL,
        );
        return true;
      } else {
        // 用户未被锁定，也添加到缓存
        await this.app.cache.set(
          cacheKey,
          {
            id: userId,
            expireAt: null, // null表示未被锁定
            lastChecked: now,
          },
          this.CACHE_TTL,
        );
        return false;
      }
    } catch (error) {
      this.logger.error(`Error checking locked status for user ${userId}:`, error);
      return false;
    }
  }

  /**
   * 在后台刷新用户锁定缓存
   * @param userId 用户ID
   */
  private async refreshLockedUserCache(userId: number): Promise<void> {
    try {
      const now = new Date();
      const userRepository = this.db.getRepository('users');
      const user = await userRepository.findOne({
        fields: ['id'],
        filter: { id: userId },
        appends: ['lock'],
      });

      const cacheKey = this.getUserLockCacheKey(userId);

      if (user && user.lock?.expireAt && user.lock.expireAt > now) {
        // 用户被锁定，更新缓存
        await this.app.cache.set(
          cacheKey,
          {
            id: userId,
            expireAt: user.lock.expireAt,
            lastChecked: now,
          },
          this.CACHE_TTL,
        );
      } else {
        // 用户未被锁定，也更新缓存
        const existingInfo = await this.app.cache.get<LockedUserInfo>(cacheKey);
        if (existingInfo) {
          // 更新现有缓存
          existingInfo.expireAt = null;
          existingInfo.lastChecked = now;
          await this.app.cache.set(cacheKey, existingInfo, this.CACHE_TTL);
        } else {
          // 创建新缓存
          await this.app.cache.set(
            cacheKey,
            {
              id: userId,
              expireAt: null,
              lastChecked: now,
            },
            this.CACHE_TTL,
          );
        }
      }
    } catch (error) {
      this.logger.error(`Error refreshing locked cache for user ${userId}:`, error);
    }
  }

  async refreshConfig(config) {
    // 从配置中读取参数
    this.config = {
      windowSeconds: config?.get('windowSeconds') || WINDOW_SECONDS, // 默认5分钟
      maxAttempts: config?.get('maxAttempts') ?? 0, // 默认0，表示不启用防护
      lockSeconds: config?.get('lockSeconds') || LOCK_SECONDS, // 默认30分钟
      strictLock: config?.get('strictLock') || false, // 锁定时候禁止任意api
    };

    // 如果启用了防护，才进行初始化
    if (this.config.maxAttempts > 0) {
      // 从数据库加载最近的失败记录到内存
      await this.loadRecentRecords();
      // 定期清理过期记录
      // setInterval(() => this.cleanupExpiredRecords(), 60000); // 每分钟清理一次
    } else {
      this.logger.info('Sign-in failure protection is disabled (maxAttempts = 0)');
    }
  }

  addMiddleWare() {
    this.app.resourcer.use(
      async (ctx: Context, next: Next) => {
        const { resourceName, actionName } = ctx.action.params;
        if (resourceName === 'auth' && actionName === 'signIn') {
          const { account, password, email } = ctx.action.params.values;
          if (account && password) {
            const filter = email
              ? { email }
              : {
                  $or: [{ username: account }, { email: account }],
                };
            const userRepository = ctx.db.getRepository('users');
            const user = await userRepository.findOne({
              fields: ['id', 'password'],
              filter,
              appends: ['lock'],
            });
            if (user) {
              if (user.lock?.expireAt && user.lock.expireAt > new Date()) {
                ctx.throw(403, ctx.t('User has been locked ===', { ns: NAMESPACE }));
                return next();
              }
              // TODO: 抽一下通用的,或者用其他方式
              const field = userRepository.collection.getField<PasswordField>('password');
              const valid = await field.verify(password, user.password);
              if (!valid) {
                // 失败则需要记录
                await this.recordFailedAttempt(user, ctx.state.clientIp);
              } else {
                // 成功后重置
                await this.resetFailedAttempts(user.id);
              }
            }
          }
        }
        await next();
        // TODO: 考虑针对其他方式登录
      },
      {
        tag: 'lockUserByPasswordPolicy',
        before: 'auth',
      },
    );

    this.app.resourcer.use(
      async (ctx: Context, next: Next) => {
        if (this.config.strictLock && ctx.state.currentUser) {
          // 使用缓存检查用户是否被锁定
          const userId = ctx.state.currentUser.id;
          const isLocked = await this.isUserLocked(userId);

          if (isLocked) {
            ctx.throw(403, ctx.t('User has been locked', { ns: NAMESPACE }));
          }
        }
        await next();
      },
      { tag: 'lockAllResource', after: 'auth', before: 'acl' },
    );
  }

  /**
   * 从数据库加载最近的失败记录到内存
   */
  private async loadRecentRecords(): Promise<void> {
    try {
      const cutoffTime = new Date();
      cutoffTime.setSeconds(cutoffTime.getSeconds() - Math.max(this.config.windowSeconds, this.config.lockSeconds));

      const records = await this.db.getRepository('signInFails').find({
        filter: {
          createdAt: {
            $gt: cutoffTime,
          },
          status: true,
        },
      });

      this.failureRecords.clear();
      records.forEach((record) => {
        const userId = record.get('userId');
        const createdAt = record.get('createdAt');
        const userRecords = this.failureRecords.get(userId) || [];
        userRecords.push({ userId, createdAt });
        this.failureRecords.set(userId, userRecords);
      });

      this.logger.info(`Loaded ${records.length} recent sign-in failure records into cache`);
    } catch (error) {
      this.logger.error('Failed to load recent sign-in failure records:', error);
    }
  }

  /**
   * 获取IP地址的地理位置信息
   * @param ip IP地址
   * @returns 地理位置信息
   */
  private getGeoLocation(ip: string): GeoLocation {
    try {
      if (!ip || ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return { country: 'Local', region: 'Local', city: 'Local' };
      }

      const geo = geoip.lookup(ip);
      if (!geo) {
        return {};
      }

      return {
        country: geo.country,
        region: geo.region,
        city: geo.city,
      };
    } catch (error) {
      this.logger.error(`Failed to get geo location for IP ${ip}:`, error);
      return {};
    }
  }

  /**
   * 记录登录失败
   * @param username 用户名
   */
  public async recordFailedAttempt(user: any, ip: string): Promise<void> {
    try {
      const now = new Date();
      // 如果未启用防护，直接返回
      if (this.config.maxAttempts === 0) {
        await this.recordFailedAttemptToDb(user, ip, now, false);
        return;
      }
      if (user.lock?.expireAt && now > user.lock.expireAt) {
        //超时重置
        await this.resetFailedAttempts(user.id);
      } else if (this.getRecentFailureCount(user.id) + 1 >= this.config.maxAttempts) {
        if (!user.lock?.expireAt || now > user.lock.expireAt) {
          const lockExpireAt = new Date(now);
          lockExpireAt.setSeconds(lockExpireAt.getSeconds() + this.config.lockSeconds);
          await this.db.sequelize.transaction(async (transaction) => {
            const existOne = await this.db.getRepository('userLocks').findOne({
              filter: {
                userId: user.id,
              },
              transaction,
            });
            if (existOne) {
              await existOne.update(
                {
                  expireAt: lockExpireAt,
                },
                {
                  transaction,
                },
              );
            } else {
              await this.db.getRepository('userLocks').create({
                values: {
                  userId: user.id,
                  expireAt: lockExpireAt,
                },
                transaction,
              });
            }
          });
          // 更新锁定用户缓存
          await this.app.cache.set(
            this.getUserLockCacheKey(user.id),
            {
              id: user.id,
              expireAt: lockExpireAt,
              lastChecked: now,
            },
            this.CACHE_TTL,
          );
        }
      }

      const record = await this.recordFailedAttemptToDb(user, ip, now, true);

      if (this.failureRecords.get(user.id)) {
        this.failureRecords.get(user.id).push({
          userId: user.id,
          createdAt: record.get('createdAt'),
        });
      } else {
        this.failureRecords.set(user.id, [
          {
            userId: user.id,
            createdAt: record.get('createdAt'),
          },
        ]);
      }
    } catch (error) {
      this.logger.error('Failed to record sign-in failure:', error);
      throw error;
    }
  }

  private async recordFailedAttemptToDb(user: any, ip: string, now: Date, recordUser = false): Promise<any> {
    // 获取地理位置信息
    let geoLocation: GeoLocation = {};
    if (ip) {
      geoLocation = this.getGeoLocation(ip);
    }
    const address = `${geoLocation.country || ''} ${geoLocation.region || ''} ${geoLocation.city || ''}`.trim();
    return this.db.getRepository('signInFails').create({
      values: {
        userId: user.id,
        status: recordUser,
        ip,
        address,
        createdAt: now,
      },
    });
  }

  /**
   * 获取最近的失败次数（从内存缓存中获取）
   */
  private getRecentFailureCount(userId: number): number {
    // 如果未启用防护，返回0
    if (this.config.maxAttempts === 0) {
      return 0;
    }

    const userRecords = this.failureRecords.get(userId) || [];
    const windowStart = new Date();
    windowStart.setSeconds(windowStart.getSeconds() - this.config.windowSeconds);
    return userRecords.filter((record) => record.createdAt > windowStart).length;
  }

  /**
   * 重置用户的失败记录
   * @param username 用户名
   */
  public async resetFailedAttempts(userId: number): Promise<void> {
    // 如果未启用防护，直接返回
    if (this.config.maxAttempts === 0) {
      return;
    }

    try {
      await this.db.getRepository('userLocks').destroy({
        filter: {
          userId,
        },
      });

      this.logger.info(`Reset sign-in failure records for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to reset sign-in failure records for user ${userId}:`, error);
      throw error;
    }
  }
}
