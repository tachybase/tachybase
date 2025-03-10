import { createContext, Script } from 'node:vm';
import { Context, Next } from '@tachybase/actions';
import Database, { PasswordField } from '@tachybase/database';
import { Application, Logger } from '@tachybase/server';
import { App, Db, Inject, InjectLog, Service } from '@tachybase/utils';

interface SignInFailConfig {
  windowSeconds: number; // 检查时间窗口（秒）
  maxAttempts: number; // 最大失败次数，0表示不启用防护
  blockSeconds: number; // 屏蔽时间（秒）
}

interface FailureRecord {
  userId: number;
  createdAt: Date;
}

@Service()
export class PasswordPolicyService {
  @Db()
  db: Database;

  @App()
  app: Application;

  @InjectLog()
  private logger: Logger;

  private config: SignInFailConfig;

  // 内存缓存，用于存储最近的失败记录
  private failureRecords: Map<number, FailureRecord[]> = new Map();

  async load() {
    this.addMiddleWare();

    this.app.on('afterStart', async () => {
      // 从配置中读取参数
      const config = await this.db.getRepository('passwordPolicyConfig').findOne();
      await this.refreshConfig(config);
    });
  }

  async refreshConfig(config) {
    // 从配置中读取参数
    this.config = {
      windowSeconds: config?.get('windowSeconds') || 300, // 默认5分钟
      maxAttempts: config?.get('maxAttempts') ?? 0, // 默认0，表示不启用防护
      blockSeconds: config?.get('blockSeconds') || 1800, // 默认30分钟
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
          if (!account) {
            // TODO: 验证其他登录方式是否可用
            return next();
          }
          if (account && password) {
            const filter = email
              ? { email }
              : {
                  $or: [{ username: account }, { email: account }],
                };
            const userRepository = ctx.db.getRepository('users');
            const user = await userRepository.findOne({
              attributes: ['id', 'blockExpireAt'],
              filter,
            });
            if (user) {
              if (user.blockExpireAt && user.blockExpireAt > new Date()) {
                ctx.throw(400, ctx.t('User has been locked', { ns: 'password-policy' }));
              }
              // 抽一下通用的,或者用其他方式
              const field = userRepository.collection.getField<PasswordField>('password');
              const valid = await field.verify(password, user.password);
              if (!valid) {
                // 失败则需要记录
                await this.recordFailedAttempt(user);
              } else {
                // 成功后重置
                await this.resetFailedAttempts(user.id);
              }
            }
          }
        }
        return next();
      },
      {
        tag: 'blockUserByPasswordPolicy',
        before: 'auth',
      },
    );
  }

  /**
   * 从数据库加载最近的失败记录到内存
   */
  private async loadRecentRecords(): Promise<void> {
    try {
      const cutoffTime = new Date();
      cutoffTime.setSeconds(cutoffTime.getSeconds() - Math.max(this.config.windowSeconds, this.config.blockSeconds));

      const records = await this.db.getRepository('signInFails').find({
        filter: {
          createdAt: {
            $gt: cutoffTime,
          },
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
   * 记录登录失败
   * @param username 用户名
   */
  public async recordFailedAttempt(user: any): Promise<void> {
    // 如果未启用防护，直接返回
    if (this.config.maxAttempts === 0) {
      return;
    }

    try {
      const now = new Date();

      if (this.getRecentFailureCount(user.id) + 1 >= this.config.maxAttempts) {
        if (!user.blockExpireAt || now > user.blockExpireAt) {
          const blockExpireAt = new Date(now);
          blockExpireAt.setSeconds(blockExpireAt.getSeconds() + this.config.blockSeconds);
          await this.db.getRepository('users').update({
            filterByTk: user.id,
            values: {
              blockExpireAt,
            },
          });
        }
      } else if (user.blockExpireAt && now > user.blockExpireAt) {
        await this.db.getRepository('users').update({
          filterByTk: user.id,
          values: {
            blockExpireAt: null,
            signInFails: [],
          },
        });
      }

      const record = await this.db.getRepository('signInFails').create({
        values: {
          userId: user.id,
          createdAt: now,
        },
      });

      // 更新内存缓存
      const userRecords = this.failureRecords.get(user.id) || [];
      userRecords.push({
        userId: user.id,
        createdAt: record.get('createdAt'),
      });
      this.failureRecords.set(user.id, userRecords);
    } catch (error) {
      this.logger.error('Failed to record sign-in failure:', error);
      throw error;
    }
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
      await this.db.getRepository('users').update({
        filterByTk: userId,
        values: {
          blockExpireAt: null,
          signInFails: [],
        },
      });

      // 从内存缓存中删除记录
      this.failureRecords.delete(userId);
      this.logger.info(`Reset sign-in failure records for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to reset sign-in failure records for user ${userId}:`, error);
      throw error;
    }
  }
}
