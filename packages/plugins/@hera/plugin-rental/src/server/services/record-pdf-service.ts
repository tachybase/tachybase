import { ConversionLogics, RecordCategory, RulesNumber, SourcesType, countCource } from '../../utils/constants';
import { renderItV2 } from '../pdf-documents/records-documentV2';
import { Db, Service } from '@nocobase/utils';
import { RecordPdfOptions } from '../../interfaces/options';
import { PrintSetup } from '../../utils/system';
import Database from '@nocobase/database';
import { QueryTypes } from 'sequelize';

@Service()
export class RecordPdfService {
  @Db()
  private db: Database;

  /**
   * 注意点
   * 1. 正常租赁产品
   * 2. 租赁产品的维修赔偿
   * 3. 无关联产品的维修赔偿（实际总重量，出入库量）
   * 4. 无关联产品的维修赔偿（人工录入)
   * 5. 报价
   */
  async transformPdfV2(
    intermediate, // 中间表
    contractPLan, // 合同方案
    baseRecord, //订单基础数据
    leaseData, // 租金数据
    leaseFeeData, // 赔偿数据
    contracts,
    options,
  ) {
    const { printSetup } = options;
    const _someProductRule = (productParentIds, originRule, targetKey) => {
      let target = null;
      productParentIds.some((item) => {
        // 方案可能出现：祖/父/子，祖/夫
        // 1. 如果产品是子，那一定是要使用【祖/父/子】这个方案
        const find = originRule.find((plan) => plan[targetKey] === item.id);
        if (find) {
          target = find;
          return true; // 返回 true 停止循环
        }
      });
      return target;
    };

    // 计算出入库量的无关联产品赔偿
    const allProductsFeeRules = contractPLan.contract_plan.fee_items.filter(
      (item) =>
        item.count_source === SourcesType.inAndOut ||
        (item.count_source === SourcesType.outbound && intermediate.movement === '0') ||
        (item.count_source === SourcesType.inbound && intermediate.movement === '1'),
    );
    // 无产品关联的实际重量单独处理
    const actual_weight = allProductsFeeRules.filter(
      (item) => item.conversion_logic_id === ConversionLogics.ActualWeight,
    );
    // 1.数组包含无关联实际重量数据
    // 2.包含出入库量计算数据
    const no_product_fee_arr = [];
    actual_weight.forEach((item) => {
      const data = {
        name: item.new_fee_products.name,
        total: baseRecord.weight * 1000,
        conversion_unit: 'KG',
        unit_price: item.unit_price,
        isFee: true,
      };
      no_product_fee_arr.push(data);
    });
    const leaseFees = [];
    const no_product_fee = {};
    const feeProducts = [];
    const treeIdsQuery = `
      WITH RECURSIVE tree AS ( SELECT id, "parentId"
        FROM products
        WHERE id = :dataId
        UNION ALL
        SELECT p.id, p."parentId"
        FROM tree up
        JOIN products p ON up."parentId" = p.id
      ) select id from tree
    `;
    for (const leaseItem of leaseData) {
      const itemTreeIds: any = await this.db.sequelize.query(treeIdsQuery, {
        replacements: {
          dataId: leaseItem.product_id,
        },
        type: QueryTypes.SELECT,
      });
      const contract_Plans = contractPLan.contract_plan.lease_items.filter((plan) =>
        itemTreeIds.some((item) => item.id === plan.new_products.id),
      );
      const contract_Plan = _someProductRule(itemTreeIds, contract_Plans, 'new_products_id');

      if (contract_Plan) {
        leaseItem.conversion_logic_id = contract_Plan.conversion_logic_id;
        leaseItem.unit_price = contract_Plan.unit_price || 0;
        if (contract_Plan.conversion_logic_id > 4 && contract_Plan.conversion_logic.weight_items.length) {
          const weights = contract_Plan.conversion_logic.weight_items.filter((weight) =>
            itemTreeIds.some((item) => item.id === weight.new_product_id),
          );
          leaseItem.weight_item = _someProductRule(itemTreeIds, weights, 'new_product_id');
        }
        // 对应产品维修赔偿项目
        const leaseFee = leaseFeeData.filter((fee) => fee.product_id === leaseItem.product_id); // 这个ID？？？？？？？？！！！！整体测试记得这里
        if (leaseFee.length) {
          for (const fee of leaseFee) {
            const feeTreeIds: any = await this.db.sequelize.query(treeIdsQuery, {
              replacements: {
                dataId: fee.fee_products_id,
              },
              type: QueryTypes.SELECT,
            });
            const productFeeRule = _someProductRule(feeTreeIds, contract_Plan.fee_items, 'new_fee_products_id');
            fee.conversion_logic_id = productFeeRule.conversion_logic_id;
            fee.count_source = productFeeRule.count_source;
            fee.unit_price = productFeeRule.unit_price;
            if (productFeeRule.conversion_logic_id > 4) {
              const weights = productFeeRule.conversion_logic.weight_items.filter((weight) =>
                itemTreeIds.some((item) => item.id === weight.new_product_id),
              );
              itemTreeIds.some((item) => {
                const find = weights.find((weight) => weight.new_product_id === item.id);
                if (find) {
                  fee.weight_item = find;
                  return true;
                }
              });
            }
          }
          leaseFees.push(...leaseFee);
        }
      } else {
        // 人工录入无关联产品的费用
        const contract_fee_plans = contractPLan.contract_plan.fee_items.filter((plan) =>
          itemTreeIds.some((item) => item.id === plan.new_fee_products_id),
        );
        const fee_no_product_rule = _someProductRule(itemTreeIds, contract_fee_plans, 'new_fee_products_id');

        if (fee_no_product_rule && fee_no_product_rule.count_source === SourcesType.staff) {
          leaseItem.isFee = true;
          const noProductFeeData = {
            name: leaseItem.name,
            unit_price: fee_no_product_rule.unit_price,
          };
          const count = leaseItem.count;
          let total = 0;
          if (fee_no_product_rule.conversion_logic_id === ConversionLogics.Keep) {
            total = count;
            noProductFeeData['conversion_unit'] = leaseItem.unit || '';
          } else if (
            fee_no_product_rule.conversion_logic_id === ConversionLogics.Product ||
            fee_no_product_rule.conversion_logic_id === ConversionLogics.ActualWeight
          ) {
            const ratio = leaseItem.convertible ? leaseItem.ratio : 1;
            total = count * ratio;
            noProductFeeData['conversion_unit'] = leaseItem.convertible
              ? leaseItem.conversion_unit || ''
              : leaseItem.unit || '';
          } else if (fee_no_product_rule.conversion_logic_id === ConversionLogics.ProductWeight) {
            total = count * leaseItem.weight;
            noProductFeeData['conversion_unit'] = 'KG';
          } else if (fee_no_product_rule.conversion_logic_id > 4) {
            const weightItems = fee_no_product_rule.conversion_logic.weight_items.filter((plan) =>
              itemTreeIds.some((item) => item.id === plan.new_fee_products_id),
            );
            const weightRule = _someProductRule(itemTreeIds, weightItems, 'new_fee_products_id');

            if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
              total = count * weightRule.weight;
            } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
              const ratio = leaseItem.convertible ? leaseItem.ratio : 1;
              total = count * weightRule.weight * ratio;
            }
            noProductFeeData['conversion_unit'] = 'KG';
          }
          if (printSetup === PrintSetup.DisplayAndPrice) {
            noProductFeeData['count'] = count;
            noProductFeeData['unit'] = noProductFeeData['conversion_unit'];
            noProductFeeData['total'] = total * noProductFeeData.unit_price;
            noProductFeeData['conversion_unit'] = '元';
          } else {
            noProductFeeData['total'] = total;
          }
          feeProducts.push(noProductFeeData);
        }
      }
      // 出入库量无关联产品费用计算
      allProductsFeeRules.forEach((fee) => {
        if (!no_product_fee[fee.new_fee_products_id]) {
          no_product_fee[fee.new_fee_products_id] = {
            name: fee.new_fee_products.name,
            total: 0,
            count: '',
            unit: '',
            conversion_unit: fee.unit,
            unit_price: fee.unit_price,
            isFee: true,
          };
        }
        // 出入库量的单位确定
        let total = 0;
        if (fee.conversion_logic_id === ConversionLogics.Keep) {
          total += leaseItem.count;
        } else if (fee.conversion_logic_id === ConversionLogics.Product) {
          const ratio = leaseItem.convertible ? leaseItem.ratio : 1;
          total += leaseItem.count * ratio;
        } else if (fee.conversion_logic_id === ConversionLogics.ProductWeight) {
          total += leaseItem.count * leaseItem.weight;
        } else if (fee.conversion_logic_id > 4) {
          const weights = fee.conversion_logic.weight_items.filter((weight) =>
            itemTreeIds.some((item) => item.id === weight.new_product_id),
          );
          const weightRule = _someProductRule(itemTreeIds, weights, 'new_product_id');

          if (!weightRule) return;
          if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
            total += leaseItem.count * weightRule.weight;
          } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
            const ratio = leaseItem.convertible ? leaseItem.ratio : 1;
            total += leaseItem.count * weightRule.weight * ratio;
          }
        }

