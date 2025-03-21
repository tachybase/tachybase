import { Context, Next } from '@tachybase/actions';
import Database, { PasswordField } from '@tachybase/database';
import { Application, Logger } from '@tachybase/server';
import { App, Db, Inject, InjectLog, Service } from '@tachybase/utils';

import { NAMESPACE } from '../../constants';

interface PasswordStrengthConfig {
  minLength: number;
  strengthLevel: number;
  notContainUsername: boolean;
  historyCount: number;
}

@Service()
export class PasswordStrengthService {
  @Db()
  db: Database;

  @App()
  app: Application;

  @InjectLog()
  private logger: Logger;

  private config: PasswordStrengthConfig;

  async load() {
    this.addMiddleware();

    this.app.on('afterStart', async () => {
      // 从配置中读取参数
      const config = await this.db.getRepository('passwordStrengthConfig').findOne();
      await this.refreshConfig(config);
    });

    this.db.on('passwordStrengthConfig.afterSave', async (model) => {
      await this.refreshConfig(model);
    });
  }

  async refreshConfig(config) {
    // 从配置中读取参数
    this.config = {
      minLength: config?.get('minLength'),
      strengthLevel: config?.get('strengthLevel') || 0,
      notContainUsername: config?.get('notContainUsername') || false,
      historyCount: config?.get('historyCount') || 0,
    };

    this.logger.info('Password strength configuration loaded:', this.config);
  }

  addMiddleware() {
    // 拦截用户创建和密码修改操作
    this.app.resourcer.use(
      async (ctx: Context, next: Next) => {
        const { resourceName, actionName } = ctx.action.params;

        // 处理用户创建和更新操作
        if (resourceName === 'users' && (actionName === 'create' || actionName === 'update')) {
          const values = ctx.action.params.values;

          // 如果包含密码字段，进行验证
          if (values && values.password) {
            const username = values.username || (await this.getUsernameById(ctx, values.id));

            // 验证密码强度
            await this.validatePasswordStrength(ctx, values.password, username);

            // 如果是更新操作且配置了历史密码检查
            if (actionName === 'update' && values.id && this.config.historyCount > 0) {
              await this.validatePasswordHistory(ctx, values.password, values.id);
            }
          }
        } else if (resourceName === 'auth' && actionName === 'signUp') {
          const { username, password } = ctx.action.params.values;
          await this.validatePasswordStrength(ctx, password, username);
        } else if (resourceName === 'auth' && actionName === 'changePassword') {
          // 修改密码
          const { newPassword } = ctx.action.params.values;

          // 验证密码强度
          await this.validatePasswordStrength(ctx, newPassword, ctx.state.currentUser?.username);

          // 验证密码历史
          await this.validatePasswordHistory(ctx, newPassword, ctx.state.currentUser?.id);
        }

        await next();

        // 如果是密码更新操作，保存密码历史
        if (
          (resourceName === 'users' && actionName === 'update' && ctx.action.params.values.password) ||
          (resourceName === 'auth' && actionName === 'changePassword')
        ) {
          const userId = ctx.action.params.values.id || ctx.state.currentUser?.id;
          const password = ctx.action.params.values.password || ctx.action.params.values.newPassword;

          if (userId && password && this.config.historyCount > 0) {
            await this.savePasswordHistory(userId, password);
          }
        }
      },
      {
        tag: 'passwordStrengthValidator',
        after: 'acl',
      },
    );
  }

  /**
   * 获取用户名通过ID
   */
  private async getUsernameById(ctx: Context, userId: number): Promise<string | null> {
    if (!userId) return null;

    try {
      const user = await this.db.getRepository('users').findOne({
        filterByTk: userId,
        fields: ['username'],
      });

      return user?.username || null;
    } catch (error) {
      this.logger.error(`Failed to get username for user ${userId}:`, error);
      return null;
    }
  }

