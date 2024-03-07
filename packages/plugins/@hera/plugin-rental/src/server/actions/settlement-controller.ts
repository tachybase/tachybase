import { Context } from '@nocobase/actions';
import { SqlLoader, SystemSettingService } from '@hera/plugin-core';
import { Inject, Action, Controller, Db } from '@nocobase/utils';
import { renderIt } from '../pdf-documents/settlements-document';
import { SettlementService } from '../services/settlement-service';
import { QueryTypes } from 'sequelize';

@Controller('settlements')
export class SettlementController {
  @Inject(() => SqlLoader)
  private sqlLoader: SqlLoader;

  @Inject(() => SystemSettingService)
  private systemSetting: SystemSettingService;

  @Inject(() => SettlementService)
  private settlmentService: SettlementService;

  @Action('calculate')
  async updateOrderDetails(ctx: Context) {
    const {
      params: { settlementsId },
    } = ctx.action;

    const SQL = this.sqlLoader.sqlFiles['settlement_calc'];
    const settlement = await ctx.db.sequelize.query(SQL, {
      logging: console.log,
      raw: true,
      plain: true,
      replacements: {
        settlementsId,
      },
      type: QueryTypes.SELECT,
    });
    await this.settlmentService.calculate(settlement as any, settlementsId);
  }

  @Action('pdf')
  async recordSettlement(ctx: Context) {
    const {
      params: { settlementsId, type },
    } = ctx.action;
    const systemSetting = await this.systemSetting.get();
    const SQL = this.sqlLoader.sqlFiles['settlement_select'];
    const settlement = await ctx.db.sequelize.query(SQL, {
      logging: console.log,
      raw: true,
      plain: true,
      replacements: {
        settlementsId,
        type,
      },
      type: QueryTypes.SELECT,
    });
    const utcOffset = ctx.get('X-Timezone');
    const { calc, contracts } = await this.settlmentService.settlement(settlement as any, utcOffset);
    const pdf = await renderIt({ calc, contracts, result: systemSetting });
    ctx.body = pdf;
  }

  @Action('excel')
  async recordSettlementExcel(ctx: Context) {
    const {
      params: { settlementsId, type },
    } = ctx.action;
    const systemSetting = await this.systemSetting.get();
    const SQL = this.sqlLoader.sqlFiles['settlement_select'];
    const settlement = await ctx.db.sequelize.query(SQL, {
      logging: console.log,
      raw: true,
      plain: true,
      replacements: {
        settlementsId,
        type,
      },
      type: QueryTypes.SELECT,
    });
    const utcOffset = ctx.get('X-Timezone');
    const { calc, contracts } = await this.settlmentService.settlement(settlement as any, utcOffset);
    const excel = { calc, contracts, result: systemSetting };
    ctx.body = excel;
  }
}
