import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, renderToStream, Font } from '@hera/plugin-core';
import { Record } from '../../interfaces/record';
import * as QRCode from 'qrcode';
import { ConversionLogics, RecordCategory } from '../../utils/constants';
import { formatCurrency, formatQuantity } from '../../utils/currencyUtils';
const fontSizes = {
  title: '12px',
  subTitle: '9px',
  main: '7px',
  side: '6px',
};
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    fontFamily: 'source-han-sans',
    padding: '12px',
  },
  title: {
    textAlign: 'center',
    fontSize: fontSizes.title,
  },
  subTitle: {
    textAlign: 'center',
    fontSize: fontSizes.subTitle,
  },
  content: {
    flexDirection: 'row',
    marginLeft: '10pt',
    marginRight: '10pt',
  },
  main: {
    flex: 1,
  },
  side: {
    width: '11px',
    fontSize: fontSizes.side,
    paddingLeft: '2px',
  },
  tableHeader: {
    fontSize: fontSizes.main,
    flexDirection: 'row',
  },
  headerLeft: {
    width: '205px',
  },
  headerMiddle: {
    flex: 1,
  },
  headerLeftLeft: {
    flex: 2,
    // textAlign: 'left',
  },
  headerLeftRight: {
    flex: 1,
    // textAlign: 'right',
  },
  headerRight: {
    width: '205px',
  },
  tableContentTitle: {
    fontSize: fontSizes.main,
    flexDirection: 'row',
  },
  tableCellLargeTitle: {
    flex: 2,
    textAlign: 'center',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
  },
  tableCellTitle: {
    flex: 1,
    textAlign: 'center',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
  },
  tableCell2Title: {
    flex: 2,
    textAlign: 'center',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
  },
  tableCellTitleLast: {
    flex: 1,
    textAlign: 'center',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderRight: '1px solid black',
    marginRight: '-1px',
  },
  tableCell2TitleLast: {
    flex: 2,
    textAlign: 'center',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderRight: '1px solid black',
    marginRight: '-1px',
  },
  tableContent: {
    fontSize: fontSizes.main,
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    textAlign: 'right',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderBottom: '1px solid black',
  },
  tableCellNoLeft: {
    flex: 1,
    textAlign: 'right',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderBottom: '1px solid black',
  },
  tableCell2: {
    flex: 2,
    textAlign: 'right',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
  },
  tableCellLast: {
    flex: 1,
    textAlign: 'right',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderRight: '1px solid black',
    marginRight: '-1px',
    borderBottom: '1px solid black',
  },
  tableCell2Last: {
    flex: 2,
    textAlign: 'right',
    borderLeft: '1px solid black',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderRight: '1px solid black',
    marginRight: '-1px',
    borderBottom: '1px solid black',
  },
  tableFooter: {
    flexDirection: 'row',
  },
  tableFooterQr: {
    width: '50px',
    marginLeft: '-50px',
    transform: 'translate(50px, 0)',
  },
  tableFooterLeft: {
    flex: 1,
    fontSize: fontSizes.main,
    borderLeft: '1px solid black',
    paddingLeft: '50px',
    marginLeft: '-1px',
    borderTop: '1px solid black',
    marginTop: '-1px',
    borderBottom: '1px solid black',
    marginBottom: '-1px',
  },
  tableFooterRight: {
    flex: 1,
    fontSize: fontSizes.main,
    border: '1px solid black',
    paddingRight: '50px',
    margin: '-1px',
  },
  sign: {
    marginTop: '0px',
    flexDirection: 'row',
  },
  signPart: {
    flex: 1,
    fontSize: fontSizes.main,
  },
});
/**
 *
 * @param isDouble 0为单列，1为双列
 * @returns
 */