  /**
   * 验证密码强度
   */
  public async validatePasswordStrength(ctx: Context, password: string, username?: string): Promise<void> {
    try {
      // 检查密码长度
      if (this.config.minLength && password.length < this.config.minLength) {
        ctx.throw(
          400,
          ctx.t('Password must be at least {{length}} characters long', {
            ns: NAMESPACE,
            length: this.config.minLength,
          }),
        );
      }

      // 检查密码是否包含用户名
      if (this.config.notContainUsername && username && password.toLowerCase().includes(username.toLowerCase())) {
        ctx.throw(400, ctx.t('Password cannot contain username', { ns: NAMESPACE }));
      }
      // 如果未启用强度验证，直接返回
      if (this.config.strengthLevel > 0) {
        // 根据强度级别验证密码
        const hasLowerCase = /[a-z]/.test(password);
        const hasUpperCase = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);
        const hasSymbol = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
        switch (this.config.strengthLevel) {
          case 1: // 必须包含字母和数字
            if (!(hasLowerCase || hasUpperCase) || !hasDigit) {
              ctx.throw(400, ctx.t('Password must contain both letters and numbers', { ns: NAMESPACE }));
            }
            break;
          case 2: // 必须包含字母、数字和符号
            if (!(hasLowerCase || hasUpperCase) || !hasDigit || !hasSymbol) {
              ctx.throw(400, ctx.t('Password must contain letters, numbers, and symbols', { ns: NAMESPACE }));
            }
            break;
          case 3: // 必须包含数字、大写和小写字母
            if (!hasLowerCase || !hasUpperCase || !hasDigit) {
              ctx.throw(
                400,
                ctx.t('Password must contain numbers, uppercase and lowercase letters', { ns: NAMESPACE }),
              );
            }
            break;
          case 4: // 必须包含数字、大写和小写字母、符号
            if (!hasLowerCase || !hasUpperCase || !hasDigit || !hasSymbol) {
              ctx.throw(
                400,
                ctx.t('Password must contain numbers, uppercase and lowercase letters, and symbols', { ns: NAMESPACE }),
              );
            }
            break;
          case 5: // 必须包含以下字符的其中3种：数字、大写字母、小写字母和特殊字符
            const typesCount = [hasLowerCase, hasUpperCase, hasDigit, hasSymbol].filter(Boolean).length;
            if (typesCount < 3) {
              ctx.throw(
                400,
                ctx.t(
                  'Password must contain at least 3 of the following: numbers, uppercase letters, lowercase letters, and symbols',
                  { ns: NAMESPACE },
                ),
              );
            }
            break;
        }
      }
    } catch (error) {
      if (error.status === 400) {
        throw error;
      }
      this.logger.error('Failed to validate password strength:', error);
      ctx.throw(400, ctx.t('Failed to validate password strength', { ns: NAMESPACE }));
    }
  }

  /**
   * 验证密码历史
   */
  private async validatePasswordHistory(ctx: Context, newPassword: string, userId: number): Promise<void> {
    if (this.config.historyCount <= 0) {
      return;
    }

    try {
      // 获取用户历史密码
      const passwordHistoryRepo = this.db.getRepository('passwordHistory');
      const historyRecords = await passwordHistoryRepo.find({
        filter: {
          userId,
        },
        sort: ['-createdAt'],
        limit: this.config.historyCount,
      });

      if (historyRecords.length === 0) {
        return;
      }

      // 验证新密码是否与历史密码重复
      const field = passwordHistoryRepo.collection.getField<PasswordField>('password');

      for (const record of historyRecords) {
        const historyPassword = record.get('password');
        const isMatch = await field.verify(newPassword, historyPassword);

        if (isMatch) {
          ctx.throw(
            400,
            ctx.t('Password has been used recently. Please choose a different password.', { ns: NAMESPACE }),
          );
        }
      }
    } catch (error) {
      if (error.status === 400) {
        throw error;
      }
      this.logger.error(`Failed to validate password history for user ${userId}:`, error);
      ctx.throw(400, ctx.t('Failed to validate password history', { ns: NAMESPACE }));
    }
  }

  /**
   * 保存密码历史
   */
  private async savePasswordHistory(userId: number, password: string): Promise<void> {
    if (this.config.historyCount <= 0) {
      return;
    }

    try {
      const passwordHistoryRepo = this.db.getRepository('passwordHistory');

      // 创建新的历史记录
      await passwordHistoryRepo.create({
        values: {
          userId,
          password,
        },
      });

      // 获取当前历史记录数量
      const count = await passwordHistoryRepo.count({
        filter: {
          userId,
        },
      });

      // 如果超过限制，删除最旧的记录
      if (count > this.config.historyCount) {
        const oldestRecords = await passwordHistoryRepo.find({
          filter: {
            userId,
          },
          sort: ['createdAt'],
          limit: count - this.config.historyCount,
        });

        if (oldestRecords.length > 0) {
          await passwordHistoryRepo.destroy({
            filter: {
              id: {
                $in: oldestRecords.map((record) => record.get('id')),
              },
            },
          });
        }
      }

      this.logger.info(`Saved password history for user ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to save password history for user ${userId}:`, error);
    }
  }
}