        if (printSetup === PrintSetup.DisplayAndPrice) {
          no_product_fee[fee.new_fee_products_id].count += total;
          no_product_fee[fee.new_fee_products_id].unit = no_product_fee[fee.new_fee_products_id].conversion_unit;
          no_product_fee[fee.new_fee_products_id].total += total * no_product_fee[fee.new_fee_products_id].unit_price;
          no_product_fee[fee.new_fee_products_id].conversion_unit = '元';
        } else {
          no_product_fee[fee.new_fee_products_id].total += total;
        }
      });
    }
    const noProductFeeArr = Object.values(no_product_fee);
    no_product_fee_arr.push(...noProductFeeArr);

    // 数据处理完成
    // 1.leaseDatas 租金数据
    const leaseDatas = leaseData.filter((item) => !item.isFee);
    // 2. leaseFees 租金费用数据
    // 3. no_product_fee_arr 无关联赔偿（人工/出入库/实际）
    // ===========================================

    const movement = (movement: string) => {
      const data = {
        '-1': '出库',
        '1': '入库',
      };
      return data[movement];
    };

    const record_category = (category) => {
      const data = {
        '0': '租赁',
        '1': '购销',
      };
      return data[category];
    };

    const needRecord = {
      record_type: baseRecord.type_new,
      record_number: baseRecord.number,
      record_date: baseRecord.date,
      record_origin: baseRecord.origin,
      record_party_b: movement(contracts.movement) === '出库' ? baseRecord.in_stock : baseRecord.out_stock, // 还需要判断第三个合同的情况，确定一下出库入是否合同公司有关
      record_party_a: movement(contracts.movement) === '入库' ? baseRecord.in_stock : baseRecord.out_stock,
      vehicles: baseRecord.vehicles,
      record_category: record_category(contracts.record_category),
      contract_first_party: contracts.first_party, //公司信息，甲方，我们
      movement: movement(contracts.movement),
      pdfExplain: baseRecord.pdfExplain,
      nickname: baseRecord.nickname,
      userPhone: baseRecord.userPhone,
    };
    // 1. 处理leaseData的计算
    const leaseDataTrans = leaseDatas
      .map((item) => {
        const data = {
          parentId: item.parent_id,
          parentName: item.parent_name,
          productId: item.product_id,
          name: item.name,
          count: item.count,
          unit: item.unit,
          conversion_unit: item.conversion_unit,
          comment: item.record_items_comment,
          unit_price: item.unit_price,
        };
        let total = 0;
        if (item.conversion_logic_id === ConversionLogics.Keep) {
          total = item.count;
        } else if (
          item.conversion_logic_id === ConversionLogics.Product ||
          item.conversion_logic_id === ConversionLogics.ActualWeight ||
          (!item.conversion_logic_id && !needRecord.record_category)
        ) {
          if (item.convertible) {
            total = item.count * item.ratio;
          } else {
            total = item.count;
          }
        } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
          total = item.count * item.weight;
          data['conversion_unit'] = 'KG';
        } else if (item.conversion_logic_id > 4) {
          if (item.weight_item.conversion_logic_id === ConversionLogics.Keep) {
            total = item.count * item.weight_item.weight;
            data['conversion_unit'] = 'KG';
          } else if (item.weight_item.conversion_logic_id === ConversionLogics.Product) {
            const calc = item.count * item.weight_item.weight;
            if (item.convertible) {
              total = calc * item.ratio;
            } else {
              total = calc;
            }
            data['conversion_unit'] = 'KG';
          }
        }
        data['total'] = total;
        return data;
      })
      .sort((a, b) => {
        a.parentId - b.parentId;
      });
    const leaseFeeDataTrans = leaseFees.map((item) => {
      const data = {
        name: item.custom_name || item.fee_name,
        comment: item.comment,
        unit: '',
        conversion_unit: '',
        productId: item.product_id + 0.1,
        parentId: item.parent_id,
        unit_price: item.unit_price,
      };
      let count;
      if (item.count_source === SourcesType.staff) {
        count = item.fee_count;
      } else if (
        item.count_source === SourcesType.inAndOut ||
        (item.count_source === SourcesType.inbound && contracts.movement === '1') ||
        (item.count_source === SourcesType.outbound && contracts.movement === '0')
      ) {
        count = item.product_count;
      }
      let total = 0;
      if (item.conversion_logic_id === ConversionLogics.Keep) {
        total = count;
        data.conversion_unit = item.unit;
      } else if (
        item.conversion_logic_id === ConversionLogics.Product ||
        item.conversion_logic_id === ConversionLogics.ActualWeight
      ) {
        if (item.convertible) {
          total = count * item.ratio;
          data.conversion_unit = item.conversion_unit;
        } else {
          total = count;
          data.conversion_unit = item.unit;
        }
      } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
        total = count * item.weight;
      } else if (item.conversion_logic_id > 4) {
        if (item.weight_item.conversion_logic_id === ConversionLogics.Keep) {
          total = count * item.weight_item.weight;
        } else if (item.weight_item.conversion_logic_id === ConversionLogics.Product) {
          const calc = count * item.weight_item.weight;
          if (item.convertible) {
            total = calc * item.ratio;
          } else {
            total = calc;
          }
        }
        if (printSetup === PrintSetup.DisplayAndPrice) {
          data['conversion_unit'] = '元';
          data['unit'] = 'KG';
        } else {
          data['conversion_unit'] = 'KG';
        }
      }
      if (printSetup === PrintSetup.DisplayAndPrice) {
        data['count'] = total;
        data['total'] = total * data.unit_price;
        data['conversion_unit'] = '元';
      } else {
        data['total'] = total;
      }
      return data;
    });
    const allData = [...leaseDataTrans, ...leaseFeeDataTrans].sort((a, b) => a.productId - b.productId);
    // 生成小计
    const productTotal = {};
    leaseDataTrans.forEach((element) => {
      if (element) {
        productTotal[element.parentId] = {
          name: element.parentName + '[小计]',
          total: (productTotal[element.parentId]?.total ?? 0) + element.total,
          conversion_unit: element.conversion_unit,
          count: '',
          unit: '',
          isTotal: true,
          comment: '',
          parentId: element.parentId,
          // 报价用
          priceName: element.parentName,
          price: element.unit_price,
        };
      }
    });

    // 插入小计
    const productTotalItems = Object.entries(productTotal).map(([_, value]) => value);
    let priceRule = [];
    if (needRecord.record_category === '购销') {
      priceRule = productTotalItems.map((item: any) => {
        return {
          name: item.priceName,
          unit_price: item.price,
          unit: item.conversion_unit,
          count: item.total,
          all_price: item.total * item.price,
          comment: item.comment,
        };
      });
    }
    productTotalItems.forEach((itemB: any) => {
      const lastIndex = allData.map((itemA) => itemA.parentId).lastIndexOf(itemB.parentId);
      if (lastIndex !== -1) {
        allData.splice(lastIndex + 1, 0, itemB);
      } else {
        allData.push(itemB);
      }
    });

    let data = [];
    // 1. allData 处理了租赁产品以及对应的费用
    if (printSetup === PrintSetup.Manual) {
      data = [...allData, ...feeProducts];
    } else {
      data = [...allData, ...feeProducts, ...no_product_fee_arr];
    }

    return await renderItV2({
      detail: needRecord,
      record: data,
      priceRule: priceRule,
      options,
    });
  }
}