const PreviewDocument = ({
  imageUrl,
  record,
  calc,
  isDouble,
}: {
  imageUrl: string;
  record: Record;
  calc: any;
  isDouble: Number;
}) => {
  if (Number(record.category) >= 4) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>请到直发单对应的出入库单查看</Text>
        </Page>
      </Document>
    );
  }
  const recordType = {
    '0': '租赁',
    '1': '购销',
    '2': '暂存',
    '3': '盘点',
  };
  isDouble = Number(isDouble);
  // 出入库判断
  const outOfStorage = record.movement === '1' ? '入库' : '出库';
  // 订单日期
  const date = record.date;
  // 流水号
  const number = record.number;
  // 车号
  const car = record.vehicles ? record.vehicles.map((item) => item?.number).join(' ') : '';
  // 原始单号
  const origin = record.original_number;
  // 订单状态
  const type = record.category;
  // 说明
  const explain =
    type === RecordCategory.inventory
      ? `盘点单用于清算仓库盈亏盈余。`
      : `如供需双方未签正式合同，本${
          recordType[type]
        }${outOfStorage}单经供需双方代表签字确认后， 将作为合同及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。${
          outOfStorage === '入库' ? '出库方' : '采购方'
        }须核对 以上产品规格、数量确认后可签字认可。`;
  // 备注
  const comments = record.comment;
  // 制单人
  const singlePlayer = record.nickname + ' ' + record?.userPhone;
  // 合同编号
  const contractId = record.contract ? record.contract.id : '';
  // 状态
  const status = record.contract?.project ? (record.contract.project?.status === 0 ? '进行中' : '已完结') : '';
  // 客户号
  const projectId = record?.contract?.project ? record?.contract?.project?.id : '';
  // 出入库仓库
  const outOfStorageAddress = (type) => {
    // 此type用于展示出入类型
    if (type === 1) {
      // 返回出库
      return record.out_stock.name;
    } else {
      // 确定入库
      return record.in_stock.name;
    }
  };

  // 双列展示
  const transformRecord = calc;
  const dobuleData = [];
  if (isDouble && transformRecord) {
    // 双列展示
    const leftData = transformRecord.slice(0, Math.ceil(transformRecord.length / 2));
    const rightData = transformRecord.slice(Math.ceil(transformRecord.length / 2));
    for (let index = 0; index < leftData.length; index++) {
      const left = Object.fromEntries(Object.entries(leftData[index]).map(([key, value]) => ['left_' + key, value]));
      let right;
      if (rightData[index]) {
        right = Object.fromEntries(Object.entries(rightData[index]).map(([key, value]) => ['right_' + key, value]));
      } else {
        right = {};
      }
      const result = { ...left, ...right };
      dobuleData.push(result);
    }
  }
  // 总金额
  const getAllPrice = () => {
    let price = 0;
    if (!record_other_fee) return;
    record_other_fee.forEach((element) => {
      price += element.allPrice;
    });
    return formatCurrency(price, 2);
  };
  // 购销单，报价
  const getRecordItemCount = (category) => {
    let count = 0;
    let unit = '';
    let type = category.conversion_logic_id;
    let data;
    let isWeight = false;
    let weight = 1;
    if (category.product_id > 99999) {
      data = transformRecord.filter(
        (element) => element.product_category?.id === category.product.id - 99999 && !element.isTotal,
      );
    } else {
      data = transformRecord.filter((element) => element.product?.id === category.product.id && !element.isTotal);
    }
    if (type > 4) {
      const otherRule = category.ucl.other_rules.filter(
        (item) => item.product_id === category.product.id || item.product_id === category.product.id - 99999,
      )[0];
      type = otherRule?.conversion_logic_id;
      isWeight = true;
      weight = otherRule?.weight;
    }
    if (type === ConversionLogics.Keep) {
      data.forEach((element) => {
        count += element.count || 0;
        unit = element.product_category.unit || '';
      });
    } else if (type === ConversionLogics.Product) {
      if (isWeight) {
        data.forEach((element) => {
          count += element.count * weight * (element.product_category.convertible ? element.product.ratio : 1) || 0;
          unit = element.product_category.convertible
            ? element.product_category.conversion_unit
            : element.product_category.unit;
        });
      } else {
        data.forEach((element) => {
          count += element.count * (element.product_category.convertible ? element.product.ratio : 1) || 0;
          unit = element.product_category.convertible
            ? element.product_category.conversion_unit
            : element.product_category.unit;
        });
      }
    } else if (type === ConversionLogics.ActualWeight) {
      // 取分组重量数据
      if (record.record_weight_items?.length) {
        const id = category.product.id > 99999 ? category.product.id - 99999 : category.product.id;
        count = record.record_weight_items.filter((item) => item.product_category_id === id)[0].weight || record.weight;
        unit = '吨';
      } else {
        count = record.weight;
        unit = '吨';
      }
    } else if (type === ConversionLogics.ProductWeight) {
      data.forEach((element) => {
        count += element.count * element.product.weight || 0;
        unit = '吨';
      });
    }
    if (type === ConversionLogics.ProductWeight) count = count / 1000;
    return { count, unit };
  };
  const record_other_fee =
    record.record_lease_rules?.map((item) => {
      const data = {
        ...item,
        name: item.product.label,
        unit_price: item.unit_price,
        origin_unit: getRecordItemCount(item).unit,
        total: getRecordItemCount(item).count
          ? formatQuantity(getRecordItemCount(item).count, 3) + getRecordItemCount(item).unit
          : '',
        allPrice: getRecordItemCount(item).count ? getRecordItemCount(item).count * item.unit_price : '',
      };
      return data;
    }) || [];
  // 双列展示
  const rules_dobuleData = [];
  if (isDouble && record_other_fee && type === RecordCategory.purchase) {
    // 双列展示
    const leftData = record_other_fee.slice(0, Math.ceil(record_other_fee.length / 2));
    const rightData = record_other_fee.slice(Math.ceil(record_other_fee.length / 2));
    for (let index = 0; index < leftData.length; index++) {
      const left = Object.fromEntries(Object.entries(leftData[index]).map(([key, value]) => ['left_' + key, value]));
      let right;
      if (rightData[index]) {
        right = Object.fromEntries(Object.entries(rightData[index]).map(([key, value]) => ['right_' + key, value]));
      } else {
        right = {};
      }
      const result = { ...left, ...right };
      rules_dobuleData.push(result);
    }
  }

  // 打印单公司标题名称
  const getTitle = () => {
    let name;
    if (type === RecordCategory.lease) {
      name = record.contract?.project?.associated_company?.name ?? record.systemTitle;
    } else {
      if (outOfStorage === '入库') {
        name = record.out_stock?.associated_company?.name ?? record.systemTitle;
      } else {
        name = record.in_stock?.associated_company?.name ?? record.systemTitle;
      }
    }
    return name;
  };
  const recordsName = getTitle();
  // 项目联系人信息
  const projectPhone = record.contract?.project?.contacts
    ?.map((item) => (item.name || '') + (item.phone || ''))
    .join(' ');
  const transUnit = (count, unit) => {
    if (unit && unit === 'KG') {
      return formatQuantity(count / 1000, 3) + '吨';
    } else {
      return formatQuantity(count, 3) + unit;
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{recordsName}</Text>
        <Text style={styles.subTitle}>{record.category === RecordCategory.inventory ? '盘点' : outOfStorage}单</Text>
        <View style={styles.content}>
          <View style={styles.main}>
            {/* 第一行 */}
            <View style={styles.tableHeader}>
              {record.category === RecordCategory.purchase && (
                <Text style={styles.headerLeft}>销售单位：{outOfStorageAddress(1)}</Text>
              )}
              {record.category === RecordCategory.staging && (
                <Text style={styles.headerLeft}>出库方：{outOfStorageAddress(1)}</Text>
              )}
              {record.category === RecordCategory.inventory && (
                <Text style={styles.headerLeft}>盘点单位：{record.in_stock?.name}</Text>
              )}
              {record.category !== RecordCategory.lease && (
                <Text style={styles.headerMiddle}>日期：{date && date.toLocaleDateString()}</Text>
              )}
              {record.category !== RecordCategory.lease && <Text style={styles.headerRight}>流水号：{number}</Text>}
            </View>
            {/* 第二行 */}
            <View style={styles.tableHeader}>
              {record.category === RecordCategory.purchase && (
                <Text style={styles.headerLeft}>采购单位：{outOfStorageAddress(0)}</Text>
              )}
              {record.category === RecordCategory.staging && (
                <Text style={styles.headerLeft}>入库方：{outOfStorageAddress(0)}</Text>
              )}
              {record.category !== RecordCategory.inventory && record.category !== RecordCategory.lease && (
                <Text style={styles.headerMiddle}>车号：{car}</Text>
              )}
              {record.category !== RecordCategory.inventory && record.category !== RecordCategory.lease && (
                <Text style={styles.headerRight}>原始单号：{origin}</Text>
              )}
            </View>
            {/* 租赁 */}
            {record.category === RecordCategory.lease && (
              <View style={styles.tableHeader}>
                <Text style={styles.headerLeftLeft}>承租单位：{record.contract?.project?.company?.name || ''}</Text>
                <Text style={styles.headerLeftRight}>日期：{date && date.toLocaleDateString()}</Text>
              </View>
            )}
            {record.category === RecordCategory.lease && (
              <View style={styles.tableHeader}>
                <Text style={styles.headerLeftLeft}>
                  项目名称：{record.contract?.project?.id + ' ' || ''}
                  {record.contract?.project?.name || ''}
                </Text>
                <Text style={styles.headerLeftRight}>流水号：{number}</Text>
              </View>
            )}
            {record.category === RecordCategory.lease && (
              <View style={styles.tableHeader}>
                <Text style={styles.headerLeftLeft}>项目地址：{record.contract?.project?.address}</Text>
                <Text style={styles.headerLeftRight}>原始单号：{origin}</Text>
              </View>
            )}
            {record.category === RecordCategory.lease && (
              <View style={styles.tableHeader}>
                <Text style={styles.headerLeftLeft}>项目联系人：{projectPhone}</Text>
                <Text style={styles.headerLeftRight}>车号：{car}</Text>
              </View>
            )}
            {!isDouble && type === RecordCategory.purchase && (
              <View style={styles.tableContentTitle}>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>单价</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>金额</Text>
                <Text style={styles.tableCellTitleLast}>备注</Text>
              </View>
            )}
            {!isDouble &&
              type === RecordCategory.purchase &&
              record_other_fee.map((item) => (
                <View key={'key'} style={styles.tableContent}>
                  <Text style={styles.tableCell2}>{item?.name}</Text>
                  <Text style={styles.tableCell}>
                    {item?.unit_price && item?.unit_price + '元/' + item.origin_unit}
                  </Text>
                  <Text style={styles.tableCell}>{item?.total}</Text>
                  <Text style={styles.tableCell}>
                    {item?.allPrice ? formatCurrency(item.allPrice, 2) : '无对应规则，请检查！'}
                  </Text>
                  <Text style={styles.tableCellLast}>{item?.comment || ''}</Text>
                </View>
              ))}
            {isDouble && type === RecordCategory.purchase && (
              <View style={styles.tableContentTitle}>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>单价</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>金额</Text>
                <Text style={styles.tableCellTitle}>备注</Text>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>单价</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>金额</Text>
                <Text style={styles.tableCellTitleLast}>备注</Text>
              </View>
            )}

            {isDouble &&
              type === RecordCategory.purchase &&
              rules_dobuleData.map((item) => (
                <View key={'key'} style={styles.tableContent}>
                  <Text style={styles.tableCell2}>{item.left_name}</Text>
                  <Text style={styles.tableCell}>{item.left_unit_price + '元/' + item.left_origin_unit}</Text>
                  <Text style={styles.tableCell}>{item.left_total}</Text>
                  <Text style={styles.tableCell}>
                    {item?.left_allPrice
                      ? formatCurrency(item?.left_allPrice, 2)
                      : item?.left_name
                        ? '无对应规则，请检查！'
                        : ''}
                  </Text>
                  <Text style={styles.tableCell}>{item.left_comment || ''}</Text>
                  <Text style={styles.tableCell2}>{item?.right_name}</Text>
                  <Text style={styles.tableCell}>
                    {item?.right_unit_price && item?.right_unit_price + '元/' + item?.right_origin_unit}
                  </Text>
                  <Text style={styles.tableCell}>{item?.right_total}</Text>
                  <Text style={styles.tableCell}>
                    {item?.right_allPrice
                      ? formatCurrency(item?.right_allPrice, 2)
                      : item?.right_name
                        ? '无对应规则，请检查！'
                        : ''}
                  </Text>
                  <Text style={styles.tableCellLast}>{item?.right_comment || ''}</Text>
                </View>
              ))}
            {/* 表格 */}
            {/* ==========================================================================两表分割================================================================================================ */}
            {!isDouble && (
              <View style={styles.tableContentTitle}>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>小计</Text>
                <Text style={type === RecordCategory.purchase ? styles.tableCell2TitleLast : styles.tableCellTitleLast}>
                  备注
                </Text>
              </View>
            )}
            {!isDouble &&
              transformRecord.map((item) => (
                <View key={'key'} style={styles.tableContent}>
                  <Text style={styles.tableCell2}>{item.name}</Text>
                  <Text style={styles.tableCell}>{item.count + item.unit}</Text>
                  <Text style={item.isTotal ? styles.tableCellNoLeft : styles.tableCell}>
                    {item.total_uni === 'KG' ? formatQuantity(item.total / 1000, 2) : formatQuantity(item.total, 2)}
                    {item.total_unit === 'KG' ? '吨' : item.total_unit}
                  </Text>
                  <Text style={type === RecordCategory.purchase ? styles.tableCell2Last : styles.tableCellLast}>
                    {item.comment || ''}
                  </Text>
                </View>
              ))}
            {!isDouble && type === RecordCategory.purchase && (
              <View style={styles.tableContent}>
                <Text style={styles.tableCell2}></Text>
                <Text style={styles.tableCell}>总金额</Text>
                <Text style={styles.tableCell}>{type === RecordCategory.purchase && getAllPrice()}</Text>
                <Text style={type === RecordCategory.purchase ? styles.tableCell2Last : styles.tableCellLast}></Text>
              </View>
            )}
            {isDouble && (
              <View style={styles.tableContentTitle}>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>小计</Text>
                <Text style={type === RecordCategory.purchase ? styles.tableCell2Title : styles.tableCellTitle}>
                  备注
                </Text>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>小计</Text>
                <Text style={type === RecordCategory.purchase ? styles.tableCell2TitleLast : styles.tableCellTitleLast}>
                  备注
                </Text>
              </View>
            )}
            {isDouble &&
              dobuleData.map((item) => (
                <View key={'key'} style={styles.tableContent}>
                  <Text style={styles.tableCell2}>{item.left_name}</Text>
                  <Text style={styles.tableCell}>{item.left_count + item.left_unit}</Text>
                  <Text style={item.left_isTotal ? styles.tableCellNoLeft : styles.tableCell}>
                    {transUnit(item.left_total, item.left_total_unit)}
                  </Text>
                  <Text style={type === RecordCategory.purchase ? styles.tableCell2 : styles.tableCell}>
                    {item.comment || ''}
                  </Text>
                  <Text style={styles.tableCell2}>{item?.right_name}</Text>
                  <Text style={styles.tableCell}>
                    {item?.right_count} {item?.right_unit}
                  </Text>
                  <Text style={item?.right_isTotal ? styles.tableCellNoLeft : styles.tableCell}>
                    {item.right_name && transUnit(item.right_total, item.right_total_unit)}
                  </Text>
                  <Text style={type === RecordCategory.purchase ? styles.tableCell2Last : styles.tableCellLast}>
                    {item?.comment}
                  </Text>
                </View>
              ))}
            {isDouble && type === RecordCategory.purchase && (
              <View style={styles.tableContent}>
                <Text style={styles.tableCell2}></Text>
                <Text style={styles.tableCell}></Text>
                <Text style={styles.tableCell}></Text>
                <Text style={type === RecordCategory.purchase ? styles.tableCell2 : styles.tableCell}></Text>
                <Text style={styles.tableCell2}></Text>
                <Text style={styles.tableCell}>总金额</Text>
                <Text style={styles.tableCell}>{type === RecordCategory.purchase && getAllPrice()}</Text>
                <Text style={type === RecordCategory.purchase ? styles.tableCell2Last : styles.tableCellLast}></Text>
              </View>
            )}
            {/* 表格底部 */}
            <View style={styles.tableFooter}>
              <View style={styles.tableFooterQr}>
                <Image src={imageUrl} />
              </View>
              <View style={styles.tableFooterLeft}>
                <Text>说明：{explain}</Text>
              </View>
              <Text style={styles.tableFooterRight}>
                {' '}
                <Text>备注：{comments}</Text>
              </Text>
            </View>
            <View style={styles.sign}>
              <Text style={styles.signPart}>制表人：{singlePlayer}</Text>
              {type === RecordCategory.lease && <Text style={styles.signPart}>出租单位（签名）：</Text>}
              {type === RecordCategory.lease && <Text style={styles.signPart}>租借单位（签名）：</Text>}
              {type === RecordCategory.purchase && <Text style={styles.signPart}>采购单位（签名）：</Text>}
              {type === RecordCategory.purchase && <Text style={styles.signPart}>购入单位（签名）：</Text>}
              {type === RecordCategory.staging && <Text style={styles.signPart}>暂存仓库（签名）：</Text>}
              {type === RecordCategory.inventory && <Text style={styles.signPart}>盘点仓库（签名）：</Text>}
            </View>
          </View>
          <View style={styles.side}>
            <Text>{record.pdfExplain}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export const renderIt = async (rent: { record: Record; calc; isDouble: Number }) => {
  const url = 'https://shcx.daoyoucloud.com/admin';
  const imageUrl = await QRCode.toDataURL(url);
  return await renderToStream(<PreviewDocument imageUrl={imageUrl} {...rent} />);
};
