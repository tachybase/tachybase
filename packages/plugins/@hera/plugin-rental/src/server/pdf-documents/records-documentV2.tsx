import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, renderToStream } from '@hera/plugin-core';
import * as QRCode from 'qrcode';
import { RecordCategory } from '../../utils/constants';
import { formatCurrency, formatQuantity } from '../../utils/currencyUtils';
import { dayjs } from '@nocobase/utils';
import { PrintSetup } from '../../utils/system';
const fontSizes = {
  title: '13px',
  subTitle: '11px',
  main: '9px',
  side: '8px',
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
  },
  headerLeftRight: {
    flex: 1,
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
  detail,
  record,
  priceRule,
  isDouble,
  printSetup,
}: {
  imageUrl: string;
  detail: any;
  record: any[];
  priceRule: any[];
  isDouble: Number;
  printSetup: String;
}) => {
  isDouble = Number(isDouble);
  const date = detail.date;
  const number = detail.number;
  const origin = detail.original_number;
  const singlePlayer = detail.nickname + ' ' + detail?.userPhone;
  const car = detail.vehicles ? detail.vehicles.map((item) => item?.number).join(' ') : '';
  const outOfStorage = detail.movement > 0 ? '入库' : '出库';
  const getTitle = () => {
    let name;
    if (detail.category === RecordCategory.lease) {
      name = detail.contract?.project?.associated_company?.name ?? detail.systemTitle;
    } else {
      if (outOfStorage === '入库') {
        name = detail.out_stock?.associated_company?.name ?? detail.systemTitle;
      } else {
        name = detail.in_stock?.associated_company?.name ?? detail.systemTitle;
      }
    }
    return name;
  };
  const recordsName = getTitle();
  const outOfStorageAddress = (type) => {
    // 此type用于展示出入类型
    if (type === 1) {
      // 返回出库
      return detail.out_stock.name;
    } else {
      // 确定入库
      return detail.in_stock.name;
    }
  };
  const projectPhone = detail.contract?.project?.contacts
    ?.map((item) => (item.name || '') + (item.phone || ''))
    .join(' ');
  const recordType = {
    '0': '租赁',
    '1': '购销',
    '2': '暂存',
    '3': '盘点',
  };
  const explain =
    detail.category === RecordCategory.inventory
      ? `盘点单用于清算仓库盈亏盈余。`
      : `如供需双方未签正式合同，本${
          recordType[detail.category]
        }${outOfStorage}单经供需双方代表签字确认后， 将作为合同及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。${
          outOfStorage === '入库' ? '出库方' : '采购方'
        }须核对 以上产品规格、数量确认后可签字认可。`;
  const getAllPrice = () => {
    let price = 0;
    if (detail.category === RecordCategory.purchase && priceRule.filter(Boolean).length) {
      priceRule.forEach((element) => {
        price += element.all_price;
      });
    }
    return formatCurrency(price, 2);
  };
  const dobulePriceRule = [];
  if (isDouble && detail.category === RecordCategory.purchase && priceRule.filter(Boolean).length) {
    // 双列展示
    const leftData = priceRule.slice(0, Math.ceil(priceRule.length / 2));
    const rightData = priceRule.slice(Math.ceil(priceRule.length / 2));
    for (let index = 0; index < leftData.length; index++) {
      const left = Object.fromEntries(Object.entries(leftData[index]).map(([key, value]) => ['left_' + key, value]));
      let right;
      if (rightData[index]) {
        right = Object.fromEntries(Object.entries(rightData[index]).map(([key, value]) => ['right_' + key, value]));
      } else {
        right = {};
      }
      const result = { ...left, ...right };
      dobulePriceRule.push(result);
    }
  }
  const dobuleRecord = [];
  if (isDouble && record && record.length) {
    // 双列展示
    const leftData = record.slice(0, Math.ceil(record.length / 2));
    const rightData = record.slice(Math.ceil(record.length / 2));
    for (let index = 0; index < leftData.length; index++) {
      const left = Object.fromEntries(Object.entries(leftData[index]).map(([key, value]) => ['left_' + key, value]));
      let right;
      if (rightData[index]) {
        right = Object.fromEntries(Object.entries(rightData[index]).map(([key, value]) => ['right_' + key, value]));
      } else {
        right = {};
      }
      const result = { ...left, ...right };
      dobuleRecord.push(result);
    }
  }
  return (
    <Document>
      <Page size="A4" style={{ ...styles.page, marginTop: detail.margingTop }}>
        <Text style={styles.title}>{recordsName}</Text>
        <Text style={styles.subTitle}>{detail.category === RecordCategory.inventory ? '盘点' : outOfStorage}单</Text>
        <View style={styles.content}>
          <View style={styles.main}>
            {/* 第一行 */}
            <View style={styles.tableHeader}>
              {detail.category === RecordCategory.purchase && (
                <Text style={styles.headerLeft}>销售单位：{outOfStorageAddress(1)}</Text>
              )}
              {detail.category === RecordCategory.staging && (
                <Text style={styles.headerLeft}>出库方：{outOfStorageAddress(1)}</Text>
              )}
              {detail.category === RecordCategory.inventory && (
                <Text style={styles.headerLeft}>盘点单位：{detail.in_stock?.name}</Text>
              )}
              {detail.category !== RecordCategory.lease && (
                <Text style={styles.headerMiddle}>日期：{date && dayjs(date).format('YYYY-MM-DD')}</Text>
              )}
              {detail.category !== RecordCategory.lease && <Text style={styles.headerRight}>流水号：{number}</Text>}
            </View>
            {/* 第二行 */}
            <View style={styles.tableHeader}>
              {detail.category === RecordCategory.purchase && (
                <Text style={styles.headerLeft}>采购单位：{outOfStorageAddress(0)}</Text>
              )}
              {detail.category === RecordCategory.staging && (
                <Text style={styles.headerLeft}>入库方：{outOfStorageAddress(0)}</Text>
              )}
              {detail.category !== RecordCategory.inventory && detail.category !== RecordCategory.lease && (
                <Text style={styles.headerMiddle}>车号：{car}</Text>
              )}
              {detail.category !== RecordCategory.inventory && detail.category !== RecordCategory.lease && (
                <Text style={styles.headerRight}>原始单号：{origin}</Text>
              )}
            </View>
            {/* 租赁 */}
            {detail.category === RecordCategory.lease && (
              <View style={styles.tableHeader}>
                <Text style={styles.headerLeftLeft}>承租单位：{detail.contract?.project?.company?.name || ''}</Text>
                <Text style={styles.headerLeftRight}>日期：{date && dayjs(date).format('YYYY-MM-DD')}</Text>
              </View>
            )}
            {detail.category === RecordCategory.lease && (
              <View style={styles.tableHeader}>
                <Text style={styles.headerLeftLeft}>项目名称：{detail.contract?.project?.name || ''}</Text>
                <Text style={styles.headerLeftRight}>流水号：{number}</Text>
              </View>
            )}
            {detail.category === RecordCategory.lease && (
              <View style={styles.tableHeader}>
                <Text style={styles.headerLeftLeft}>项目地址：{detail.contract?.project?.address}</Text>
                <Text style={styles.headerLeftRight}>原始单号：{origin}</Text>
              </View>
            )}
            {detail.category === RecordCategory.lease && (
              <View style={styles.tableHeader}>
                <Text style={styles.headerLeftLeft}>项目联系人：{projectPhone}</Text>
                <Text style={styles.headerLeftRight}>车号：{car}</Text>
              </View>
            )}
            {/* 单列定价 */}
            {!isDouble && detail.category === RecordCategory.purchase && (
              <View style={styles.tableContentTitle}>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>单价</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>金额</Text>
                <Text style={styles.tableCellTitleLast}>备注</Text>
              </View>
            )}
            {!isDouble &&
              detail.category === RecordCategory.purchase &&
              priceRule.length &&
              priceRule.map((item) => (
                <View key={'key'} style={styles.tableContent}>
                  <Text style={styles.tableCell2}>{item.name}</Text>
                  <Text style={styles.tableCell}>
                    {item?.unit_price && formatQuantity(item.unit_price, 2) + '元/' + item.unit}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatQuantity(item.count, 2)}
                    {item.unit}
                  </Text>
                  <Text style={styles.tableCell}>{formatCurrency(item.all_price, 2)}</Text>
                  <Text style={styles.tableCellLast}>{item.comment || ''}</Text>
                </View>
              ))}
            {/* 双列定价 */}
            {isDouble && detail.category === RecordCategory.purchase && (
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
              detail.category === RecordCategory.purchase &&
              priceRule.length &&
              dobulePriceRule.map((item) => (
                <View key={'key'} style={styles.tableContent}>
                  <Text style={styles.tableCell2}>{item.left_name}</Text>
                  <Text style={styles.tableCell}>
                    {item?.left_unit_price && formatQuantity(item.left_unit_price, 2) + '元/' + item.left_unit}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatQuantity(item.left_count, 2)}
                    {item.left_unit}
                  </Text>
                  <Text style={styles.tableCell}>{formatCurrency(item.left_all_price, 2)}</Text>
                  <Text style={styles.tableCell}>{item.left_comment || ''}</Text>
                  <Text style={styles.tableCell2}>{item.right_name}</Text>
                  <Text style={styles.tableCell}>
                    {item?.right_unit_price && formatQuantity(item.right_unit_price, 2) + '元/' + item.right_unit}
                  </Text>
                  <Text style={styles.tableCell}>
                    {formatQuantity(item.right_count)}
                    {item.right_unit}
                  </Text>
                  <Text style={styles.tableCell}>
                    {item.right_all_price && formatCurrency(item.right_all_price, 2)}
                  </Text>
                  <Text style={styles.tableCellLast}>{item.right_comment || ''}</Text>
                </View>
              ))}
            {/* ============================================================两表分割================================================================================= */}
            {/* 单列租金及费用 */}
            {!isDouble && (
              <View style={styles.tableContentTitle}>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>小计</Text>
                <Text
                  style={
                    detail.category === RecordCategory.purchase ? styles.tableCell2TitleLast : styles.tableCellTitleLast
                  }
                >
                  备注
                </Text>
              </View>
            )}
            {!isDouble &&
              record.map((item) => (
                <View key={'key'} style={styles.tableContent}>
                  <Text style={styles.tableCell2}>{item.name}</Text>
                  <Text style={styles.tableCell}>{!item.count ? '' : formatQuantity(item.count, 2) + item.unit}</Text>
                  <Text style={styles.tableCell}>
                    {(printSetup === PrintSetup.Display && !item.product_id && !item.isTotal) ||
                    (printSetup === PrintSetup.Manual && !item.product_id && !item.isTotal)
                      ? ''
                      : item.total
                        ? formatQuantity(item.total, 2)
                        : ''}
                    {item.isFee && !item.product_id // 判断未无产品关联费用
                      ? printSetup === PrintSetup.DisplayAndPrice && item.total
                        ? '元'
                        : ''
                      : item.conversion_unit}
                  </Text>
                  <Text
                    style={detail.category === RecordCategory.purchase ? styles.tableCell2Last : styles.tableCellLast}
                  >
                    {item.isExcluded ? '不计入合同' : item.comment || ''}
                  </Text>
                </View>
              ))}
            {!isDouble && detail.category === RecordCategory.purchase && (
              <View key={'key'} style={styles.tableContent}>
                <Text style={styles.tableCell2}></Text>
                <Text style={styles.tableCell}>总金额</Text>
                <Text style={styles.tableCell}>{getAllPrice()}</Text>
                <Text
                  style={detail.category === RecordCategory.purchase ? styles.tableCell2Last : styles.tableCellLast}
                ></Text>
              </View>
            )}
            {/* 双列租及费用 */}
            {isDouble && (
              <View style={styles.tableContentTitle}>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>小计</Text>
                <Text
                  style={detail.category === RecordCategory.purchase ? styles.tableCell2Title : styles.tableCellTitle}
                >
                  备注
                </Text>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>小计</Text>
                <Text
                  style={
                    detail.category === RecordCategory.purchase ? styles.tableCell2TitleLast : styles.tableCellTitleLast
                  }
                >
                  备注
                </Text>
              </View>
            )}
            {isDouble &&
              dobuleRecord.map((item) => (
                <View key={'key'} style={styles.tableContent}>
                  <Text style={styles.tableCell2}>{item.left_name}</Text>
                  <Text style={styles.tableCell}>
                    {!item.left_count ? '' : formatQuantity(item.left_count, 2) + item.left_unit}
                  </Text>
                  <Text style={styles.tableCell}>
                    {(printSetup === PrintSetup.Display && !item.left_product_id && !item.left_isTotal) ||
                    (printSetup === PrintSetup.Manual && !item.left_product_id && !item.left_isTotal)
                      ? ''
                      : item.left_total
                        ? formatQuantity(item.left_total, 2)
                        : ''}
                    {item.left_isFee && !item.left_product_id // 判断未无产品关联费用
                      ? printSetup === PrintSetup.DisplayAndPrice && item.left_total
                        ? '元'
                        : '' // 不记录合同不需要单位
                      : item.left_conversion_unit}
                  </Text>
                  <Text style={detail.category === RecordCategory.purchase ? styles.tableCell2 : styles.tableCell}>
                    {item.left_isExcluded ? '不计入合同' : item.left_comment || ''}
                  </Text>
                  <Text style={styles.tableCell2}>{item.right_name}</Text>
                  <Text style={styles.tableCell}>
                    {!item.right_count ? '' : formatQuantity(item.right_count, 2) + item.right_unit}
                  </Text>
                  <Text style={styles.tableCell}>
                    {(printSetup === PrintSetup.Display && !item.right_product_id && !item.right_isTotal) ||
                    (printSetup === PrintSetup.Manual && !item.right_product_id && !item.right_isTotal)
                      ? ''
                      : item.right_total
                        ? formatQuantity(item.right_total, 2)
                        : ''}
                    {item.right_isFee && !item.right_product_id // 判断未无产品关联费用
                      ? printSetup === PrintSetup.DisplayAndPrice && item.right_total
                        ? '元'
                        : '' // 不记录合同不需要单位
                      : item.right_conversion_unit}
                  </Text>
                  <Text
                    style={detail.category === RecordCategory.purchase ? styles.tableCell2Last : styles.tableCellLast}
                  >
                    {item.right_comment || ''}
                    {item.right_name && item.right_isExcluded ? '不计入合同' : item.left_comment || ''}
                  </Text>
                </View>
              ))}
            {isDouble && detail.category === RecordCategory.purchase && (
              <View key={'key'} style={styles.tableContent}>
                <Text style={styles.tableCell2}></Text>
                <Text style={styles.tableCell}></Text>
                <Text style={styles.tableCell}></Text>
                <Text style={detail.category === RecordCategory.purchase ? styles.tableCell2 : styles.tableCell}></Text>
                <Text style={styles.tableCell2}></Text>
                <Text style={styles.tableCell}>总金额</Text>
                <Text style={styles.tableCell}>{getAllPrice()}</Text>
                <Text
                  style={detail.category === RecordCategory.purchase ? styles.tableCell2Last : styles.tableCellLast}
                ></Text>
              </View>
            )}
            <View style={styles.tableFooter}>
              <View style={styles.tableFooterQr}>
                <Image src={imageUrl} />
              </View>
              <View style={styles.tableFooterLeft}>
                <Text>说明：{explain}</Text>
              </View>
              <Text style={styles.tableFooterRight}>
                {' '}
                <Text>备注：{detail.comment}</Text>
              </Text>
            </View>
            <View style={styles.sign}>
              <Text style={styles.signPart}>制表人：{singlePlayer}</Text>
              {detail.category === RecordCategory.lease && <Text style={styles.signPart}>出租单位（签名）：</Text>}
              {detail.category === RecordCategory.lease && <Text style={styles.signPart}>租借单位（签名）：</Text>}
              {detail.category === RecordCategory.purchase && <Text style={styles.signPart}>采购单位（签名）：</Text>}
              {detail.category === RecordCategory.purchase && <Text style={styles.signPart}>购入单位（签名）：</Text>}
              {detail.category === RecordCategory.staging && <Text style={styles.signPart}>暂存仓库（签名）：</Text>}
              {detail.category === RecordCategory.inventory && <Text style={styles.signPart}>盘点仓库（签名）：</Text>}
            </View>
          </View>
          <View style={styles.side}>
            <Text>{detail.pdfExplain}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export const renderItV2 = async (rent: {
  detail: any;
  record: any[];
  priceRule: any[];
  isDouble: Number;
  printSetup: String;
}) => {
  const url = 'https://shcx.daoyoucloud.com/admin';
  const imageUrl = await QRCode.toDataURL(url);
  return await renderToStream(<PreviewDocument imageUrl={imageUrl} {...rent} />);
};
