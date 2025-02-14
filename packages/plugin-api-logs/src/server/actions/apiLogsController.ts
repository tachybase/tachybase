import { Context, Next } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

@Controller('apiLogsConfig')
export class ApiLogsController {
  @Action('tablesync', { acl: 'loggedIn' })
  async tableSync(ctx: Context, next: Next) {
    const apiLogsRepo = ctx.db.getRepository('apiLogsConfig');
    const apiLogsConfigs = await apiLogsRepo.find();
    const collectionsToInsert = [];
    const collections = ctx.db.collections;
    for (const [key, value] of collections) {
      const collectionName = key;
      const collectionTitle = value.options?.title || '';
      const actions = ['create', 'update', 'destroy'];

      // 获取该 collection 在 apiLogsConfigs 中的所有已有 actions
      const existingActions = apiLogsConfigs
        .filter((data) => data.resourceName === collectionName)
        .map((data) => data.action);

      // 遍历所有 action，判断是否已存在该 action
      actions.forEach((action) => {
        if (!existingActions.includes(action)) {
          // 如果此 action 不在 existingActions 中，则插入
          collectionsToInsert.push({
            resourceName: collectionName,
            title: collectionTitle,
            action: action,
            apiConfig: false,
          });
        }
      });
    }
    console.log('%c Line:29 🍇 collectionsToInsert', 'color:#3f7cff', collectionsToInsert);
    if (!collectionsToInsert.length) {
      return;
    }
    try {
      await apiLogsRepo.createMany({ records: collectionsToInsert });
    } catch (error) {
      ctx.throw(error?.response?.data?.error?.message || 'request error');
    }
    await next();
  }
}
