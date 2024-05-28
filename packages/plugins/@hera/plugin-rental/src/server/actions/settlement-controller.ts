import { Context } from '@tachybase/actions';
import { Cache } from '@tachybase/cache';
import { Action, Controller, Db, Inject } from '@tachybase/utils';

import { SqlLoader, SystemSettingService } from '@hera/plugin-core';
import { stringify } from 'flatted';
import getStream from 'get-stream';
import { QueryTypes } from 'sequelize';

import { renderIt } from '../pdf-documents/settlements-document';
import { SettlementService } from '../services/settlement-service';

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

    const cache = ctx.app.cacheManager.getCache('@hera/plugin-rental') as Cache;
    const key = stringify({ calc, contracts, result: systemSetting });

    const result = await cache.get(key);
    if (result) {
      if (Buffer.isBuffer(result)) {
        ctx.body = result;
      } else {
        ctx.body = Buffer.from(result.data);
      }
    } else {
      const buf = await getStream.buffer(
        // @ts-ignore
        await renderIt({ calc, contracts, result: systemSetting }),
      );
      ctx.body = buf;
      await cache.set(key, buf);
    }
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
