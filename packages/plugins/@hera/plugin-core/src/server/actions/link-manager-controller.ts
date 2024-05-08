import { Context } from '@tachybase/actions';
import { Action, Controller } from '@tachybase/utils';

@Controller('link-manage')
export class LinkManagerController {
  @Action('get')
  async getLink(ctx: Context, next: () => Promise<any>) {
    const {
      params: { name },
    } = ctx.action;
    const where = {};
    if (name) {
      where['filter'] = {
        name: name,
      };
    }
    const repo = ctx.db.getRepository('linkManage');
    const data = await repo.find(where);
    ctx.body = data;
    return next();
  }

  @Action('set')
  async setLink(ctx: Context, next: () => Promise<any>) {
    const {
      params: { id, link },
    } = ctx.action;
    if (!id) return;
    const repo = ctx.db.getRepository('linkManage');
    await repo.update({
      values: { link: link },
      filter: {
        id: id,
      },
    });
    return next();
  }
  @Action('init')
  async init(ctx: Context, next: () => Promise<any>) {
    const {
      params: { name },
    } = ctx.action;

    const repo = ctx.db.getRepository('linkManage');
    const data = await repo.findOne({
      filter: {
        name: name,
      },
    });
    if (data) return;
    const createData = await repo.create({
      values: {
        name: name,
      },
    });
    ctx.body = createData;
    return next();
  }
}
