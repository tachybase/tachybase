import { Db, Service } from '@nocobase/utils';
import Database from '@nocobase/database';
import dayjs from 'dayjs';
import {
  AddItemsCategory,
  CalcDateType,
  ConversionLogics,
  Itemcategory,
  RulesNumber,
  countCource,
} from '../../utils/constants';
import { converDate } from '../../utils/daysUtils';
import { converUnitCount } from '../../utils/unitUtils';
import { Settlement } from '../../interfaces/settlement';
import { FeeRule, LeaseRule } from '../../interfaces/rule';
import { Record } from '../../interfaces/record';
import { RecordItems } from '../../interfaces/records';
import { formatQuantity } from '../../utils/currencyUtils';

@Service()
export class SettlementService {
  @Db()
  private db: Database;

  async calculate(settlementAbout: Settlement, settlementsId) {
    /**
     * 租金计算方式
     * 0: 计头不计尾
     * 1. 计尾不计头
     * 2. 计头又计尾
     * 3. 不计头不计尾
     */
    let createLeasDatas = [];
    let createFeesDatas = [];
    settlementAbout.contracts.rule_items?.forEach((ruleItem) => {
      if (
        dayjs(settlementAbout.start_date).isSameOrAfter(ruleItem.start_date, 'day') &&
        dayjs(settlementAbout.end_date).isSameOrBefore(ruleItem.end_date, 'day')
      ) {
        // lease_rules 租金规则[]
        const lease_rules = ruleItem?.rule.lease_items;
        // fee_rules 费用明细
        const fee_rules = ruleItem?.rule.fee_item;
        // 处理原始数据，适合后续租金数据成
        if (settlementAbout.records === null) {
          settlementAbout.records = [];
        }

        // 正常租赁数据
        lease_rules?.forEach((rule) => {
          if (rule) {
            if (rule.products.length) {
              rule.products.forEach((productRule) => {
                const productCategory = productRule.product_id > RulesNumber ? 'category' : 'product';
                settlementAbout.records.forEach((item) => {
                  //计算正常租赁订单
                  if (rule.conversion_logic_id === ConversionLogics.ActualWeight) {
                    if (item.weight_items.length) {
                      item.weight_items?.forEach((recordItem) => {
                        if (recordItem) {
                          if (
                            productRule.product_id > RulesNumber &&
                            productRule.product_id - RulesNumber === recordItem.product_category_id
                          ) {
                            const productName = item.record_items.filter(
                              (value) => value.product.product_category.id === recordItem.product_category_id,
                            )[0].product;
                            const day =
                              dayjsDays(item.date) < dayjsDays(settlementAbout.start_date)
                                ? getCalcDays(settlementAbout.start_date, settlementAbout.end_date)
                                : afterDays(
                                    settlementAbout.contracts.calc_type,
                                    item.movement,
                                    item.date,
                                    settlementAbout.end_date,
                                  );
                            const movement = item.movement === '-1' ? '1' : '-1';
                            createLeasDatas.push({
                              settlement_id: settlementsId, //合同ID
                              movement: item.movement, //出入库状态
                              date: item.date, //时间
                              name: productName.name, //名称
                              label: productName.label, //规格
                              category: item.category, //费用类别
                              //租赁天数  历史订单就存开始日期到结束日期  当前订单存储订单日期到结束日期
                              days: day,
                              is_excluded: false,
                              count: recordItem.weight * Number(movement),
                              unit_price: rule.unit_price * 1000,
                              amount: recordItem.weight * (rule.unit_price * 1000) * day,
                              unit_name: '吨',
                              productCategory,
                            });
                          }
                        }
                      });
                    } else {
                      const recordItem = item.record_items.find((itemValue) => {
                        return (
                          (productRule.product_id > RulesNumber &&
                            productRule.product_id - RulesNumber === itemValue?.product.category_id) ||
                          productRule.product_id === itemValue?.product.id
                        );
                      });
                      if (recordItem) {
                        const day =
                          dayjsDays(item.date) < dayjsDays(settlementAbout.start_date)
                            ? getCalcDays(settlementAbout.start_date, settlementAbout.end_date)
                            : afterDays(
                                settlementAbout.contracts.calc_type,
                                item.movement,
                                item.date,
                                settlementAbout.end_date,
                              );
                        const movement = item.movement === '-1' ? '1' : '-1';
                        createLeasDatas.push({
                          settlement_id: settlementsId, //合同ID
                          movement: item.movement, //出入库状态
                          date: item.date, //时间
                          name: recordItem?.product.name, //名称
                          label: recordItem?.product.name, //规格
                          category: item.category, //费用类别
                          //租赁天数  历史订单就存开始日期到结束日期  当前订单存储订单日期到结束日期
                          days: day,
                          is_excluded: false,
                          count: item.weight * Number(movement),
                          unit_price: rule.unit_price * 1000,
                          amount: item.weight * (rule.unit_price * 1000) * day,
                          unit_name: '吨',
                          productCategory,
                        });
                      }
                    }
                  } else {
                    item.record_items?.forEach((recordItem) => {
                      if (recordItem) {
                        if (
                          (productRule.product_id > RulesNumber &&
                            productRule.product_id - RulesNumber === recordItem.product.category_id) ||
                          productRule.product_id === recordItem.product.id
                        ) {
                          const data = {
                            settlement_id: settlementsId, //合同ID
                            movement: item.movement, //出入库状态
                            date: item.date, //时间
                            name: recordItem.product.name, //名称
                            label: recordItem.product.label, //规格
                            category: item.category, //费用类别
                            //租赁天数  历史订单就存开始日期到结束日期  当前订单存储订单日期到结束日期
                            days:
                              dayjsDays(item.date) < dayjsDays(settlementAbout.start_date)
                                ? getCalcDays(settlementAbout.start_date, settlementAbout.end_date)
                                : afterDays(
                                    settlementAbout.contracts.calc_type,
                                    item.movement,
                                    item.date,
                                    settlementAbout.end_date,
                                  ),
                            is_excluded: false,
                            productCategory,
                          };
                          // 要根据规则计算数量，单价，金额，确定单位
                          const price = rule.unit_price || 0;
                          const movement = item.movement === '-1' ? '1' : '-1';
                          const { count, unit } = ruleCount(rule, item, recordItem);
                          data['unit_name'] = unit;
                          data['count'] = count * Number(movement);
                          data['unit_price'] = price;
                          data['amount'] = data['count'] * price * (data.days || 0);
                          createLeasDatas.push(data);
                        }
                      }
                    });
                  }

                  //计算有关联产品费用订单
                  if (rule.product_fee.length) {
                    if (
                      dayjs(item.date).isBetween(ruleItem.start_date, ruleItem.end_date, 'day', '[]') &&
                      dayjs(item.date).isSameOrAfter(settlementAbout.start_date)
                    ) {
                      rule.product_fee.forEach((rulefee) => {
                        if (rulefee.fee_product_id) {
                          const spec = rulefee.product.spec;
                          const name = rulefee.product.name;
                          if (rulefee.conversion_logic_id === ConversionLogics.ActualWeight) {
                            let data;
                            if (
                              rulefee.count_source === countCource.outProduct ||
                              rulefee.count_source === countCource.outItem
                            ) {
                              if (item.movement === '-1') {
                                data = recordWeight(rule, item, settlementsId, productRule, rulefee);
                                if (data) {
                                  data.movement = '-1';
                                }
                              }
                            } else if (
                              rulefee.count_source === countCource.enterProduct ||
                              rulefee.count_source === countCource.enterItem
                            ) {
                              if (item.movement === '1') {
                                data = recordWeight(rule, item, settlementsId, productRule, rulefee);
                                if (data) {
                                  data.movement = '1';
                                }
                              }
                            } else {
                              data = recordWeight(rule, item, settlementsId, productRule, rulefee);
                              if (data) {
                                data.movement = '0';
                              }
                            }
                            if (data) {
                              createFeesDatas.push({ ...data, productCategory });
                            }
                          } else {
                            item.record_items?.forEach((recordItem) => {
                              if (recordItem) {
                                if (
                                  productRule.product_id - RulesNumber === recordItem.product.category_id ||
                                  recordItem.product_id === productRule.product_id
                                ) {
                                  let productname;
                                  switch (productCategory) {
                                    case 'category':
                                      productname = recordItem.product.name;
                                      break;
                                    case 'product':
                                      productname = recordItem.product.label;
                                      break;
                                  }
                                  //人工录入
                                  if (rulefee.count_source === countCource.artificial) {
                                    if (rulefee.conversion_logic_id !== ConversionLogics.ActualWeight) {
                                      if (recordItem.record_item_fee_items.length) {
                                        recordItem.record_item_fee_items.forEach((value) => {
                                          if (value.product_id === rulefee.fee_product_id) {
                                            const { count, unit } = ruleCount(
                                              rule,
                                              item,
                                              recordItem,
                                              value.count,
                                              rulefee,
                                            );
                                            createFeesDatas.push({
                                              settlement_id: settlementsId,
                                              date: item.date,
                                              name: productname + '-' + spec,
                                              label: recordItem.product.label + '-' + spec,
                                              category: name,
                                              movement: item.movement,
                                              count: count,
                                              unit_price: rulefee.unit_price,
                                              amount: rulefee.unit_price * count,
                                              unit_name: unit,
                                              is_excluded: value.is_excluded,
                                              productCategory,
                                            });
                                          }
                                        });
                                      }
                                    }
                                  } //出库
                                  else if (
                                    rulefee.count_source === countCource.outProduct ||
                                    rulefee.count_source === countCource.outItem
                                  ) {
                                    if (item.movement === '-1') {
                                      const { count, unit } = ruleCount(rule, item, recordItem, '', rulefee);
                                      const recordCount = recordItemsFee(rule, item, recordItem, count, rulefee);
                                      createFeesDatas.push({
                                        settlement_id: settlementsId,
                                        date: item.date,
                                        name: productname + '-' + spec,
                                        label: recordItem.product.label + '-' + spec,
                                        category: name,
                                        movement: '-1',
                                        count: recordCount,
                                        unit_price: rulefee.unit_price,
                                        amount: count * rulefee.unit_price,
                                        unit_name: unit,
                                        is_excluded: false,
                                        productCategory,
                                      });
                                    }
                                  } //入库
                                  else if (
                                    rulefee.count_source === countCource.enterProduct ||
                                    rulefee.count_source === countCource.enterItem
                                  ) {
                                    if (item.movement === '1') {
                                      const { count, unit } = ruleCount(rule, item, recordItem, '', rulefee);
                                      const recordCount = recordItemsFee(rule, item, recordItem, count, rulefee);
                                      createFeesDatas.push({
                                        settlement_id: settlementsId,
                                        date: item.date,
                                        name: productname + '-' + spec,
                                        label: recordItem.product.label + '-' + spec,
                                        category: name,
                                        movement: '1',
                                        count: recordCount,
                                        unit_price: rulefee.unit_price,
                                        amount: count * rulefee.unit_price,
                                        unit_name: unit,
                                        is_excluded: false,
                                        productCategory,
                                      });
                                    }
                                  } //出入库
                                  else if (
                                    rulefee.count_source === countCource.product ||
                                    rulefee.count_source === countCource.item
                                  ) {
                                    const { count, unit } = ruleCount(rule, item, recordItem, '', rulefee);
                                    const recordCount = recordItemsFee(rule, item, recordItem, count, rulefee);
                                    createFeesDatas.push({
                                      settlement_id: settlementsId,
                                      date: item.date,
                                      name: productname + '-' + spec,
                                      label: recordItem.product.label + '-' + spec,
                                      category: name,
                                      movement: '0',
                                      count: recordCount,
                                      unit_price: rule.unit_price,
                                      amount: count * rule.unit_price,
                                      unit_name: unit,
                                      is_excluded: false,
                                      productCategory,
                                    });
                                  }
                                }
                              }
                            });
                          }
                        }
                      });
                    }
                  }
                });
              });
            }
          }
        });

        // 产品产生的费用
        fee_rules?.forEach((rule) => {
          let conversion = false;
          const spec = rule.product.spec;
          const name = rule.product.name;
          const data = {
            settlement_id: settlementsId,
            date: dayjs(settlementAbout.end_date).add(1, 'day').add(-1, 'minute'),
            name: spec,
            label: spec,
            category: name,
            movement: '0',
            count: 0,
            unit_price: rule.unit_price,
            amount: 0,
            unit_name: rule.unit,
            is_excluded: false,
          };
          if (rule.conversion_logic_id === ConversionLogics.ActualWeight) {
            settlementAbout.records.forEach((item) => {
              if (
                dayjs(item.date).isBetween(ruleItem.start_date, ruleItem.end_date, 'day', '[]') &&
                dayjs(item.date).isSameOrAfter(settlementAbout.start_date)
              ) {
                if (rule.count_source === countCource.outProduct || rule.count_source === countCource.outItem) {
                  if (item.movement === '-1') {
                    data.movement = '-1';
                    data.count += item.weight_items.length
                      ? item.weight_items.length
                        ? item.weight_items.reduce((sum, curr) => {
                            return sum + curr.weight;
                          }, 0)
                        : 0
                      : item.weight;
                    if (item.fee_item.length) {
                      item.fee_item.forEach((value) => {
                        if (value.product_id === rule.fee_product_id) {
                          data.count = value.is_excluded ? data.count - value.count : data.count;
                        }
                      });
                    }
                    conversion = true;
                  }
                } else if (
                  rule.count_source === countCource.enterProduct ||
                  rule.count_source === countCource.enterItem
                ) {
                  if (item.movement === '1') {
                    data.movement = '1';
                    data.count += item.weight_items.length
                      ? item.weight_items.length
                        ? item.weight_items.reduce((sum, curr) => {
                            return sum + curr.weight;
                          }, 0)
                        : 0
                      : item.weight;
                    if (item.fee_item.length) {
                      item.fee_item.forEach((value) => {
                        if (value.product_id === rule.fee_product_id) {
                          data.count = value.is_excluded ? data.count - value.count : data.count;
                        }
                      });
                    }
                    conversion = true;
                  }
                } else if (rule.count_source === countCource.product || rule.count_source === countCource.item) {
                  data.count += item.weight_items.length
                    ? item.weight_items.length
                      ? item.weight_items.reduce((sum, curr) => {
                          return sum + curr.weight;
                        }, 0)
                      : 0
                    : item.weight;
                  if (item.fee_item.length) {
                    item.fee_item.forEach((value) => {
                      if (value.product_id === rule.fee_product_id) {
                        data.count = value.is_excluded ? data.count - value.count : data.count;
                      }
                    });
                  }
                  conversion = true;
                }
              }
            });
          } else {
            //人工录入
            if (rule.count_source === countCource.artificial) {
              if (
                rule.conversion_logic_id !== ConversionLogics.Product &&
                rule.conversion_logic_id !== ConversionLogics.ActualWeight &&
                rule.conversion_logic_id !== ConversionLogics.ProductWeight
              ) {
                settlementAbout.records?.forEach((item) => {
                  if (
                    dayjs(item.date).isBetween(ruleItem.start_date, ruleItem.end_date, 'day', '[]') &&
                    dayjs(item.date).isSameOrAfter(settlementAbout.start_date)
                  ) {
                    if (item.fee_item.length) {
                      item.fee_item.forEach((value) => {
                        if (value.product_id === rule.fee_product_id) {
                          data.count = value.is_excluded ? data.count - value.count : data.count + value.count;
                          data.is_excluded = value.is_excluded;
                          conversion = true;
                        }
                      });
                    }
                  }
                });
              }
            } //出库
            else if (rule.count_source === countCource.outProduct || rule.count_source === countCource.outItem) {
              if (
                rule.conversion_logic_id !== ConversionLogics.Keep &&
                rule.conversion_logic_id !== ConversionLogics.Product
              ) {
                settlementAbout.records?.forEach((item) => {
                  if (
                    dayjs(item.date).isBetween(ruleItem.start_date, ruleItem.end_date, 'day', '[]') &&
                    dayjs(item.date).isSameOrAfter(settlementAbout.start_date)
                  ) {
                    if (item.movement === '-1') {
                      item.record_items?.forEach((recordItem) => {
                        if (recordItem) {
                          const { count } = ruleCount(rule, item, recordItem);
                          data.count += count;
                          data.movement = '-1';
                          conversion = true;
                        }
                      });
                      if (item.fee_item.length) {
                        item.fee_item.forEach((value) => {
                          if (value.product_id === rule.fee_product_id) {
                            data.count = value.is_excluded ? data.count - value.count * 1000 : data.count;
                          }
                        });
                      }
                    }
                  }
                });
              }
            } //入库
            else if (rule.count_source === countCource.enterProduct || rule.count_source === countCource.enterItem) {
              if (
                rule.conversion_logic_id !== ConversionLogics.Keep &&
                rule.conversion_logic_id !== ConversionLogics.Product
              ) {
                settlementAbout.records?.forEach((item) => {
                  if (
                    dayjs(item.date).isBetween(ruleItem.start_date, ruleItem.end_date, 'day', '[]') &&
                    dayjs(item.date).isSameOrAfter(settlementAbout.start_date)
                  ) {
                    if (item.movement === '1') {
                      item.record_items?.forEach((recordItem) => {
                        if (recordItem) {
                          const { count } = ruleCount(rule, item, recordItem);
                          data.count += count;
                          data.movement = '1';
                          conversion = true;
                        }
                      });
                      if (item.fee_item.length) {
                        item.fee_item.forEach((value) => {
                          if (value.product_id === rule.fee_product_id) {
                            data.count = value.is_excluded ? data.count - value.count * 1000 : data.count;
                          }
                        });
                      }
                    }
                  }
                });
              }
            } //出入库
            else if (rule.count_source === countCource.product || rule.count_source === countCource.item) {
              if (
                rule.conversion_logic_id !== ConversionLogics.Keep &&
                rule.conversion_logic_id !== ConversionLogics.Product
              ) {
                settlementAbout.records?.forEach((item) => {
                  if (
                    dayjs(item.date).isBetween(ruleItem.start_date, ruleItem.end_date, 'day', '[]') &&
                    dayjs(item.date).isSameOrAfter(settlementAbout.start_date)
                  ) {
                    item.record_items?.forEach((recordItem) => {
                      if (recordItem) {
                        const { count } = ruleCount(rule, item, recordItem);
                        data.count += count;
                        data.movement = '0';
                        conversion = true;
                      }
                    });
                    if (item.fee_item.length) {
                      item.fee_item.forEach((value) => {
                        if (value.product_id === rule.fee_product_id) {
                          data.count = value.is_excluded ? data.count - value.count * 1000 : data.count;
                        }
                      });
                    }
                  }
                });
              }
            }
          }
          if (conversion) {
            if (
              rule.count_source !== countCource.artificial &&
              rule.conversion_logic_id !== ConversionLogics.ActualWeight
            ) {
              data.count = data.count / 1000;
            }
            data.amount = data.count * data.unit_price;
            createFeesDatas.push(data);
          }
        });
      }
    });

    createFeesDatas = createFeesDatas?.filter(Boolean);
    createLeasDatas = createLeasDatas?.filter(Boolean);

    const createCategoryDatasItem = screenData(createLeasDatas, settlementAbout, 'category');
    const createProductDatasItem = screenData(createLeasDatas, settlementAbout, 'product');
    const recordsCategoryFeeItem = feeData(createFeesDatas, settlementAbout, 'category');
    const recordsProductFeeItem = feeData(createFeesDatas, settlementAbout, 'product');
    //本期信息
    let createDatas = [
      ...createCategoryDatasItem.list,
      ...createProductDatasItem.list,
      ...recordsCategoryFeeItem,
      ...recordsProductFeeItem,
    ];
    createDatas.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    createDatas = createDatas.filter((value) => value.count);
    //筛选历史结存
    createCategoryDatasItem.history = createCategoryDatasItem.history?.filter((value) => value.count);
    createProductDatasItem.history = createProductDatasItem.history?.filter((value) => value.count);
    //汇总项信息
    const summaryCategoryItems = [];
    for (const value in createCategoryDatasItem) {
      createCategoryDatasItem[value].forEach((item) => {
        if (!summaryCategoryItems.find((value) => value.name === item.name && item.category === '0')) {
          summaryCategoryItems.push({
            settlement_id: settlementsId,
            name: item.name,
            count: item.count,
            unit_name: item.unit_name,
            type: 'category',
          });
        } else {
          summaryCategoryItems.forEach((value) => {
            if (value.name === item.name) {
              value.count += item.count;
            }
          });
        }
      });
    }
    const summaryProductItems = [];
    for (const value in createProductDatasItem) {
      createProductDatasItem[value].forEach((item) => {
        if (!summaryProductItems.find((value) => value.name === item.name && item.category === '0')) {
          summaryProductItems.push({
            settlement_id: settlementsId,
            name: item.name,
            count: item.count,
            unit_name: item.unit_name,
            type: 'product',
          });
        } else {
          summaryProductItems.forEach((value) => {
            if (value.name === item.name) {
              value.count += item.count;
            }
          });
        }
      });
    }
    const summaryItems = [...summaryCategoryItems, ...summaryProductItems];

    //结算表信息
    const summaryPeriod = {
      rent: 0.0, //租金
      maintenance: 0.0, //维修人工
      n_compensate: 0.0, //无物赔偿
      h_compensate: 0.0, //有物赔偿
      loadfreight: 0.0, //装卸运费
      current_expenses: 0.0, //本期费用
      tax: 0.0, //税率
      accumulate: 0.0, //累计费用
      current_collection: 0.0, //本期收款
      accumulate_collection: 0.0, //累计收款
      status: '2',
    };
    //  结算表费用
    recordsCategoryFeeItem.forEach((value) => {
      switch (value.category) {
        case Itemcategory.maintenance:
          summaryPeriod.maintenance += value.amount;
          break;
        case Itemcategory.n_compensate:
          summaryPeriod.n_compensate += value.amount;
          break;
        case Itemcategory.h_compensate:
          summaryPeriod.h_compensate += value.amount;
          break;
        case Itemcategory.loadFreight:
          summaryPeriod.loadfreight += value.amount;
          break;
      }
    });
    settlementAbout.settlement_add_items.forEach((value) => {
      switch (value.category) {
        case AddItemsCategory.rent:
          summaryPeriod.rent += value.amount;
          break;
        case AddItemsCategory.maintenance:
          summaryPeriod.maintenance += value.amount;
          break;
        case AddItemsCategory.n_compensate:
          summaryPeriod.n_compensate += value.amount;
          break;
        case AddItemsCategory.h_compensate:
          summaryPeriod.h_compensate += value.amount;
          break;
        case AddItemsCategory.loadFreight:
          summaryPeriod.loadfreight += value.amount;
          break;
      }
    });
    summaryPeriod.rent = createCategoryDatasItem.list.reduce((sum, curr) => sum + curr.amount, summaryPeriod.rent);
    summaryPeriod.rent = createCategoryDatasItem.history.reduce((sum, curr) => sum + curr.amount, summaryPeriod.rent);
    summaryPeriod.tax = settlementAbout.contracts.tax_included ? 0 : settlementAbout.contracts.tax_rate;
    summaryPeriod.current_expenses =
      (summaryPeriod.rent +
        summaryPeriod.maintenance +
        summaryPeriod.n_compensate +
        summaryPeriod.h_compensate +
        summaryPeriod.loadfreight) *
      (summaryPeriod.tax + 1);
    const settlement = settlementAbout.settlements?.filter((value) =>
      dayjs(value.end_date).isBefore(settlementAbout.start_date),
    );

    summaryPeriod.accumulate = settlement.length
      ? settlement.reduce((sum, curr) => sum + curr.current_expenses, summaryPeriod.current_expenses)
      : summaryPeriod.current_expenses;
    await this.db.sequelize.query(`delete from settlement_items where settlement_id=${settlementsId}`);
    await this.db.sequelize.query(`delete from settlement_history_items where settlement_id=${settlementsId}`);
    await this.db.sequelize.query(`delete from settlement_summary_items where settlement_id=${settlementsId}`);
    //修改结算表数据
    await this.db.getRepository('settlements').update({
      values: summaryPeriod,
      filter: {
        id: settlementsId,
      },
    });
    await this.db.getModel('settlement_items').bulkCreate(createDatas);
    await this.db.getModel('settlement_history_items').bulkCreate(createCategoryDatasItem.history);
    await this.db.getModel('settlement_history_items').bulkCreate(createProductDatasItem.history);
    await this.db.getModel('settlement_summary_items').bulkCreate(summaryItems);
  }

