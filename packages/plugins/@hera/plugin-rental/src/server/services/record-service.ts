import Database, { CreateOptions, MagicAttributeModel, Transaction } from '@nocobase/database';
import { Db, Service } from '@nocobase/utils';
import { ConversionLogics, Movement, RecordCategory, RecordTypes, settlementStatus } from '../../utils/constants';
import validateLicensePlate from '../../utils/validateLIcensePlate';

@Service()
export class RecordService {
  @Db()
  private db: Database;
  // 订单hooks调整
  // 1.盘点单在hook中生成
  // 2.合同结算单的状态       √
  // 3.购销合同订单的金额
  // 4.车牌号校验            √
  async load() {
    this.db.on('records.afterSave', this.recordsAfterSave.bind(this));
  }

  /**
   * 订单afterSave hooks
   * @param model
   * @param options
   */
  async recordsAfterSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    // 运输单导致的订单更新不必走以下订单逻辑，减少性能消耗，有waybill一定是运输单录入
    if (options.values?.waybill) return;
    // 订单发生变化时更新对应结算单的状态（需要重新计算）
    await this._updateSettlementStatus(model, options);
    // 车牌号校验
    await this._checkPlateNumber(model, options);
  }
  /**
   * 更新订单对应的结算表状态
   */
  async _updateSettlementStatus(record: MagicAttributeModel, options: CreateOptions) {
    const { values, transaction, context } = options;
    if (!values) return;
    // 触发打印更新次数跳过
    if (Object.keys(values).length === 1 && values?.print_count) return;
    if (values?.category === RecordCategory.lease && values.contract) {
      const dateObject = values.date;
      // 结束时间添加一天，新系统选择时间都是以当天0点开始，但是导入的数据存在不是以0点开始比如2023-12-21:03.000……，提醒结算单的时间可能为2023-12-21:00.000……
      const settlement = await this.db.sequelize.query(
        `SELECT * FROM settlements WHERE contract_id = ${values.contract.id} AND start_date <= '${dateObject}' AND end_date >= (TIMESTAMP '${dateObject}' - INTERVAL '1 day')`,
      );
      const settlementData: any = settlement[0];
      if (settlementData.length) {
        for (const item of settlementData) {
          const settlement_id = item.id;
          await this.db.getModel('settlements').update(
            {
              status: settlementStatus.needReCompute,
            },
            {
              where: {
                id: settlement_id,
              },
              transaction,
            },
          );
        }
      }
    }
  }
  /**
   * 校验车牌号
   */
  async _checkPlateNumber(record: MagicAttributeModel, options: CreateOptions) {
    const { transaction, context } = options;
    if (record.dataValues?.vehicles) {
      const ids = record.dataValues.vehicles.filter((item) => typeof item === 'number').join(',');
      const vehicles = await this.db.sequelize.query(`select * from vehicles where id in (${ids})`, {
        transaction,
      });
      if (vehicles[0].length) {
        vehicles[0].forEach((item: any) => {
          if (item.number) {
            const validate = validateLicensePlate(item.number);
            if (!validate) {
              throw new Error('车牌号格式错误');
            }
          }
        });
      }
    }
  }
}
