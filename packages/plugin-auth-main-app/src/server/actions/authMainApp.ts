import { Context } from '@tachybase/actions';
import { AppSupervisor } from '@tachybase/server';
import { Action, Controller } from '@tachybase/utils';

@Controller('auth-main-app')
export class AuthMainAppController {
  @Action('getMainUser', { acl: 'public' })
  async getMainUser(ctx: Context, next: () => Promise<any>) {
    if (ctx.app.name === 'main') {
      ctx.body = {};
      return next();
    }
    const { token } = ctx.action.params.values;
    // 走主程序换取用户信息
    const mainApp = await AppSupervisor.getInstance().getApp('main');
    try {
      const jwt = mainApp.authManager.jwt;
      const user = await jwt.decode(token);
      const repo = mainApp.db.getRepository('users');
      const userInfo = await repo.findOne({
        fields: ['username', 'nickname', 'phone'],
        filter: {
          id: user.id,
        },
      });
      ctx.body = userInfo;
    } catch (err) {
      ctx.app.logger.erorr(err);
      ctx.body = {};
    }
    return next();
  }

  @Action('getMainToken', { acl: 'public' })
  async getMainToken(ctx: Context, next: () => Promise<any>) {
    if (ctx.app.name === 'main') {
      ctx.body = {};
    }
    const { token } = ctx.action.params.values;
    // 走主程序换取用户信息
    const mainApp = await AppSupervisor.getInstance().getApp('main');

    const jwt = mainApp.authManager.jwt;
    // TODO: 如果报错怎么办
    const jwtUser = await jwt.decode(token);

    // 拥有管理权限
    const multiAppRepo = mainApp.db.getRepository('applications');
    const multiApp = await multiAppRepo.findOne({
      filter: {
        name: ctx.app.name,
        createdById: jwtUser.id,
      },
    });
    if (!multiApp) {
      ctx.throw(403, 'Can not manage this sub app!');
    }

    const repo = ctx.db.getRepository('users');
    const root = await repo.findOne({
      filter: {
        specialRole: 'root',
      },
    });
    const tokenInfo = await mainApp.tokenController.add({ userId: root.id });
    const expiresIn = Math.floor((await mainApp.authManager.tokenController.getConfig()).tokenExpirationTime / 1000);
    const newToken = ctx.app.authManager.jwt.sign(
      {
        userId: root.id,
        temp: true,
        iat: Math.floor(tokenInfo.issuedTime / 1000),
        signInTime: tokenInfo.signInTime,
      },
      {
        jwtid: tokenInfo.jti,
        expiresIn,
      },
    );
    ctx.body = {
      token: newToken,
    };
  }
}
