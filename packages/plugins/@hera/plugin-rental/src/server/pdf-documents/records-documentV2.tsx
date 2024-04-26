import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, renderToStream } from '@hera/plugin-core';
import * as QRCode from 'qrcode';
import { formatCurrency, formatQuantity } from '../../utils/currencyUtils';
import { dayjs } from '@nocobase/utils';
import { RecordPdfOptions } from '../../interfaces/options';

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
  options,
}: {
  imageUrl: string;
  detail: any;
  record: any[];
  priceRule: any[];
  options: any; // RecordPdfOptions;
}) => {
  const fontSizes = {
    title: '13px',
    subTitle: '11px',
    main: `${options.font || 9}px`,
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
      borderBottom: '1px solid black',
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

  const paper = options.paper;
  const isDouble = Number(options.isDouble);
  const explain =
    detail.type_new === '1'
      ? `盘点单用于清算仓库盈亏盈余。`
      : `如供需双方未签正式合同，本${
          detail.record_category
        }${detail.movement}单经供需双方代表签字确认后， 将作为合同及发生业务往来的有效凭证，如已签合同，则成为该合同的组成部分。${
          detail.movement === '入库' ? '出库方' : '采购方'
        }须核对 以上产品规格、数量确认后可签字认可。`;
  const getAllPrice = () => {
    let price = 0;
    if (detail.record_category === '购销' && priceRule.filter(Boolean).length) {
      priceRule.forEach((element) => {
        price += element.all_price;
      });
    }
    return formatCurrency(price, 2);
  };
  const dobulePriceRule = [];
  if (isDouble && detail.record_category === '购销' && priceRule.filter(Boolean).length) {
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
  const renderRecord = (data, isDouble) => {
    const columns = isDouble ? ['left_', 'right_'] : [''];
    const page = data.map((item, index) => (
      <View key={index} style={styles.tableContent}>
        {columns.map((column, columnIndex) => (
          <React.Fragment key={columnIndex}>
            <Text style={styles.tableCell2}>{item[column + 'name']}</Text>
            <Text style={styles.tableCell}>
              {!item[column + 'count'] ? '' : formatQuantity(item[column + 'count'], 2) + item[column + 'unit']}
            </Text>
            <Text style={styles.tableCell}>
              {!item[column + 'total']
                ? ''
                : formatQuantity(item[column + 'total'], 2) + item[column + 'conversion_unit']}
            </Text>
            <Text style={!isDouble || column === 'right_' ? styles.tableCellLast : styles.tableCell}>
              {item[column + 'isExcluded']
                ? '不计入合同  ' + (item[column + 'comment'] || '')
                : item[column + 'comment'] || ''}
            </Text>
          </React.Fragment>
        ))}
      </View>
    ));
    let addCol = <></>;
    if (detail.record_category === '购销') {
      const allprice = getAllPrice();
      addCol = (
        <View style={styles.tableContent}>
          {columns.map((column, columnIndex) => (
            <React.Fragment key={columnIndex}>
              <Text style={styles.tableCell2}></Text>
              <Text style={styles.tableCell}>{column === 'left_' ? '' : '总金额'}</Text>
              <Text style={styles.tableCell}>{column === 'left_' ? '' : allprice}</Text>
              <Text style={!isDouble || column === 'right_' ? styles.tableCellLast : styles.tableCell}></Text>
            </React.Fragment>
          ))}
        </View>
      );
    }

    return detail.record_category === '购销' ? (
      <>
        {page}
        {addCol}
      </>
    ) : (
      page
    );
  };

  const renderPrice = (data, isDouble) => {
    const columns = isDouble ? ['left_', 'right_'] : [''];
    return data.map((item, index) => (
      <View key={index} style={styles.tableContent}>
        {columns.map((column, columnIndex) => (
          <React.Fragment key={columnIndex}>
            <Text style={styles.tableCell2}>{item[column + 'name']}</Text>
            <Text style={styles.tableCell}>
              {item[column + 'unit_price'] &&
                formatQuantity(item[column + 'unit_price'], 2) + '元/' + item[column + 'unit']}
            </Text>
            <Text style={styles.tableCell}>
              {item[column + 'count'] && formatQuantity(item[column + 'count'], 2)}
              {item[column + 'unit']}
            </Text>
            <Text style={styles.tableCell}>
              {item[column + 'all_price'] && formatCurrency(item[column + 'all_price'], 2)}
            </Text>
            <Text style={!isDouble || column === 'right_' ? styles.tableCellLast : styles.tableCell}>
              {item[column + 'comment'] || ''}
            </Text>
          </React.Fragment>
        ))}
      </View>
    ));
  };

  const projectPhone = detail.record_party_b.contacts?.map((item) => (item.name || '') + (item.phone || '')).join(' ');

  const car = detail.vehicles ? detail.vehicles.map((item) => item?.number).join(' ') : '';
  return (
    <Document>
      <Page size={paper || 'A4'} style={{ ...styles.page, marginTop: options.margingTop }}>
        {' '}
        {/**transform: `scale(${trans})` */}
        <Text style={styles.title}>{detail.contract_first_party?.name || '异常数据，请联系相关负责人！'}</Text>
        <Text style={styles.subTitle}>{detail.contract_first_party ? detail.movement : '盘点'}单</Text>
        <View style={styles.content}>
          <View style={styles.main}>
            {detail.record_category === '租赁' && (
              <View>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerLeftLeft}>承租单位：{detail.record_party_b.company.name || ''}</Text>
                  <Text style={styles.headerLeftRight}>
                    日期：{detail.record_date && dayjs(detail.record_date).format('YYYY-MM-DD')}
                  </Text>
                </View>

                <View style={styles.tableHeader}>
                  <Text style={styles.headerLeftLeft}>项目名称：{detail.record_party_b.name || ''}</Text>
                  <Text style={styles.headerLeftRight}>流水号：{detail.record_number}</Text>
                </View>

                <View style={styles.tableHeader}>
                  <Text style={styles.headerLeftLeft}>项目地址：{detail.record_party_b.address}</Text>
                  <Text style={styles.headerLeftRight}>原始单号：{detail.record_origin}</Text>
                </View>

                <View style={styles.tableHeader}>
                  <Text style={styles.headerLeftLeft}>项目联系人：{projectPhone}</Text>
                  <Text style={styles.headerLeftRight}>车号：{car}</Text>
                </View>
              </View>
            )}

            {detail.record_category === '购销' && (
              <View>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerLeftLeft}>
                    销售单位：{detail.record_party_b.company.name || ''} {detail.record_party_b.name || ''}
                  </Text>
                  <Text style={styles.headerMiddle}>
                    日期：{detail.record_date && dayjs(detail.record_date).format('YYYY-MM-DD')}
                  </Text>
                  <Text style={styles.headerLeftRight}>流水号：{detail.record_number}</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerLeftLeft}>采购单位：{detail.record_party_a.name || ''}</Text>
                  <Text style={styles.headerMiddle}>车号：{car}</Text>
                  <Text style={styles.headerLeftRight}>原始单号：{detail.record_origin}</Text>
                </View>
              </View>
            )}
            {!detail.record_category && (
              <View>
                <View style={styles.tableHeader}>
                  <Text style={styles.headerLeftLeft}>盘点单位：{detail.record_party_a.name || ''}</Text>
                  <Text style={styles.headerMiddle}>
                    日期：{detail.record_date && dayjs(detail.record_date).format('YYYY-MM-DD')}
                  </Text>
                  <Text style={styles.headerLeftRight}>流水号：{detail.record_number}</Text>
                </View>
              </View>
            )}

            {/* 定价 */}
            {detail.record_category === '购销' && (
              <View style={styles.tableContentTitle}>
                <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                <Text style={styles.tableCellTitle}>单价</Text>
                <Text style={styles.tableCellTitle}>数量</Text>
                <Text style={styles.tableCellTitle}>金额</Text>
                <Text style={!isDouble ? styles.tableCellTitleLast : styles.tableCellTitle}>备注</Text>
                {isDouble && (
                  <>
                    <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                    <Text style={styles.tableCellTitle}>单价</Text>
                    <Text style={styles.tableCellTitle}>数量</Text>
                    <Text style={styles.tableCellTitle}>金额</Text>
                    <Text style={styles.tableCellTitleLast}>备注</Text>
                  </>
                )}
              </View>
            )}
            {detail.record_category === '购销' && renderPrice(isDouble ? dobulePriceRule : priceRule, isDouble)}
            {/* ============================================================两表分割================================================================================= */}
            {/* 单列租金及费用 */}
            <View style={styles.tableContentTitle}>
              <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
              <Text style={styles.tableCellTitle}>数量</Text>
              <Text style={styles.tableCellTitle}>小计</Text>
              <Text style={!isDouble ? styles.tableCellTitleLast : styles.tableCellTitle}>备注</Text>
              {isDouble && (
                <>
                  <Text style={styles.tableCellLargeTitle}>物料名称及规格</Text>
                  <Text style={styles.tableCellTitle}>数量</Text>
                  <Text style={styles.tableCellTitle}>小计</Text>
                  <Text style={styles.tableCellTitleLast}>备注</Text>
                </>
              )}
            </View>
            {renderRecord(isDouble ? dobuleRecord : record, isDouble)}
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
              <Text style={styles.signPart}>制表人：{detail.nickname + ' ' + detail?.userPhone}</Text>
              {detail.record_category === '租赁' && <Text style={styles.signPart}>出租单位（签名）：</Text>}
              {detail.record_category === '租赁' && <Text style={styles.signPart}>租借单位（签名）：</Text>}
              {detail.record_category === '购销' && <Text style={styles.signPart}>采购单位（签名）：</Text>}
              {detail.record_category === '购销' && <Text style={styles.signPart}>购入单位（签名）：</Text>}
              {!detail.record_category && <Text style={styles.signPart}>盘点仓库（签名）：</Text>}
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
export const renderItV2 = async (rent: { detail: any; record: any[]; priceRule: any[]; options: any }) => {
  const url = 'https://shcx.daoyoucloud.com/admin';
  const imageUrl = await QRCode.toDataURL(url);
  return await renderToStream(<PreviewDocument imageUrl={imageUrl} {...rent} />);
};