  async settlement(settlementAbout: Settlement, utcOffset) {
    const calc = {
      start: settlementAbout.start_date, //开始时间
      end: settlementAbout.end_date, //结束时间
      rent: settlementAbout.rent,
      maintenance: settlementAbout.maintenance, //维修人工
      n_compensate: settlementAbout.n_compensate, //无物赔偿
      h_compensate: settlementAbout.h_compensate, //有物赔偿
      loadfreight: settlementAbout.loadfreight, //装卸运费
      current_expenses: settlementAbout.current_expenses, //本期费用
      tax: settlementAbout.tax, //税率
      accumulate: settlementAbout.accumulate, //累计费用
      current_collection: settlementAbout.current_collection, //本期收款
      accumulate_collection: settlementAbout.accumulate_collection, //累计收款
      history: settlementAbout.settlement_history_items, //历史订单
      list: settlementAbout.settlement_items, //当前订单
      addItems: settlementAbout.settlement_add_items, //人工增补项
      summary: settlementAbout.settlement_summary_items, //汇总项
      utcOffset: utcOffset,
    };
    calc.list = calc.list?.filter(Boolean);
    const product = await this.db.getRepository('product').find();
    calc.list.forEach((value) => {
      const filterValue = product.filter((productValue) => {
        const productName = value.category !== '0' ? (value.name as string).split('-')[0] : value.name;
        return (
          productName && (productValue.dataValues.name === productName || productValue.dataValues.label === productName)
        );
      });
      value['productSort'] = filterValue.length ? filterValue[0].dataValues.sort : -1;
    });
    calc.list?.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    let sortProduct = [];
    let settlementDate = '';
    calc.list.forEach((value) => {
      const productDate = converDate(value.date, 'YYYY-MM-DD');
      if (value.category === '0' || value.name.includes('-')) {
        if (productDate === settlementDate) {
          sortProduct.sort((a, b) => {
            return a.productSort - b.productSort;
          });
          sortProduct.forEach((item, index) => {
            item.date = dayjs(`${productDate}  00:${index}:00`);
          });
          value.date = dayjs(sortProduct[sortProduct.length - 1].date).add(1, 'minutes');
          sortProduct.push(value);
        } else {
          settlementDate = productDate;
          sortProduct = [];
          sortProduct.push(value);
        }
      }
    });
    calc.list.forEach((value) => {
      const productDate = converDate(value.date, 'YYYY-MM-DD');
      if ((value.name as string).includes('-')) {
        const name = value.name.split('-')[0];
        const valueItem = calc.list.filter(
          (item) => converDate(item.date, 'YYYY-MM-DD') === productDate && item.name === name,
        )[0];
        if (valueItem) {
          value.date = dayjs(valueItem.date).add(1, 'seconds');
        }
      }
    });
    calc.list?.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    const contracts = settlementAbout.contracts;
    return { calc, contracts };
  }
}

