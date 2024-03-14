import { Context } from '@nocobase/actions';
import { renderWaybill } from '../pdf-documents/waybills-document';
import { SqlLoader } from '@hera/plugin-core';
import { Action, Controller, Inject } from '@nocobase/utils';
import { QueryTypes } from 'sequelize';
import { Waybill } from '../../interfaces/waybill';

@Controller('waybills')
export class WaybillsController {
  @Inject(() => SqlLoader)
  private sqlLoader: SqlLoader;

  @Action('pdf')
  async printPreview(ctx: Context) {
    const {
      params: { recordId, margingTop },
    } = ctx.action;
    if (recordId === 'undefined' || recordId === undefined) {
      ctx.body = await renderWaybill(null);
      return;
    }
    const waybills = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_waybills'], {
      replacements: {
        recordId: recordId,
      },
      type: QueryTypes.SELECT,
    });
    const settings = {};
    if (Number(margingTop)) {
      settings['margingTop'] = Number(margingTop);
    } else {
      const currentUser = await ctx.db.getRepository('users').findOne({ filter: { id: ctx.state.currentUser.id } });
      settings['margingTop'] = Number(currentUser?.pdf_top_margin) || 0;
    }
    ctx.body = await renderWaybill(waybills[0] as Waybill, settings);
  }
}
