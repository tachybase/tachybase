import { ConversionLogics, RecordCategory, RulesNumber, SourcesType, countCource } from '../../utils/constants';
import { renderItV2 } from '../pdf-documents/records-documentV2';
import { Db, Service } from '@nocobase/utils';
import { RecordPdfOptions } from '../../interfaces/options';
import { PrintSetup } from '../../utils/system';
import Database from '@nocobase/database';

@Service()
export class RecordPdfService {
  @Db()
  private db: Database;
  // async transformPdfV2(
  //   recordData: any,
  //   contracts,
  //   lease_data: any,
  //   fee_data: any,
  //   no_product_fee_arr: any,
  //   options: RecordPdfOptions,
  // ) {
  //   const { isDouble, printSetup } = options;

  //   const allProductsFeeRules = contractPLan.contract_plan.fee_items.filter(
  //     (item) =>
  //       item.count_source === SourcesType.inAndOut ||
  //       (item.count_source === SourcesType.outbound && intermediate.movement === '0') ||
  //       (item.count_source === SourcesType.inbound && intermediate.movement === '1'),
  //   );
  //   const actual_weight = allProductsFeeRules.filter(
  //     (item) => item.conversion_logic_id === ConversionLogics.ActualWeight,
  //   );
  //   const no_product_fee_arr = [];
  //   actual_weight.forEach((item) => {
  //     const data = {
  //       name: item.new_fee_products.name,
  //       total: baseRecord.weight * 1000,
  //       conversion_unit: 'KG',
  //       unit_price: item.unit_price,
  //       isFee: true,
  //     };
  //     no_product_fee_arr.push(data);
  //   });
  //   const leaseFees = [];
  //   const no_product_fee = {};
  //   const feeProducts = []
  //   const treeIdsQuery = `
  //     WITH RECURSIVE tree AS ( SELECT id, "parentId"
  //       FROM products
  //       WHERE id = :dataId
  //       UNION ALL
  //       SELECT p.id, p."parentId"
  //       FROM tree up
  //       JOIN products p ON up."parentId" = p.id
  //     ) select id from tree
  //   `
  //   for (const leaseItem of leaseData) {

  //     const itemTreeIds: any = await ctx.db.sequelize.query(
  //       treeIdsQuery,
  //       {
  //         replacements: {
  //           dataId: leaseItem.product_id,
  //         },
  //         type: QueryTypes.SELECT,
  //       },
  //     );
  //     const contract_Plans = contractPLan.contract_plan.lease_items.filter((plan) =>
  //       itemTreeIds.some((item) => item.id === plan.new_porducts.id),
  //     );
  //     let contract_Plan;
  //     itemTreeIds.some((item) => {
  //       // 方案可能出现：祖/父/子，祖/夫
  //       // 1. 如果产品是子，那一定是要使用【祖/父/子】这个方案
  //       const find = contract_Plans.find((plan) => plan.new_products_id === item.id);
  //       if (find) {
  //         contract_Plan = find;
  //         return true; // 返回 true 停止循环
  //       }
  //     });