/**
 *  计算订单实际重量
 * @param rule
 * @param item
 * @param settlementsId
 */
const recordWeight = (rule, item, settlementsId, productRule, rulefee?) => {
  const productCategory = productRule.product_id > RulesNumber ? 'category' : 'product';
  const spec = rulefee.product.spec;
  const name = rulefee.product.name;
  if (item.weight_items.length) {
    const itemWeight = item.weight_items.filter(
      (weightItem) =>
        (productRule.product_id > RulesNumber &&
          productRule.product_id - RulesNumber === weightItem.product_category_id) ||
        productRule.product_id === weightItem.product_category_id,
    )[0];
    const productsName = item.record_items?.filter(
      (value) => value.product.category_id === itemWeight.product_category_id,
    )[0].product;
    const productName = productCategory === 'category' ? productsName.name : productsName.label;
    return {
      settlement_id: settlementsId,
      date: item.date,
      name: productName + '-' + spec,
      label: productsName.label + '-' + spec,
      category: rulefee ? name : rule.product.name,
      movement: item.movement,
      count: itemWeight.weight,
      unit_price: rulefee.unit_price,
      amount: itemWeight.weight * rulefee.unit_price,
      unit_name: '吨',
      is_excluded: false,
    };
  } else {
    const isRecordItem = item.record_items.find(
      (itemValue) =>
        (productRule.product_id > RulesNumber &&
          productRule.product_id - RulesNumber === itemValue?.product.category_id) ||
        productRule.product_id === itemValue?.product.category_id,
    );
    if (isRecordItem) {
      let count = item.weight;
      item.record_items.forEach((recordItem) => {
        if (recordItem.record_item_fee_items.length) {
          const recordItemFee = recordItem.record_item_fee_items.filter(
            (value) => value.product_id === rulefee.fee_product_id,
          )[0];
          count = recordItemFee.is_excluded ? count - recordItemFee.count : count;
        }
      });
      const productName = isRecordItem.product.name;
      return {
        settlement_id: settlementsId,
        date: item.date,
        name: productName + '-' + spec,
        label: productName + '-' + spec,
        category: name,
        movement: item.movement,
        count: count,
        unit_price: rulefee.unit_price,
        amount: item.weight * rulefee.unit_price,
        unit_name: '吨',
        is_excluded: false,
      };
    }
  }
};

