import { Context } from '@nocobase/actions';
import { QueryTypes } from 'sequelize';
import { RecordPdfService } from '../services/record-pdf-service';
import { SystemSettingService, SqlLoader } from '@hera/plugin-core';
import { Action, Controller, Inject } from '@nocobase/utils';

@Controller('records')
export class RecordPreviewController {
  @Inject(() => SqlLoader)
  private sqlLoader: SqlLoader;

  @Inject(() => SystemSettingService)
  private systemSetting: SystemSettingService;

  @Inject(() => RecordPdfService)
  private recordPdfService: RecordPdfService;

  @Action('pdf')
  async printPreview(ctx: Context) {
    const {
      params: { recordId, isDouble, settingType },
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