  //     if (contract_Plan) {
  //       if (contract_Plan.conversion_logic_id > 4 && contract_Plan.conversion_logic.weight_items.length) {
  //         const weights = contract_Plan.conversion_logic.weight_items.filter((weight) =>
  //           itemTreeIds.some((item) => item.id === weight.new_product_id),
  //         );
  //         itemTreeIds.some((item) => {
  //           // 方案可能出现：祖/父/子，祖/夫
  //           // 1. 如果产品是子，那一定是要使用【祖/父/子】这个方案
  //           const find = weights.find((weight) => weight.new_product_id === item.id);
  //           if (find) {
  //             leaseItem.weight_item = find;
  //             return true;
  //           }
  //         });
  //         leaseItem.unit_price = contract_Plan.unit_price || 0;
  //         leaseItem.conversion_logic_id = contract_Plan.conversion_logic_id;
  //       }
  //       // 对应产品维修赔偿项目
  //       const leaseFee = leaseFeeData.filter((fee) => fee.product_id === leaseItem.product_id);
  //       if (leaseFee.length) {
  //         for (const fee of leaseFee) {
  //           const feeTreeIds: any = await ctx.db.sequelize.query(
  //             treeIdsQuery,
  //             {
  //               replacements: {
  //                 dataId: fee.fee_products_id,
  //               },
  //               type: QueryTypes.SELECT,
  //             },
  //           );
  //           let productFeeRule;
  //           feeTreeIds.some((item) => {
  //             const find = contract_Plan.fee_items.find((plan) => plan.new_fee_products_id === item.id);
  //             if (find) {
  //               productFeeRule = find;
  //               return true;
  //             }
  //           });
  //           fee.conversion_logic_id = productFeeRule.conversion_logic_id;
  //           fee.count_source = productFeeRule.count_source;
  //           fee.unit_price = productFeeRule.unit_price;
  //           if (productFeeRule.conversion_logic_id > 4) {
  //             const weights = productFeeRule.conversion_logic.weight_items.filter((weight) =>
  //               itemTreeIds.some((item) => item.id === weight.new_product_id),
  //             );
  //             itemTreeIds.some((item) => {
  //               const find = weights.find((weight) => weight.new_product_id === item.id);
  //               if (find) {
  //                 fee.weight_item = find;
  //                 return true;
  //               }
  //             });
  //           }
  //         }
  //         leaseFees.push(...leaseFee);
  //       }
  //     } else {
  //       // 产品没有找到方案，那就去费用查找，若果费用找到，并且还是手工录入，则计算这个数据，产品item排除，放到手工录入的最后展示
  //       let fee_no_product_rule;
  //       const contract_fee_plans = contractPLan.contract_plan.fee_items.filter((plan) =>
  //         itemTreeIds.some((item) => item.id === plan.new_fee_products.id),
  //       );
  //       itemTreeIds.some((item) => {
  //         const find = contract_fee_plans.find((plan) => plan.new_fee_products.id === item.id);
  //         if (find) {
  //           fee_no_product_rule = find;
  //           return true; // 返回 true 停止循环
  //         }
  //       });
  //       if (fee_no_product_rule && fee_no_product_rule.count_source === SourcesType.staff) {
  //         leaseItem.isFee = true
  //         const noProductFeeData = {
  //           name: leaseItem.name,
  //           unit_price: fee_no_product_rule.unit_price,
  //         }
  //         const count = leaseItem.count
  //         if (fee_no_product_rule.conversion_logic_id === ConversionLogics.Keep) {
  //           noProductFeeData['total'] = count
  //           noProductFeeData['conversion_unit'] = leaseItem.conversion_unit
  //         } else if (fee_no_product_rule.conversion_logic_id === ConversionLogics.Product || fee_no_product_rule.conversion_logic_id === ConversionLogics.ActualWeight) {
  //           const ratio = leaseItem.convertible ? leaseItem.ratio : 1
  //           noProductFeeData['total'] = count * ratio
  //           noProductFeeData['conversion_unit'] = leaseItem.convertible ? leaseItem.conversion_unit : leaseItem.unit
  //         } else if (fee_no_product_rule.conversion_logic_id === ConversionLogics.ProductWeight) {
  //           noProductFeeData['total'] = count * leaseItem.weight
  //           noProductFeeData['conversion_unit'] = "KG"
  //         } else if (fee_no_product_rule.conversion_logic_id > 4) {
  //           let weightRule
  //           const weightItems = fee_no_product_rule.conversion_logic.weight_items.filter((plan) =>
  //             itemTreeIds.some((item) => item.id === plan.new_fee_products.id),
  //           );
  //           itemTreeIds.some((item) => {
  //             const find = weightItems.find((plan) => plan.new_fee_products.id === item.id);
  //             if (find) {
  //               weightRule = find;
  //               return true; // 返回 true 停止循环
  //             }
  //           });
  //           if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
  //             noProductFeeData['total'] = count * weightRule.weight
  //           } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
  //             const ratio = leaseItem.convertible ? leaseItem.ratio : 1
  //             noProductFeeData['total'] = count * weightRule.weight * ratio
  //           }
  //           noProductFeeData['conversion_unit'] = "KG"
  //         }
  //         feeProducts.push(noProductFeeData)
  //       }
  //     }
  //     allProductsFeeRules.forEach((fee) => {
  //       if (no_product_fee[fee.new_fee_products_id]) {
  //         // 出入库量的单位确定
  //         if (fee.conversion_logic_id === ConversionLogics.Keep) {
  //           no_product_fee[fee.new_fee_products_id].total += leaseItem.count;
  //         } else if (fee.conversion_logic_id === ConversionLogics.Product) {
  //           const ratio = leaseItem.convertible ? leaseItem.ratio : 1;
  //           no_product_fee[fee.new_fee_products_id].total += leaseItem.count * ratio;
  //         } else if (fee.conversion_logic_id === ConversionLogics.ProductWeight) {
  //           no_product_fee[fee.new_fee_products_id].total += leaseItem.count * leaseItem.weight;
  //         } else if (fee.conversion_logic_id > 4) {
  //           const weights = fee.conversion_logic.weight_items.filter((weight) =>
  //             itemTreeIds.some((item) => item.id === weight.new_product_id),
  //           );
  //           let weightRule;
  //           itemTreeIds.some((item) => {
  //             const find = weights.find((weight) => weight.new_product_id === item.id);
  //             if (find) {
  //               weightRule = find;
  //               return true;
  //             }
  //           });
  //           if (!weightRule) return;
  //           if (weightRule.conversion_logic_id === ConversionLogics.Keep) {
  //             no_product_fee[fee.new_fee_products_id].total += leaseItem.count * weightRule.weight;
  //           } else if (weightRule.conversion_logic_id === ConversionLogics.Product) {
  //             const ratio = leaseItem.convertible ? leaseItem.ratio : 1;
  //             no_product_fee[fee.new_fee_products_id].total += leaseItem.count * weightRule.weight * ratio;
  //           }
  //         }
  //       } else {
  //         no_product_fee[fee.new_fee_products_id] = {
  //           name: fee.new_fee_products.name,
  //           total: 0,
  //           conversion_unit: '',
  //           unit_price: fee.unit_price,
  //           isFee: true,
  //         };
  //       }
  //     });
  //   }
  //   const noProductFeeArr = Object.values(no_product_fee);
  //   no_product_fee_arr.push(...noProductFeeArr);

