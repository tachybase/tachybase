import { Context } from '@nocobase/actions';
import { QueryTypes } from 'sequelize';
import { RecordPdfService } from '../services/record-pdf-service';
import { SystemSettingService, SqlLoader } from '@hera/plugin-core';
import { Action, Controller, Inject } from '@nocobase/utils';
import { Record } from '../../interfaces/record';
import { Movement } from '../../utils/constants';
import _ from 'lodash';

@Controller('records')
export class RecordPreviewController {
  @Inject(() => SqlLoader)
  private sqlLoader: SqlLoader;

  @Inject(() => SystemSettingService)
  private systemSetting: SystemSettingService;

  @Inject(() => RecordPdfService)
  private recordPdfService: RecordPdfService;

  @Action('group')
  async group(ctx: Context) {
    const filter = ctx.action.params.filter;
    const records = (await ctx.db
      .getRepository('records')
      .find({ filter, appends: ['items', 'items.product', 'items.product.category'], limit: 10 })) as Record[];
    // 模拟计算
    const items = {} as { [key: string]: { name: string; sort: number; out: number; in: number; total: number } };
    records.forEach((record) => {
      record.items.forEach((item) => {
        if (!items[item.product.name]) {
          items[item.product.name] = {
            name: item.product.name,
            sort: item.product.category.sort,
            out: 0,
            in: 0,
            total: 0,
          };
        }
        const count = item.product.category.convertible ? item.count * item.product.ratio : item.count;
        if (record.movement === Movement.in) {
          items[item.product.name].in += count;
          items[item.product.name].total += count;
        } else {
          items[item.product.name].out += count;
          items[item.product.name].total -= count;
        }
      });
    });
    ctx.body = _.toArray(items)
      .sort((a, b) => a.sort - b.sort)
      .map((item) => ({
        label: item.name,
        value: {
          labels: ['出库数量', '入库数量', '小计'],
          values: [item.out, item.in, item.total],
        },
      }));
  }

  @Action('pdf')
  async printPreview(ctx: Context) {
    const {
      params: { recordId, isDouble, settingType, margingTop },
    } = ctx.action;
    // 拉侧面文字说明
    const pdfExplain = await ctx.db.getRepository('basic_configuration').find();
    // 租金数据
    const leaseData = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record_lease'], {
      replacements: {
        recordId,
      },
      type: QueryTypes.SELECT,
    });
    // 记录单数据
    const records = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record'], {
      replacements: {
        recordId,
      },
      type: QueryTypes.SELECT,
    });
    const record = records[0] as any;
    // 拉标题
    const systemSetting = await this.systemSetting.get();
    record.systemTitle = systemSetting?.title || '异常数据，请联系相关负责人！';
    const user = await ctx.db.getRepository('users').findOne({ filter: { id: record.createdById } });
    record.nickname = user?.nickname || '';
    record.userPhone = user?.phone || '';
    record.pdfExplain = pdfExplain[0]?.out_of_storage_explain;
    if (Number(margingTop)) {
      record.margingTop = Number(margingTop);
    } else {
      // 查询当前用户信息
      const currentUser = await ctx.db.getRepository('users').findOne({ filter: { id: ctx.state.currentUser.id } });
      record.margingTop = Number(currentUser?.pdf_top_margin) || 0;
    }

    // 费用数据
    const feeData = await ctx.db.sequelize.query(this.sqlLoader.sqlFiles['pdf_record_fee'], {
      replacements: {
        recordId,
      },
      type: QueryTypes.SELECT,
    });
    // 订单打印选项
    const printSetup =
      settingType === '0' || settingType === '1' || settingType === '2'
        ? settingType
        : pdfExplain[0]?.record_print_setup;
    const double = isDouble === '0' || isDouble === '1' ? isDouble : pdfExplain[0].record_columns;
    ctx.body = await this.recordPdfService.transformPdfV2(record, leaseData, feeData, { isDouble: double, printSetup });
  }
}
