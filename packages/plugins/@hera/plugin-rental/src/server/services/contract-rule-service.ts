import Database, { CreateOptions, MagicAttributeModel } from '@nocobase/database';
import { Db, Service } from '@nocobase/utils';
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

  /**
   * 合同规则创建before seqlizeHooks事件
   * @param model
   * @param options
   * @returns
   */
  async contractPlansBeforeSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!options.values) return;
    const leaseData2 = options.values.lease_items.map((item) => item.new_products);
    const repeatData = this.repeatQuery(leaseData2);
    if (repeatData.length > 0) {
      throw new Error('租金规则中的产品重复！');
    }
    // const feeData = options.values.fee_items.map((fee) => fee.new_fee_products);
    // const feeRepeatData = this.repeatQuery(feeData);
    // if (feeRepeatData.length > 0) {
    //   throw new Error('费用规则中的产品重复！重复费用：');
    // }
    // const productFeeRepeatData = [];
    // for (const index in options.values.lease_items) {
    //   const fees = options.values.lease_items[index].fee_items?.filter(Boolean);
    //   if (!fees) return;
    //   // 租金，费用，租金费用使用同一判断重复方法，需要处理一下租金费用数据结构
    //   const transFee = fees.map((item) => {
    //     if (Object.keys(item).length > 0 && item.new_fee_products) {
    //       return { ...item, id: item.new_fee_products.id, raw_category_id: item.new_fee_products.id };
    //     }
    //   });
    //   const data = this.repeatQuery(transFee);
    //   if (data.length > 0) {
    //     productFeeRepeatData.push({ index, value: data.map((item) => item.new_fee_products.label).join(',') });
    //   }
    // }
    // if (productFeeRepeatData.length > 0) {
    //   const tips = [];
    //   for (const iterator of productFeeRepeatData) {
    //     const tip = `第${Number(iterator.index) + 1}条租金数据中费用重复添加`;
    //     tips.push(tip);
    //   }
    //   throw new Error(tips.join('，'));
    // }
  }

  repeatQuery(data: any[]): any[] {
    const repea = [];
    data.reduce((acc, curr) => {
      const found = acc.find((subArr) => subArr.length === curr.length);
      if (found) {
        repea.push(curr);
      } else {
        acc.push(curr);
      }
      return acc;
    }, []);
    return repea;
  }
}