  //   const printSetup =
  //     settingType === '0' || settingType === '1' || settingType === '2'
  //       ? settingType
  //       : pdfExplain[0]?.record_print_setup;
  //   const double = isDouble === '0' || isDouble === '1' ? isDouble : pdfExplain[0].record_columns;
  //   // ===========================================

  //   const movement = (movement: string) => {
  //     const data = {
  //       '0': '出库',
  //       '1': '入库',
  //     };
  //     return data[movement];
  //   };

  //   const contract_type = (category) => {
  //     const data = {
  //       '0': '租赁',
  //       '1': '购销',
  //     };
  //     return data[category];
  //   };

  //   const needRecord = {
  //     record_type: recordData.type_new,
  //     record_number: recordData.number,
  //     record_date: recordData.date,
  //     record_origin: recordData.origin,
  //     record_party_b: movement(contracts.movement) === '出库' ? recordData.in_stock : recordData.out_stock, // 还需要判断第三个合同的情况，确定一下出库入是否合同公司有关
  //     vehicles: recordData.vehicles,
  //     contract_type: contracts.new_category,
  //     contract_first_party: contracts.first_party, //公司信息，甲方，我们
  //     movement: movement(contracts.movement),
  //     pdfExplain: recordData.pdfExplain,
  //     nickname: recordData.nickname,
  //     userPhone: recordData.userPhone,
  //   };

  //   const leaseData = lease_data
  //     .map((item) => {
  //       const data = {
  //         parentId: item.parent_id,
  //         parentName: item.parent_name,
  //         productId: item.product_id,
  //         name: item.name,
  //         count: item.count,
  //         unit: item.unit,
  //         conversion_unit: item.conversion_unit,
  //         comment: item.record_items_comment,
  //         unit_price: item.unit_price,
  //       };
  //       if (item.conversion_logic_id === ConversionLogics.Keep) {
  //         data['total'] = item.count;
  //       } else if (
  //         item.conversion_logic_id === ConversionLogics.Product ||
  //         item.conversion_logic_id === ConversionLogics.ActualWeight ||
  //         (!item.conversion_logic_id && !contract_type(needRecord.contract_type))
  //       ) {
  //         if (item.convertible) {
  //           data['total'] = item.count * item.ratio;
  //         } else {
  //           data['total'] = item.count;
  //         }
  //       } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
  //         data['total'] = item.count * item.weight;
  //         data['conversion_unit'] = 'KG';
  //       } else if (item.conversion_logic_id > 4) {
  //         if (item.weight_item.conversion_logic_id === ConversionLogics.Keep) {
  //           data['total'] = item.count * item.weight_item.weight;
  //           data['conversion_unit'] = 'KG';
  //         } else if (item.weight_item.conversion_logic_id === ConversionLogics.Product) {
  //           const total = item.count * item.weight_item.weight;
  //           if (item.convertible) {
  //             data['total'] = total * item.ratio;
  //           } else {
  //             data['total'] = total;
  //           }
  //           data['conversion_unit'] = 'KG';
  //         }
  //       }
  //       return data;
  //     })
  //     .sort((a, b) => {
  //       a.parentId - b.parentId;
  //     });
  //   const leaseFeeData = fee_data.map((item) => {
  //     const data = {
  //       name: item.custom_name || item.fee_name,
  //       comment: item.comment,
  //       unit: '',
  //       conversion_unit: '',
  //       productId: item.product_id + 0.1,
  //       parentId: item.parent_id,
  //     };
  //     let count;
  //     if (item.count_source === SourcesType.staff) {
  //       count = item.fee_count;
  //     } else if (
  //       item.count_source === SourcesType.inAndOut ||
  //       (item.count_source === SourcesType.inbound && contracts.movement === '1') ||
  //       (item.count_source === SourcesType.outbound && contracts.movement === '0')
  //     ) {
  //       count = item.product_count;
  //     }