/**
 * 产品规则计算逻辑
 * @param rules 规则
 * @param item  当前的订单
 * @param itemCount  需要计算的订单数量
 * @returns count,unit  返回了最后的计算数量和单位
 */
const ruleCount = (rules: FeeRule | LeaseRule, item: Record, recordItem: RecordItems, valueCount?, rulefee?) => {
  let count, unit;
  const itemCount = valueCount ? valueCount : recordItem.count;
  const conversion_logic_id = rulefee ? rulefee.conversion_logic_id : rules.conversion_logic_id;
  if (conversion_logic_id === ConversionLogics.Product) {
    // 换算:2
    // 查产品分类，看产品分类是否需要换算
    count = recordItem.product.product_category.convertible ? itemCount * recordItem.product.ratio : itemCount;
    unit = recordItem.product.product_category.convertible
      ? recordItem.product.product_category.conversion_unit
      : recordItem.product.product_category.unit;
  } else if (conversion_logic_id === ConversionLogics.Keep) {
    // 不换算:1
    count = itemCount;
    unit = recordItem.product.product_category.unit;
  } else if (conversion_logic_id === ConversionLogics.ProductWeight) {
    // 换算：4 按照产品表重量
    count = itemCount * recordItem.product.weight;
    unit = recordItem.product.product_category.unit;
  } else {
    const rule = rules?.ucl?.weight_items.filter(
      (value) =>
        value.product_id === recordItem.product_id || value.product_id - RulesNumber === recordItem.product.category_id,
    )[0];
    // 按重量换算
    if (rule && rule.conversion_logic_id === ConversionLogics.Keep) {
      // 不换算
      count = itemCount * rule.weight;
    } else if (rule && rule.conversion_logic_id === ConversionLogics.Product) {
      // 换算
      count = recordItem.product.product_category.convertible
        ? itemCount * recordItem.product.ratio * rule.weight
        : itemCount;
    } else {
      count = 0;
    }
    unit = recordItem.product.product_category.convertible
      ? recordItem.product.product_category.conversion_unit
      : recordItem.product.product_category.unit;
  }
  unit = rulefee ? rulefee.unit : unit;
  const { converCount, converUnit } = converUnitCount(count, unit);
  count = converCount;
  unit = converUnit;
  return { count, unit };
};

