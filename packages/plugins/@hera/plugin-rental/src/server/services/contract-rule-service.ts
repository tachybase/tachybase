import Database, { CreateOptions, MagicAttributeModel } from '@tachybase/database';
import { Db, Service } from '@tachybase/utils';
import { Op } from 'sequelize';
@Service()
export class ContractRuleService {
  @Db()
  private db: Database;
  // 合同重复项需要重新是实现
  async load() {
    // 合同方案规则重复校验
    this.db.on('contract_plan_lease_items.beforeSave', this.leaseItemBeforeSave.bind(this));
    // 上表最底表的hooks不会作用到合同方案整体的重复判断，所以需要contract_plan的hooks
    this.db.on('contract_plans.beforeSave', this.contractPlansBeforeSave.bind(this));
  }

  async leaseItemBeforeSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!options.values) return;
    // 只适用单个表数据修改
    if (options.values.contract_plan?.id && options.values.new_products?.id) {
      const where = {
        contract_plan_id: options.values.contract_plan.id,
        new_products_id: options.values.new_products.id,
      };
      if (!model.isNewRecord) {
        where['id'] = {
          [Op.ne]: model.id,
        };
      }
      const data = await this.db.getRepository('contract_plan_lease_items').findOne({
        where,
      });
      if (data) {
        throw new Error('租金存在');
      }
    }
  }

  /**
   * 合同规则创建before seqlizeHooks事件
   * @param model
   * @param options
   * @returns
   */
  async contractPlansBeforeSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!options.values) return;
    const leaseData = options.values.lease_items.map((item) => item.new_products);
    const repeatData = this.repeatQuery(leaseData);
    if (repeatData.length > 0) {
      throw new Error('租金规则中的产品重复！' + repeatData.map((item) => item.name));
    }

    const feeData = options.values.fee_items.map((item) => item.new_fee_products);
    const repeatFeeData = this.repeatQuery(feeData);
    if (repeatFeeData.length > 0) {
      throw new Error('费用规则中的产品重复！' + repeatFeeData.map((item) => item.name));
    }
  }

  repeatQuery(data: any[]): any[] {
    const repea = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        if (data[i].id === data[j].id) {
          repea.push(data[i]);
        }
      }
    }
    return repea;
  }
}