  //     if (item.conversion_logic_id === ConversionLogics.Keep) {
  //       data['total'] = count;
  //       data.conversion_unit = item.unit;
  //     } else if (
  //       item.conversion_logic_id === ConversionLogics.Product ||
  //       item.conversion_logic_id === ConversionLogics.ActualWeight
  //     ) {
  //       if (item.convertible) {
  //         data['total'] = count * item.ratio;
  //         data.conversion_unit = item.conversion_unit;
  //       } else {
  //         data['total'] = count;
  //         data.conversion_unit = item.unit;
  //       }
  //     } else if (item.conversion_logic_id === ConversionLogics.ProductWeight) {
  //       data['total'] = count * item.weight;
  //     } else if (item.conversion_logic_id > 4) {
  //       if (item.weight_item.conversion_logic_id === ConversionLogics.Keep) {
  //         data['total'] = count * item.weight_item.weight;
  //         data['conversion_unit'] = 'KG';
  //       } else if (item.weight_item.conversion_logic_id === ConversionLogics.Product) {
  //         const total = count * item.weight_item.weight;
  //         if (item.convertible) {
  //           data['total'] = total * item.ratio;
  //         } else {
  //           data['total'] = total;
  //         }
  //         data['conversion_unit'] = 'KG';
  //       }
  //     }
  //     return data;
  //   });
  //   const allData = [...leaseData, ...leaseFeeData].sort((a, b) => a.productId - b.productId);
  //   // 生成小计
  //   const productTotal = {};
  //   leaseData.forEach((element) => {
  //     if (element) {
  //       productTotal[element.parentId] = {
  //         name: element.parentName + '[小计]',
  //         total: (productTotal[element.parentId]?.total ?? 0) + element.total,
  //         conversion_unit: element.conversion_unit,
  //         count: '',
  //         unit: '',
  //         isTotal: true,
  //         comment: '',
  //         parentId: element.parentId,
  //         // 报价用
  //         priceName: element.parentName,
  //         price: element.unit_price,
  //       };
  //     }
  //   });

  //   // 插入小计
  //   const productTotalItems = Object.entries(productTotal).map(([_, value]) => value);
  //   let priceRule = [];
  //   if (contract_type(contracts.new_category) === '购销') {
  //     priceRule = productTotalItems.map((item: any) => {
  //       return {
  //         name: item.priceName,
  //         unit_price: item.price,
  //         unit: item.conversion_unit,
  //         count: item.total,
  //         all_price: item.total * item.price,
  //         comment: item.comment,
  //       };
  //     });
  //   }
  //   productTotalItems.forEach((itemB: any) => {
  //     const lastIndex = allData.map((itemA) => itemA.parentId).lastIndexOf(itemB.parentId);
  //     if (lastIndex !== -1) {
  //       allData.splice(lastIndex + 1, 0, itemB);
  //     } else {
  //       allData.push(itemB);
  //     }
  //   });

  //   const data = [...allData, ...no_product_fee_arr];
  //   return await renderItV2({
  //     detail: needRecord,
  //     record: data,
  //     priceRule: priceRule,
  //     isDouble,
  //     printSetup,
  //   });

  // }
}