/**
 * 租金天数计算
 * @param { calc_type, movement, date } 租金计算方式，出入库，订单日期
 * 2：计头计尾：出库多加一天
 * 3：不计头不计尾：入库多加一天
 * 0：计头不计尾：出入库都加一天
 * 其他情况正常计算天数
 * 1：计尾不计头：正常计算天数
 * @returns days 根据租金计算方式返回租借天数
 */
const getCalcDays = (start_date, end_date) => {
  // 正常计算date到目前天数
  const endDate = dayjs(end_date).startOf('day');
  const startDate = dayjs(start_date).startOf('day');
  const daysDiff = endDate.diff(startDate, 'day') + 1;
  return daysDiff;
};

// 返回天数
const dayjsDays = (date) => {
  return dayjs(date).startOf('day');
};

// 结存时间
/**
 * 租金天数计算
 * @param { calc_type, movement, date } 租金计算方式，出入库，订单日期
 * 2：计头计尾：出库多加一天
 * 3：不计头不计尾：入库多加一天
 * 0：计头不计尾：出入库都加一天
 * 其他情况正常计算天数
 * 1：计尾不计头：正常计算天数
 * @returns days 根据租金计算方式返回租借天数
 */
const afterDays = (calc_type, movement, start, end) => {
  const l = dayjs(end).startOf('day');
  const r = dayjs(start).startOf('day');
  let ofterDays = l.diff(r, 'day');
  switch (calc_type) {
    case CalcDateType.countHeads:
      ofterDays += 1;
      break;
    case CalcDateType.countTails:
      break;
    case CalcDateType.countHT:
      if (movement === '-1') {
        ofterDays += 1;
      }
      break;
    case CalcDateType.withoutHT:
      if (movement === '1') {
        ofterDays += 1;
      }
      break;
  }
  return ofterDays;
};

