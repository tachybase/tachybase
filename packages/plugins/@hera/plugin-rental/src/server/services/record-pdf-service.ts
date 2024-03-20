import { ConversionLogics, RecordCategory, RulesNumber, SourcesType, countCource } from '../../utils/constants';
import { renderItV2 } from '../pdf-documents/records-documentV2';
import { Service } from '@nocobase/utils';
import { RecordPdfOptions } from '../../interfaces/options';
import { PrintSetup } from '../../utils/system';

@Service()
export class RecordPdfService {
  async transformPdfV2(recordData: any, lease_data: any, fee_data: any, options: RecordPdfOptions) {
    const { isDouble, printSetup } = options;

    // 直发单不需要打印预览
    if (recordData.category === RecordCategory.purchase2lease || recordData.category === RecordCategory.lease2lease)
      return;

    // 盘点/暂存单使用默认产品表的换算逻辑
    if (recordData.category === RecordCategory.staging || recordData.category === RecordCategory.inventory) {
      lease_data = lease_data.map((item) => {
        const data = {
          ...item,
        };
        // 根据产品表换算
        data['conversion_logic_id'] = 2;
        return data;
      });
    }
    let make_price;

    // 购销单计算报价数据
    if (recordData.category === RecordCategory.purchase) {
      const price_rule = lease_data.map((item) => {
        const data = {
          name: item.price_label,
          unit_price: item.price_price,
          comment: item.price_comment,
        };
        if (!item.conversion_logic_id) return;
        if (item.conversion_logic_id === ConversionLogics.Keep) {
          data['count'] = item.count;
          data['unit'] = item.unit;
        } else if (item.conversion_logic_id === ConversionLogics.Product) {
          if (item.convertible) (data['count'] = item.count * item.ratio), (data['unit'] = item.conversion_unit);
          else (data['count'] = item.count), (data['unit'] = item.unit);
        } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
          data['count'] = item.count * item.weight;
          data['unit'] = 'KG';
        } else if (item.conversion_logic_id === ConversionLogics.ActualWeight) {
          const weight = recordData.record_group_weight_items?.find((w) => w.category.id === item.product_category_id);
          if (weight) {
            data['count'] = weight.weight;
            data['unit'] = '吨';
          } else {
            data['count'] = recordData.weight;
            data['unit'] = '吨';
          }
        } else {
          data['unit'] = 'KG';
          if (item.wr.conversion_logic_id === ConversionLogics.Keep) {
            data['count'] = item.count * item.wr.weight;
          } else if (item.wr.conversion_logic_id === ConversionLogics.Product) {
            data['count'] = item.count * item.ratio * item.wr.weight;
          }
        }
        data['all_price'] = data['count'] * data['unit_price'];
        return data;
      });

      const setData = Object.values(
        price_rule.reduce((acc, item) => {
          if (!acc[item.name]) {
            acc[item.name] = { ...item };
          } else {
            acc[item.name].count += item.count;
            acc[item.name].all_price += item.all_price;
          }
          return acc;
        }, {}),
      );
      make_price = setData;
    }

    // 计算租金数据
    const leaseData = lease_data
      .map((lease) => {
        const data = {
          name: lease.label,
          count: lease.count,
          unit: lease.unit,
          comment: lease.item_comment,
          product_id: lease.product_id,
          category_id: lease.category_id,
          product_category_name: lease.product_category_name,
        };
        if (lease.conversion_logic_id === ConversionLogics.Keep) {
          data['total'] = lease.count;
          data['conversion_unit'] = lease.unit;
        } else if (lease.conversion_logic_id === ConversionLogics.Product) {
          if (lease.convertible)
            (data['total'] = lease.count * lease.ratio), (data['conversion_unit'] = lease.conversion_unit);
          else (data['total'] = lease.count), (data['conversion_unit'] = lease.unit);
        } else if (lease.conversion_logic_id === ConversionLogics.ProductWeight) {
          data['total'] = lease.count * lease.weight;
          data['conversion_unit'] = 'KG';
        } else if (lease.conversion_logic_id === ConversionLogics.ActualWeight) {
          if (lease.convertible)
            (data['total'] = lease.count * lease.ratio), (data['conversion_unit'] = lease.conversion_unit);
          else (data['total'] = lease.count), (data['conversion_unit'] = lease.unit);
        } else {
          data['conversion_unit'] = 'KG';
          if (lease.wr?.conversion_logic_id === ConversionLogics.Keep) {
            data['total'] = lease.count * lease.wr?.weight;
          } else if (lease.wr?.conversion_logic_id === ConversionLogics.Product) {
            data['total'] = lease.count * lease.ratio * lease.wr?.weight;
          }
        }
        return data;
      })
      .sort((a, b) => a.category_id - b.category_id);

