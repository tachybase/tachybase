import Database from '@tachybase/database';
import { Db, Service } from '@tachybase/utils';

import dayjs from 'dayjs';

import { Record } from '../../interfaces/record';
import { RecordItems } from '../../interfaces/records';
import { FeeRule, LeaseRule } from '../../interfaces/rule';
import { Settlement } from '../../interfaces/settlement';
import {
  AddItemsCategory,
  CalcDateType,
  ConversionLogics,
  countCource,
  Itemcategory,
  RulesNumber,
} from '../../utils/constants';
import { formatQuantity } from '../../utils/currencyUtils';
import { converDate } from '../../utils/daysUtils';
import { converUnitCount } from '../../utils/unitUtils';

@Service()
export class SettlementProductsService {
  @Db()
  private db: Database;

  async calculate(settlementAbout, settlementsId) {
    /**
     * 租金计算方式
     * 0: 计头不计尾
     * 1. 计尾不计头
     * 2. 计头又计尾
     * 3. 不计头不计尾
     */
    let createFeesDatas = [];
    const record = []; //已有录入的订单
    let createLeasDatas = [];
    //计算正常租赁订单
    settlementAbout.settlementLeaseData?.forEach((recordItem) => {
      if (!recordItem) return;
      const dateIsBefore = dayjs(recordItem.date).isBefore(settlementAbout.start_date);
      const start_date = dateIsBefore ? settlementAbout.start_date : recordItem.date;
      const movement = recordItem.movement === '-1' ? '1' : '-1';
      const data = {
        settlement_id: settlementsId, //合同ID
        movement: recordItem.movement, //出入库状态
        date: recordItem.date, //时间
        name: recordItem.product_name,
        label: recordItem.product_label,
        category: '0', //费用类别
        //租赁天数  历史订单就存开始日期到结束日期  当前订单存储订单日期到结束日期
        unit_price: recordItem.unit_price,
        days: afterDays(recordItem.calc_type, recordItem.movement, start_date, settlementAbout.end_date),
        item_count: recordItem.product_count * Number(movement),
      };
      //3实际重量
      if (recordItem.conversion_logic_id === ConversionLogics.ActualWeight) {
        const productData = { ...data };
        let weightName;
        if (recordItem.belong_to_group_weight_name) {
          weightName =
            recordItem.belong_to_group_weight_name === recordItem.product_name
              ? recordItem.product_label + '&&'
              : `${recordItem.belong_to_group_weight_name}-` + `${recordItem.product_label}&&`;
        } else {
          weightName = recordItem.product_label + '&&';
        }
        productData['name'] = recordItem.belong_to_group_weight_name ?? recordItem.product_name;
        productData['label'] = weightName;
        productData['count'] = 0;
        productData['amount'] = 0;
        productData['unit_name'] = '吨';
        createLeasDatas.push(productData);
        if (recordItem.group_weight) {
          const isRecord = record.find(
            (item) =>
              item.record_id === recordItem.record_id &&
              item.belong_to_group_weight_id === recordItem.belong_to_group_weight_id,
          );
          if (isRecord) return;
          record.push(recordItem);
          data['count'] = recordItem.group_weight;
        } else if (recordItem.record_weight) {
          const isRecord = record.find((item) => item.record_id === recordItem.record_id);
          if (isRecord) return;
          record.push(recordItem);
          data['count'] = recordItem.record_weight;
        }
        data['name'] = recordItem.belong_to_group_weight_name ?? recordItem.product_name;
        data['label'] = recordItem.belong_to_group_weight_name ?? recordItem.product_name;
        data['unit_price'] = data['unit_price'] * 1000;
        data['item_count'] = 0;
        data['unit_name'] = '吨';
      } else {
        const { count, unit } = calcItemCount(recordItem, recordItem.product_count);
        data['count'] = count;
        data['unit_name'] = unit;
      }
      data['count'] = data['count'] * Number(movement);
      data['amount'] = data['count'] * recordItem.unit_price * data['days'];
      createLeasDatas.push(data);
    });

    //计算有关联费用
    settlementAbout.settlementFeeData?.forEach((feeItem) => {
      if (!dayjs(feeItem.date).isBetween(settlementAbout.start_date, settlementAbout.end_date, 'day', '[]')) return;
      const recordItem = settlementAbout.settlementLeaseData.find(
        (item) => item.record_id === feeItem.number && item.product_id === feeItem.product_id,
      );
      if (!feeItem || !recordItem) return;
      const data = {
        settlement_id: settlementsId, //合同ID
        movement: recordItem.movement, //出入库状态
        date: recordItem.date, //时间
        name: recordItem.product_name + '-' + feeItem.fee_product_label,
        label: recordItem.product_label + '-' + feeItem.fee_product_label,
        category: feeItem.fee_product_name, //费用类别
        unit_price: feeItem.fee_price,
        days: afterDays(recordItem.calc_type, recordItem.movement, feeItem.date, settlementAbout.end_date),
        item_count: recordItem.product_count,
      };
      if (feeItem.conversion_logic_id === ConversionLogics.ActualWeight) {
        if (!recordItem.group_weight && !recordItem.record_weight) return;
        const itemCount = recordItem.group_weight || recordItem.record_weight;
        if (feeItem.count_source === countCource.outProduct || feeItem.count_source === countCource.outItem) {
          if (recordItem.movement === '1') return;
          if (feeItem.count) {
            data['count'] = feeItem.is_excluded ? itemCount - feeItem.count : itemCount;
          }
        } else if (
          feeItem.count_source === countCource.enterProduct ||
          feeItem.count_source === countCource.enterItem
        ) {
          if (recordItem.movement === '-1') return;
          if (feeItem.count) {
            data['count'] = feeItem.is_excluded ? itemCount - feeItem.count : itemCount;
          }
        } else {
          return;
        }
        const { count, unit } = calcItemCount(recordItem, itemCount, feeItem);
        let feeName = feeItem.belong_to_group_weight_name + '-' + recordItem.product_name;
        let feeLabel = feeItem.belong_to_group_weight_name + '-' + recordItem.product_label;
        if (feeItem.belong_to_group_weight_name === recordItem.product_name) feeName = recordItem.product_name;
        feeLabel = recordItem.product_label;
        data['count'] = count;
        data['unit_name'] = unit;
        data['name'] = feeName + '-' + feeItem.fee_product_label;
        data['label'] = feeLabel + '-' + feeItem.fee_product_label;
      } else {
        //人工录入
        if (
          feeItem.count_source === countCource.artificial &&
          feeItem.conversion_logic_id !== ConversionLogics.ActualWeight
        ) {
          if (!feeItem.count) return;
          data['count'] = feeItem.count;
        } //出库
        else if (feeItem.count_source === countCource.outProduct || feeItem.count_source === countCource.outItem) {
          if (recordItem.movement === '1') return;
        } //入库
        else if (feeItem.count_source === countCource.enterProduct || feeItem.count_source === countCource.enterItem) {
          if (recordItem.movement === '-1') return;
        } else {
          return;
        }
        const { count, unit } = calcItemCount(recordItem, data['count'], feeItem);
        data['count'] = count;
        data['unit_name'] = unit;
      }
      data['amount'] = data['count'] * data['unit_price'] * data['days'];
      createLeasDatas.push(data);
    });

    //计算无关联费用
    settlementAbout.settlementFeeNoProductData?.forEach((nFeeItem) => {
      const feeItem = [];
      const is_excludedItems = [];
      settlementAbout.settlementLeaseData.forEach((recordItem) => {
        if (!dayjs(recordItem.date).isBetween(settlementAbout.start_date, settlementAbout.end_date, 'day', '[]'))
          return;
        const data = {
          settlement_id: settlementsId, //合同ID
          movement: nFeeItem.movement, //出入库状态
          date: dayjs(recordItem.date).endOf('day'),
          name: nFeeItem.fee_label,
          label: nFeeItem.fee_label,
          category: nFeeItem.fee_name, //费用类别
          unit_price: nFeeItem.unit_price,
          unit_name: nFeeItem.unit,
          days: 0,
          count: 0,
          exist: false,
        };
        if (nFeeItem.conversion_logic_id > 4 && nFeeItem.weightRules) {
          const weight_rules = nFeeItem.weightRules.find((value) => value.new_product_id === recordItem.product_id);
          nFeeItem['weight_rules_weight'] = weight_rules?.weight;
          nFeeItem['weight_rule_conversion_logic_id'] = weight_rules?.conversion_logic_id;
        }
        if (nFeeItem.conversion_logic_id === ConversionLogics.ActualWeight) {
          if (
            (!recordItem.record_weight && !recordItem.group_weight) ||
            nFeeItem.count_source === countCource.artificial
          )
            return;
          if (nFeeItem.count_source === countCource.outProduct || nFeeItem.count_source === countCource.outItem) {
            if (recordItem.movement === '1') return;
            data.movement = '-1';
          } else if (
            nFeeItem.count_source === countCource.enterProduct ||
            nFeeItem.count_source === countCource.enterItem
          ) {
            if (recordItem.movement === '-1') return;
            data.movement = '1';
          }
          if (recordItem.group_weight) {
            const isRecord = feeItem.find(
              (value) =>
                value.record_number === recordItem.record_number &&
                value.belong_to_group_weight_id === recordItem.belong_to_group_weight_id,
            );
            if (isRecord) return;
            feeItem.push(recordItem);
            data.count = recordItem.group_weight;
            data.exist = true;
          } else if (recordItem.record_weight) {
            const isRecord = feeItem.find((value) => value.record_number === recordItem.record_number);
            if (isRecord) return;
            feeItem.push(recordItem);
            data.count = recordItem.record_weight;
            data.exist = true;
          }
        } else {
          if (nFeeItem.count_source === countCource.artificial) {
            const record = settlementAbout.settlementRecordFee.find(
              (value) => value.number === recordItem.record_number && value.fee_product_id === nFeeItem.fee_product_id,
            );
            const isRecord = feeItem.find((value) => value.fee_product_id === record?.fee_product_id);
            if (!record || isRecord) return;
            feeItem.push(record);
            data.count = record.count;
            data.exist = true;
          } else if (
            nFeeItem.count_source === countCource.outProduct ||
            nFeeItem.count_source === countCource.outItem
          ) {
            if (recordItem.movement === '1') return;
            data.movement = '-1';
            const { count } = calcItemCount(recordItem, recordItem.product_count, nFeeItem);
            data.count = count;
            data.exist = true;
          } else if (
            nFeeItem.count_source === countCource.enterProduct ||
            nFeeItem.count_source === countCource.enterItem
          ) {
            if (recordItem.movement === '-1') return;
            data.movement = '1';
            const { count } = calcItemCount(recordItem, recordItem.product_count, nFeeItem);
            data.count = count;
            data.exist = true;
          } else if (nFeeItem.count_source === countCource.product || nFeeItem.count_source === countCource.item) {
            const { count } = calcItemCount(recordItem, recordItem.product_count, nFeeItem);
            data.count = count;
            data.exist = true;
          }
        }
        if (nFeeItem.count_source !== countCource.artificial) {
          const record = settlementAbout.settlementRecordFee?.find(
            (value) => value.number === recordItem.record_number && value.fee_product_id === nFeeItem.fee_product_id,
          );

          const isRecord = is_excludedItems.find((value) => value.fee_product_id === record?.fee_product_id);
          if (record && !isRecord) {
            is_excludedItems.push(record);
            data.count += record.is_excluded ? data.count - record.count : data.count;
          }
        }
        if (
          nFeeItem.count_source !== countCource.artificial &&
          nFeeItem.conversion_logic_id !== ConversionLogics.ActualWeight
        ) {
          data.count = data.count / 1000;
        }
        if (data.exist) {
          data['item_count'] = data.count;
          data['amount'] = data.count * data.unit_price;
          createFeesDatas.push(data);
        }
      });
    });

    createFeesDatas = createFeesDatas?.filter(Boolean);
    createLeasDatas = createLeasDatas?.filter(Boolean);

    const createCategoryDatasItem = screenData(createLeasDatas, settlementAbout, 'category');
    const createProductDatasItem = screenData(createLeasDatas, settlementAbout, 'product');
    const createCategoryFeeItem = screenData(createFeesDatas, settlementAbout, 'category');
    const createProductFeeItem = screenData(createFeesDatas, settlementAbout, 'product');

    //本期信息
    const createDatas = [
      ...createCategoryDatasItem.list,
      ...createProductDatasItem.list,
      ...createCategoryFeeItem.list,
      ...createProductFeeItem.list,
    ];
    createDatas.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
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
            item_count: item.item_count,
            count: item.count,
            unit_name: item.unit_name,
            type: 'category',
          });
        } else {
          summaryCategoryItems.forEach((value) => {
            if (value.name === item.name) {
              value.count += item.count;
              value.item_count += item.item_count;
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
            item_count: item.item_count,
            type: 'product',
          });
        } else {
          summaryProductItems.forEach((value) => {
            if (value.name === item.name) {
              value.count += item.count;
              value.item_count += item.item_count;
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
    createCategoryDatasItem.list.forEach((value) => {
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
    settlementAbout.settlementAddItems?.forEach((value) => {
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
    const tax_included = settlementAbout.settlementLeaseData[0]?.tax_included ?? 0;
    const tax_rate = settlementAbout.settlementLeaseData[0]?.tax_rate ?? 0;
    summaryPeriod.rent = createCategoryDatasItem.list.reduce((sum, curr) => sum + curr.amount, summaryPeriod.rent);
    summaryPeriod.rent = createCategoryDatasItem.history.reduce((sum, curr) => sum + curr.amount, summaryPeriod.rent);
    summaryPeriod.tax = tax_included ? 0 : tax_rate;
    summaryPeriod.current_expenses =
      (summaryPeriod.rent +
        summaryPeriod.maintenance +
        summaryPeriod.n_compensate +
        summaryPeriod.h_compensate +
        summaryPeriod.loadfreight) *
      (summaryPeriod.tax + 1);
    // const settlement = settlementAbout.settlements?.filter((value) =>
    //   dayjs(value.end_date).isBefore(settlementAbout.start_date),
    // );

    // summaryPeriod.accumulate = settlement.length
    //   ? settlement.reduce((sum, curr) => sum + curr.current_expenses, summaryPeriod.current_expenses)
    //   : summaryPeriod.current_expenses;
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
}

const calcItemCount = (recordItem, itemCount, feeItem?) => {
  let count;
  let unit;
  const conversion_logic_id = feeItem ? feeItem.conversion_logic_id : recordItem.conversion_logic_id;
  const weight_rules_conversion_logic_id = feeItem
    ? feeItem.weight_rules_conversion_logic_id
    : recordItem.weight_rules_conversion_logic_id;
  const weight_rules_weight = feeItem ? feeItem.weight_rules_weight : recordItem.weight_rules_weight;
  //1不换算
  if (conversion_logic_id === ConversionLogics.Keep) {
    count = itemCount;
    unit = recordItem.product_unit;
  } //2产品表换算
  else if (conversion_logic_id === ConversionLogics.Product) {
    count = recordItem.product_conbertible ? itemCount * recordItem.porduct_ratio : itemCount;
    unit = recordItem.product_conbertible ? recordItem.product_convertible_unit : recordItem.product_unit;
  } //4默认重量
  else if (conversion_logic_id === ConversionLogics.ProductWeight) {
    count = itemCount * recordItem.product_weight ?? 0;
  } //重量表
  else {
    if (weight_rules_conversion_logic_id === ConversionLogics.Product) {
      count = itemCount * weight_rules_weight ?? 0 * recordItem.porduct_ratio;
    } else if (weight_rules_conversion_logic_id === ConversionLogics.Keep) {
      count = itemCount * weight_rules_weight ?? 0;
    } else {
      count = 0;
    }
    unit = recordItem.product_conbertible ? recordItem.product_convertible_unit : recordItem.product_unit;
  }
  return { count, unit };
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
    let listKey = `${name}_${value.movement}_${converDate(value.date, 'YYYY-MM-DD')}`;
    let historyKey = `${name}`;
    switch (type) {
      case 'category':
        listKey = `${name}_${value.movement}_${converDate(value.date, 'YYYY-MM-DD')}`;
        historyKey = `${name}`;
        value.item_count = 0;
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
          days: afterDays(data.calc_type, value.movement, settlementAbout.start_date, settlementAbout.end_date),
          name: name,
          unit_name: value.unit_name,
          unit_price: value.unit_price,
          item_count: value.item_count,
          is_excluded: value.is_excluded,
          type: type,
        };
      } else {
        history[historyKey].count = formatNumber(history[historyKey].count) + formatNumber(value.count);
        history[historyKey].amount = formatNumber(history[historyKey].amount) + formatNumber(value.amount);
        history[historyKey].unit_price =
          history[historyKey].amount / history[historyKey].count / history[historyKey].days;
        history[historyKey].item_count = formatNumber(history[historyKey].item_count) + formatNumber(value.item_count);
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
          days: value.days || 0,
          name: name,
          unit_name: value.unit_name,
          item_count: value.item_count,
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
        list[listKey].item_count = formatNumber(list[listKey].item_count) + formatNumber(value.item_count);
      }
    }
  });
  screenDatas['history'].push(...Object.values(history));
  screenDatas['list'].push(...Object.values(list));
  return screenDatas;
};
