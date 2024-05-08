import { Context } from '@tachybase/actions';
import { SqlLoader, SystemSettingService } from '@hera/plugin-core';
import { Inject, Action, Controller, Db } from '@tachybase/utils';
import { renderIt } from '../pdf-documents/settlements-document';
import { SettlementService } from '../services/settlement-service';
import { QueryTypes } from 'sequelize';
import { Cache } from '@tachybase/cache';
import getStream from 'get-stream';
import { stringify } from 'flatted';
import { SettlementProductsService } from '../services/settlement-products-service';

@Controller('settlements')
export class SettlementController {
  @Inject(() => SqlLoader)
  private sqlLoader: SqlLoader;

  @Inject(() => SystemSettingService)
  private systemSetting: SystemSettingService;

  @Inject(() => SettlementService)
  private settlmentService: SettlementService;

  @Inject(() => SettlementProductsService)
  private SettlementProductsService: SettlementProductsService;

  @Action('calculate')
  async updateOrderDetails(ctx: Context) {
    const {
      params: { settlementsId },
    } = ctx.action;
    const products_view = this.sqlLoader.sqlFiles['products_search_rule_special'];
    await ctx.db.sequelize.query(products_view);
    const leaseSql = this.sqlLoader.sqlFiles['settlement_calc_products'];
    const feeSql = this.sqlLoader.sqlFiles['settlement_calc_fee_products'];
    const feeNoProductSql = this.sqlLoader.sqlFiles['settlement_calc_fee_no_products'];
    const recordFeeSql = this.sqlLoader.sqlFiles['settlement_calc_record_fee_products'];
    const settlementLeaseData = await ctx.db.sequelize.query(leaseSql, {
      replacements: {
        settlementsId,
      },
      type: QueryTypes.SELECT,
    });
    const settlementFeeData = await ctx.db.sequelize.query(feeSql, {
      replacements: {
        settlementsId,
      },
      type: QueryTypes.SELECT,
    });
    const settlementFeeNoProductData: any = await ctx.db.sequelize.query(feeNoProductSql, {
      replacements: {
        settlementsId,
      },
      type: QueryTypes.SELECT,
    });
    const settlement = await ctx.db.getRepository('settlements').findOne({
      where: {
        id: settlementsId,
      },
      fields: ['start_date', 'end_date'],
    });
    const settlementRecordFee: any = await ctx.db.sequelize.query(recordFeeSql, {
      replacements: {
        settlementsId,
      },
      type: QueryTypes.SELECT,
    });
    for (const item of settlementFeeNoProductData) {
      if (item.conversion_logic_id > 4) {
        const weightRules = await ctx.db.getRepository('weight_rules').find({
          where: {
            logic_id: item.conversion_logic_id,
          },
          appends: ['new_product'],
        });
        item['weightRules'] = weightRules;
      } else {
        item['weightRules'] = null;
      }
    }
    const settlementAddItems = await ctx.db.getRepository('settlement_add_items').findOne({
      where: {
        add_id: settlementsId,
      },
    });
    const settlementAbout = {
      settlementLeaseData,
      settlementFeeData,
      settlementFeeNoProductData,
      settlementRecordFee,
      settlementAddItems,
      start_date: settlement.start_date,
      end_date: settlement.end_date,
    };
    await this.SettlementProductsService.calculate(settlementAbout as any, settlementsId);
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