    // 计算费用数据，包括有产品关联跟无产品关联
    // 关联产品的赔偿(人工录入/全部)
    const product_fee =
      printSetup === PrintSetup.Manual
        ? fee_data.filter((item) => item.product_id && item.count_source === SourcesType.staff)
        : fee_data.filter((item) => item.product_id);
    const transFormProductFee = product_fee.map((item, index) => {
      // 购销/暂存/盘点无费用信息
      if (
        recordData.category === RecordCategory.purchase ||
        recordData.category === RecordCategory.staging ||
        recordData.category === RecordCategory.inventory
      )
        return;
      // 人工录入没有数量
      if (item.count_source === SourcesType.staff && !item.fee_count) return;
      // 出库单，计数为入库量
      if (item.record_movement === '-1' && item.count_source === SourcesType.inbound) return;
      // 入库单，计数为出库量
      if (item.record_movement === '1' && item.count_source === SourcesType.outbound) return;
      const data = {
        isFee: true,
        isExcluded: item.is_excluded,
        name: item.custom_name || item.label,
        count: item.count_source === SourcesType.staff ? item.fee_count : item.product_count,
        unit: item.unit,
        conversion_unit: item.unit,
        comment: '',
        product_id: item.product_id + '.' + (index + 1),
        category_id: item.product_category_id,
      };
      if (item.conversion_logic_id === ConversionLogics.Keep) {
        data['total'] = data.count;
      } else if (item.conversion_logic_id === ConversionLogics.Product) {
        if (item.convertible) data['total'] = data.count * item.product_ratio;
        else data['total'] = data.count;
      } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
        data['total'] = data.count * item.product_weight;
      } else if (item.conversion_logic_id === ConversionLogics.ActualWeight) {
        data['total'] = item.actual_weight || item.record_weight;
      } else {
        if (item.weight_rules?.conversion_logic_id === ConversionLogics.Keep) {
          data['total'] = data.count * item.weight_rules.weight;
        } else if (item.weight_rules?.conversion_logic_id === ConversionLogics.Product) {
          data['total'] = data.count * item.weight_rules.weight * item.product_ratio;
        }
      }
      // 如果 printSetup === PrintSetup.DisplayAndPrice 要计算费用产生的价格
      if (printSetup === PrintSetup.DisplayAndPrice) {
        data['fee_price'] = data['total'] * item.unit_price;
      }
      return data;
    });
    // 无关联产品赔偿, 人工录取的情况直接为空，因为excludedFee已经处理，正常情况取非手动录入情况数据，excludedFee已经处理
    const fee =
      printSetup === PrintSetup.Manual
        ? []
        : fee_data.filter((item) => !item.product_id && item.count_source !== SourcesType.staff);
    const no_product_fee = fee
      .map((item) => {
        // 购销/暂存/盘点无费用信息
        if (
          recordData.category === RecordCategory.purchase ||
          recordData.category === RecordCategory.staging ||
          recordData.category === RecordCategory.inventory
        )
          return;
        if (item.count_source === countCource.artificial) {
          const data = recordData.record_fee_items?.find((hava) => hava.product?.id === item.fee_product_id);
          if (!data) return;
        }
        if (item.record_movement === '-1' && item.count_source === SourcesType.inbound) return;
        if (item.record_movement === '1' && item.count_source === SourcesType.outbound) return;
        const data = {
          isFee: true,
          name: item.custom_name || item.label,
          unit: item.unit,
          conversion_unit: item.unit,
          comment: '',
        };

        if (item.conversion_logic_id === ConversionLogics.Keep) {
          data['count'] = lease_data.reduce((a, b) => a + b.count, 0);
        } else if (item.conversion_logic_id === ConversionLogics.Product) {
          data['count'] = lease_data.reduce((a, b) => a + (item.convertible ? b.count * b.ratio : b.count), 0);
        } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
          data['count'] = lease_data.reduce((a, b) => a + b.count * b.weight, 0) / 1000;
        } else if (item.conversion_logic_id === ConversionLogics.ActualWeight) {
          data['count'] = item.record_weight;
        } else {
          if (item.weight_rules?.length) {
            // 计算有误，需要检查
            data['count'] = lease_data.reduce((a, b) => {
              const weight_rule = item.weight_rules.find(
                (l) => l.product_id === b.product_id || l.product - RulesNumber === b.category_id,
              );
              if (weight_rule && weight_rule.conversion_logic_id === ConversionLogics.Keep) {
                return a + b.count * weight_rule.weight;
              } else if (weight_rule && weight_rule.conversion_logic_id === ConversionLogics.Product) {
                return a + b.count * b.ratio * weight_rule.weight;
              }
            }, 0);
          }
        }
        // 如果 printSetup === PrintSetup.DisplayAndPrice 要计算费用产生的价格
        if (printSetup === PrintSetup.DisplayAndPrice) {
          data['total'] = data['count'] * item.unit_price;
        }
        return data;
      })
      .filter((item) => item && item.count);
    // 注意把手动录入的加入
    const manualData = recordData.record_fee_items;
    // 因为以往逻辑是根据规则查询，这个订单中数据智能单独查询
    const excludedFee =
      manualData
        ?.map((item) => {
          const data = {
            isFee: true,
            name: item.product.custom_name || item.product.label,
            comment: '',
            count: item.count,
            isExcluded: item.is_excluded,
          };
          const feeRule = fee_data.find((fee) => fee.fee_product_id === item.product_id);
          if (feeRule) {
            data['total'] = feeRule.unit_price * item.count;
            data['unit'] = feeRule.unit || '';
          }
          return data;
        })
        .filter(Boolean) || [];

    const product_fees = transFormProductFee.filter(Boolean);
    // 内容（租金+费用）
    const product_correlation = [...leaseData, ...product_fees].sort((a, b) => a.product_id - b.product_id);

    // 生成小计
    const productTotal = {};
    leaseData.forEach((element) => {
      if (element) {
        productTotal[element.category_id] = {
          name: element.product_category_name + '[小计]',
          total: (productTotal[element.category_id]?.total ?? 0) + element?.total,
          conversion_unit: element.conversion_unit,
          count: '',
          unit: '',
          isTotal: true,
          comment: '',
          category_id: element.category_id,
        };
      }
    });
    // 插入小计
    const productTotalItems = Object.entries(productTotal).map(([_, value]) => value);
    productTotalItems.forEach((itemB: any) => {
      const lastIndex = product_correlation.map((itemA) => itemA.category_id).lastIndexOf(itemB.category_id);
      if (lastIndex !== -1) {
        product_correlation.splice(lastIndex + 1, 0, itemB);
      } else {
        product_correlation.push(itemB);
      }
    });
    const recordPdfData = [...product_correlation, ...no_product_fee, ...excludedFee];
    return await renderItV2({
      detail: recordData,
      record: recordPdfData, // 租金+费用，无关联费用
      priceRule: make_price,
      isDouble,
      printSetup,
    });
  }
}