const feeData = (data, settlementAbout: Settlement, type) => {
  const feeItem = {};
  const fee = [];
  if (data.length) {
    data.forEach((value) => {
      let name = value.name;
      if (value.productCategory === 'category') {
        name = value.name;
      } else if (value.productCategory === 'product') {
        name = value.label;
      }
      let listKey = `${value.name}_${value.movement}_${converDate(value.date, 'YYYY-MM-DD')}`;
      switch (type) {
        case 'category':
          listKey = `${value.name}_${value.movement}_${converDate(value.date, 'YYYY-MM-DD')}`;
          break;
        case 'product':
          listKey = `${value.label}_${value.movement}_${converDate(value.date, 'YYYY-MM-DD')}`;
          name = value.label;
      }
      if (!feeItem[listKey]) {
        feeItem[listKey] = {
          settlement_id: value.settlement_id,
          movement: value.movement,
          date: value.date,
          amount: value.amount,
          category: value.category,
          count: value.count,
          days: 0,
          name: name,
          unit_name: value.unit_name,
          unit_price: value.unit_price,
          is_excluded: value.is_excluded,
          type: type,
        };
      } else {
        feeItem[listKey].count = feeItem[listKey].count + value.count;
        feeItem[listKey].amount = feeItem[listKey].amount + value.amount;
        feeItem[listKey].unit_price = isNaN(feeItem[listKey].amount / feeItem[listKey].count)
          ? 0
          : feeItem[listKey].amount / feeItem[listKey].count;
      }
    });
  }
  fee.push(...Object.values(feeItem));
  return fee;
};

