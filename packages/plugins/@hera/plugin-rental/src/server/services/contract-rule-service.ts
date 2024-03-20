import Database, { CreateOptions, MagicAttributeModel } from '@nocobase/database';
import { Db, Service } from '@nocobase/utils';

@Service()
export class ContractRuleService {
  @Db()
  private db: Database;

  async load() {
    // 合同方案规则重复校验
    this.db.on('contract_plans.beforeSave', this.contractPlansBeforeSave.bind(this));
    // beforeSave无法获取多对多关联关系的数据
    this.db.on('contract_plan_lease_items.beforeCreate', this.contractPlanLeaseItemsBeforeSave.bind(this));
    this.db.on('contract_plan_lease_items.beforeUpdate', this.contractPlanLeaseItemsBeforeSave.bind(this));
    this.db.on('contract_plan_fee_items.beforeCreate', this.contractPlanFeeItemsBeforeSave.bind(this));
    this.db.on('contract_plan_fee_items.beforeUpdate', this.contractPlanFeeItemsBeforeSave.bind(this));
  }

  /**
   * 合同规则创建before seqlizeHooks事件
   * @param model
   * @param options
   * @returns
   */
  async contractPlansBeforeSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!options.values) return;
    const leaseData = options.values.lease_items.map((item) => item.products).flat();
    const repeatData = this.repeatQuery(leaseData);
    if (repeatData.length > 0) {
      const products = repeatData.map((item) => item.label).join(',');
      throw new Error('租金规则中的产品重复！重复产品：' + products);
    }
    const feeData = options.values.fee_items.map((fee) => fee.fee_product);
    const feeRepeatData = this.repeatQuery(feeData);
    if (feeRepeatData.length > 0) {
      const products = feeRepeatData.map((item) => item.label).join(',');
      throw new Error('费用规则中的产品重复！重复费用：' + products);
    }
    const productFeeRepeatData = [];
    for (const index in options.values.lease_items) {
      const fees = options.values.lease_items[index].fee_items?.filter(Boolean);
      if (!fees) return;
      // 租金，费用，租金费用使用同一判断重复方法，需要处理一下租金费用数据结构
      const transFee = fees.map((item) => {
        if (Object.keys(item).length > 0 && item.fee_product) {
          return { ...item, id: item.fee_product.id, raw_category_id: item.fee_product.id };
        }
      });
      const data = this.repeatQuery(transFee);
      if (data.length > 0) {
        productFeeRepeatData.push({ index, value: data.map((item) => item.fee_product.label).join(',') });
      }
    }
    if (productFeeRepeatData.length > 0) {
      const tips = [];
      for (const iterator of productFeeRepeatData) {
        const tip = `第${Number(iterator.index) + 1}条租金数据中费用重复添加`;
        tips.push(tip);
      }
      throw new Error(tips.join('，'));
    }
  }

  /**
   * 租金单条规则创建before seqlizeHooks事件
   * @param model
   * @param options
   * @returns
   */
  async contractPlanLeaseItemsBeforeSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!options.values?.contract_plan && !options.values?.products) return;
    const plan = await this.db.getRepository('contract_plans').findOne({
      where: {
        id: options.values.contract_plan.id,
      },
      appends: ['lease_items', 'lease_items.products'],
    });
    const add = options.values.products;
    const productData = plan.lease_items.map((item) => item.products).flat();
    productData.forEach((item) => {
      const isHas = add.find((p) => p.raw_category_id === item.raw_category_id);
      if (isHas) {
        throw new Error('方案中存在此产品');
      }
    });
  }

  /**
   * 费用规则创建before seqlizeHooks事件
   * @param model
   * @param options
   * @returns
   */
  async contractPlanFeeItemsBeforeSave(model: MagicAttributeModel, options: CreateOptions): Promise<void> {
    if (!options.values?.contract_plan || !options.values?.fee_product) return;
    const plan = await this.db.getRepository('contract_plans').findOne({
      where: {
        id: options.values.contract_plan.id,
      },
      appends: ['lease_items', 'lease_items.products', 'fee_items', 'fee_items.fee_product'],
    });
    if (options.values.lease_product) {
      // 待页面完成确定入参数格式后
      // const feeProduct = plan.fee_items.filter((item) => item.lease_item_id === options.values.lease_product.id // 确定options.values.lease_product是否为数组格式)
    } else {
      const add = options.values.fee_product;
      const feeData = plan.fee_items.filter((item) => !item.lease_item_id).map((item) => item.fee_product);
      feeData.forEach((item) => {
        const isHas = add.find((p) => p.id === item.id);
        if (isHas) {
          throw new Error('方案中存在此赔偿项');
        }
      });
    }
  }

  /**
   * 租金规则重复查询
   * @param data
   * @returns
   */
  repeatQuery(data: any[]): any[] {
    if (data.filter(Boolean).length > 0) {
      const queryData = data.filter(Boolean);
      if (queryData.length > 0) {
        const arr = [];
        for (let index = 0; index < queryData.length; index++) {
          const repea = queryData.slice(index + 1).filter((item) => {
            if (item) {
              return (
                item.id === queryData[index].id ||
                (item.raw_category_id === queryData[index].raw_category_id &&
                  (item.id > 99999 || queryData[index].id > 99999))
              );
            }
          });
          arr.push(...repea.filter(Boolean));
        }
        return arr;
      } else {
        return [];
      }
    } else {
      return [];
    }
  }
}
