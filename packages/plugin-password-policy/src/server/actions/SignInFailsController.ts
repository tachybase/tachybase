import { Context, Next } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

@Controller('signInFails')
export class SignInFailsController {
  @Action('list')
  async list(ctx: Context, next: Next) {
    const { pageSize = 20, page = 1, sort = ['-createdAt'], filter = {} } = ctx.action.params;

    try {
      const repo = ctx.db.getRepository('signInFails');

      // 处理用户名和昵称筛选
      if (filter.username || filter.nickname) {
        // 创建一个用户筛选条件
        const userFilter = {};

        if (filter.username) {
          userFilter['username'] = filter.username;
          delete filter.username;
        }

        if (filter.nickname) {
          userFilter['nickname'] = filter.nickname;
          delete filter.nickname;
        }

        // 先查询符合条件的用户
        const userRepo = ctx.db.getRepository('users');
        const users = await userRepo.find({
          filter: userFilter,
          fields: ['id'],
        });

        // 将用户ID添加到筛选条件中
        if (users.length > 0) {
          filter.userId = {
            $in: users.map((user) => user.get('id')),
          };
        } else {
          // 如果没有找到匹配的用户，返回空结果
          ctx.body = {
            count: 0,
            rows: [],
            page: Number(page),
            pageSize: Number(pageSize),
            totalPage: 0,
          };
          return next();
        }
      }

      // 计算分页参数
      const limit = Number(pageSize);
      const offset = (Number(page) - 1) * limit;

      // 查询数据
      const [rows, count] = await repo.findAndCount({
        filter,
        appends: ['user'],
        limit,
        offset,
        sort,
      });

      // 返回结果
      ctx.body = {
        count,
        rows,
        page: Number(page),
        pageSize: Number(pageSize),
        totalPage: Math.ceil(count / Number(pageSize)),
      };
    } catch (error) {
      ctx.app.logger.error('Failed to list sign-in fails:', error);
      ctx.throw(500, ctx.t('Failed to load sign-in fails history', { ns: 'plugin-password-policy' }));
    }

    return next();
  }

  @Action('get')
  async get(ctx: Context, next: Next) {
    const { db } = ctx;
    const { filterByTk } = ctx.action.params;

    try {
      const repo = db.getRepository('signInFails');
      const result = await repo.findOne({
        filterByTk,
        appends: ['user'],
      });

      ctx.body = result;
    } catch (error) {
      ctx.app.logger.error('Failed to get sign-in fail record:', error);
      ctx.throw(500, ctx.t('Failed to load sign-in fail record', { ns: 'plugin-password-policy' }));
    }

    return next();
  }
}