const recordItemsFee = (rule, item, recordItem, count, rulefee) => {
  let recordCount = count;
  if (recordItem.record_item_fee_items.length) {
    const recordItemFee = recordItem.record_item_fee_items.filter(
      (value) => value.product_id === rulefee.fee_product_id,
    )[0];
    if (recordItemFee) {
      const { count, unit } = ruleCount(rule, item, recordItem, recordItemFee.count, rulefee);
      recordCount = recordItemFee.is_excluded ? recordCount - count : recordCount;
    }
  }
  return recordCount;
};

const formatNumber = (count) => {
  const c = formatQuantity(count, 5);
  return parseFloat(c.replace(/,/g, ''));
};

/**
 * 筛选租赁信息处理条件
 * @param data 当前需要处理的订单
 * @param settlementAbout 合同中统计的信息
 * @returns  screenDatas 一个对象中包含了历史订单和当期订单
 */
const screenData = (data, settlementAbout, type) => {
  const history = {};
  const list = {};
  const screenDatas = {
    history: [],
    list: [],
  };
  data.forEach((value) => {
    let name = value.name;
    if (value.productCategory === 'category') {
      name = value.name;
    } else if (value.productCategory === 'product') {
      name = value.label;
    }
    let listKey = `${name}_${value.movement}_${converDate(value.date, 'YYYY-MM-DD')}`;
    let historyKey = `${name}`;
    switch (type) {
      case 'category':
        listKey = `${name}_${value.movement}_${converDate(value.date, 'YYYY-MM-DD')}`;
        historyKey = `${name}`;
        break;
      case 'product':
        listKey = `${value.label}_${value.movement}_${converDate(value.date, 'YYYY-MM-DD')}`;
        historyKey = `${value.label}`;
        name = value.label;
        break;
    }
    if (dayjs(value.date).isBefore(settlementAbout.start_date)) {
      if (!history[historyKey]) {
        history[historyKey] = {
          settlement_id: value.settlement_id,
          amount: value.amount,
          category: value.category,
          count: value.count,
          days: getCalcDays(settlementAbout.start_date, settlementAbout.end_date),
          name: name,
          unit_name: value.unit_name,
          unit_price: value.unit_price,
          is_excluded: value.is_excluded,
          type: type,
        };
      } else {
        history[historyKey].count = formatNumber(history[historyKey].count) + formatNumber(value.count);
        history[historyKey].amount = formatNumber(history[historyKey].amount) + formatNumber(value.amount);
        history[historyKey].unit_price =
          history[historyKey].amount / history[historyKey].count / history[historyKey].days;
      }
    } else {
      if (!list[listKey]) {
        list[listKey] = {
          settlement_id: value.settlement_id,
          movement: value.movement,
          date: value.date,
          amount: value.amount,
          category: value.category,
          count: value.count,
          days: value.days,
          name: name,
          unit_name: value.unit_name,
          unit_price: value.unit_price,
          is_excluded: value.is_excluded,
          type: type,
        };
      } else {
        list[listKey].count = formatNumber(list[listKey].count) + formatNumber(value.count);
        list[listKey].amount = formatNumber(list[listKey].amount) + formatNumber(value.amount);
        list[listKey].unit_price = isNaN(list[listKey].amount / list[listKey].count / list[listKey].days)
          ? 0
          : list[listKey].amount / list[listKey].count / list[listKey].days;
      }
    }
  });
  screenDatas['history'].push(...Object.values(history));
  screenDatas['list'].push(...Object.values(list));
  return screenDatas;
};
