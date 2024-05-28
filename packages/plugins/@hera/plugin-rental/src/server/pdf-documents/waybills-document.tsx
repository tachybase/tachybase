import React from 'react';

import { Document, Page, renderToStream, StyleSheet, Text, View } from '@hera/plugin-core';

import { Waybill } from '../../interfaces/waybill';
import { formatCurrency, formatQuantity } from '../../utils/currencyUtils';
import { converDate } from '../../utils/daysUtils';

const boldFont = {
  fontFamily: 'source-han-sans',
  fontWeight: 600,
};

const fontSizes = {
  title: '13px',
  subTitle: '11px',
  main: '8px',
  side: '7px',
};
const styles = StyleSheet.create({
  titleSize: { fontSize: fontSizes.title },
  subTitleSize: { fontSize: fontSizes.subTitle },
  mainSize: { fontSize: fontSizes.main },
  sideSize: { fontSize: fontSizes.side },
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    fontFamily: 'source-han-sans',
    padding: '12px',
  },
  title: {
    textAlign: 'center',
    fontSize: fontSizes.title,
    ...boldFont,
  },
  titleBtm: {
    height: '10px',
  },
  content: {
    flexDirection: 'row',
    marginLeft: '10pt',
    marginRight: '10pt',
    border: '1px solid black',
  },
  tableContentTitle: {
    fontSize: fontSizes.main,
    flexDirection: 'row',
    borderBottom: '1px solid black',
    ...boldFont,
  },
  tableContentTitleItem: {
    fontSize: fontSizes.main,
    flexDirection: 'row',
    ...boldFont,
  },
  tableCellTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.subTitle,
    ...boldFont,
    borderRight: '1px solid black',
  },
  tableCellTitleItem: {
    flex: 1,
    textAlign: 'left',
    fontSize: fontSizes.main,
    ...boldFont,
  },
  tableFotterTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.subTitle,
    ...boldFont,
  },
  row2ContentTitle: {
    borderBottom: '1px solid black',
    ...boldFont,
  },
  row2Cell: {
    width: '100%',
    textAlign: 'center',
    fontSize: fontSizes.subTitle,
    ...boldFont,
  },
  tableCell2Title: {
    flex: 2,
    textAlign: 'center',
    fontSize: fontSizes.subTitle,
    ...boldFont,
    borderRight: '1px solid black',
  },
  tableCell2TitleLast: {
    flex: 2,
    textAlign: 'center',
    fontSize: fontSizes.subTitle,
    ...boldFont,
  },
  tableContent: {
    width: '100%',
    fontSize: fontSizes.main,
    flexDirection: 'row',
    borderBottom: '1px solid black',
  },
  tableContentPayment: {
    width: '100%',
    fontSize: fontSizes.main,
    flexDirection: 'row',
  },
  tableContentMerger: {
    width: '100%',
    fontSize: fontSizes.main,
    flexDirection: 'row',
    display: 'flex',
  },
  tableRow2TopLeft: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.subTitle,
    ...boldFont,
    borderRight: '1px solid black',
  },
  tableRow2BomLeft: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.subTitle,
    ...boldFont,
  },
  tableCellLeftLast: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSizes.subTitle,
    ...boldFont,
  },
  tableCell: {
    flex: 1,
    textAlign: 'left',
    fontSize: fontSizes.main,
    borderRight: '1px solid black',
  },
  tableCell3: {
    flex: 3,
    textAlign: 'left',
    fontSize: fontSizes.main,
    borderRight: '1px solid black',
    paddingRight: '2px',
  },
  tableCell6: {
    flex: 6,
    textAlign: 'left',
    fontSize: fontSizes.main,
    paddingLeft: '5px',
  },
  tableCellLast: {
    flex: 1,
    textAlign: 'left',
    fontSize: fontSizes.main,
  },
  IDCard: {
    flex: 1,
    textAlign: 'left',
    fontSize: '7px',
  },
  row2TableCellLast: {
    flex: 6,
    display: 'flex',
  },
  textPadding: {
    paddingLeft: '2px',
  },
  side: {
    width: '11px',
    fontSize: fontSizes.side,
  },
  main: {
    flex: 1,
    borderStyle: 'solid',
    borderRight: '1px solid black',
  },
});

/**
 *
 * @param
 * @returns
 */
const PreviewDocument = ({ waybill, settings }: { waybill: Waybill; settings: any }) => {
  // 运输单信息
  if (!waybill) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text style={styles.title}>暂无运输单信息</Text>
        </Page>
      </Document>
    );
  }
  // 单号
  const recordNumber = waybill.record.number;
  const items = (
    waybill.record.items
      ? waybill.record.items.map((item) => {
          const convertible = item.product.category.convertible;
          const data = {
            name: item.product.name + '/' + item.product.spec,
            count: item.count,
            unit: item.product.category.unit,
            conversion_unit: convertible ? item.product.category.conversion_unit : item.product.category.unit,
            sort: item.product.category.sort * 100000 + item.product.sort,
            total: formatQuantity(convertible ? item.count * item.product.ratio : item.count, 2),
          };
          return data;
        })
      : []
  ).sort((a, b) => a.sort - b.sort);

  const chunkedArray = Array.from({ length: Math.ceil(items.length / 3) }, (_, i) => {
    const chunk = items.slice(i * 3, i * 3 + 3);
    const updatedChunk = chunk.map((product) => {
      const totalInKg = parseFloat(product.total.replace(',', ''));
      const totalInTon = formatQuantity(totalInKg, 2);
      return { ...product, total: totalInTon };
    });
    return updatedChunk;
  });
  return (
    <Document>
      <Page size="A4" style={{ ...styles.page, marginTop: settings.margingTop }}>
        <Text style={styles.title}>货运运输协议</Text>
        <Text style={styles.titleBtm}></Text>
        <View style={styles.content}>
          <View style={styles.main}>
            {/* 表格第一行：tr */}
            <View style={styles.tableContentTitle}>
              {/* 里面是每一个：td/th */}
              <Text style={styles.tableCellTitle}>日期</Text>
              <Text style={styles.tableCellTitle}>承运日期</Text>
              <Text style={{ ...styles.tableCell, ...styles.textPadding }}>
                {converDate(waybill.off_date, 'YYYY-MM-DD')}
              </Text>
              <Text style={styles.tableCellTitle}>到货日期</Text>
              <Text style={{ ...styles.tableCell, ...styles.textPadding }}>
                {converDate(waybill.arrival_date, 'YYYY-MM-DD')}
              </Text>
              <Text style={styles.tableCellTitle}>单号</Text>
              <Text style={{ ...styles.tableCellLast, ...styles.textPadding }}>{recordNumber}</Text>
            </View>
            {/* 第二行标题 */}
            <View style={styles.row2ContentTitle}>
              <Text style={styles.row2Cell}>货物名称及数量</Text>
            </View>
            {/* 第二行 */}
            <View>
              {chunkedArray.map((item, index) => {
                return (
                  <View style={styles.tableContentTitleItem} key={index}>
                    <Text style={styles.tableCellTitleItem}>
                      {item[0]
                        ? `${item[0].name} x ${item[0].count}${item[0].unit} = ${item[0].total}${item[0].conversion_unit}`
                        : ''}
                    </Text>
                    <Text style={styles.tableCellTitleItem}>
                      {item[1]
                        ? `${item[1].name} x ${item[1].count}${item[1].unit} = ${item[1].total}${item[1].conversion_unit}`
                        : ''}
                    </Text>
                    <Text style={styles.tableCellTitleItem}>
                      {item[2]
                        ? `${item[2].name} x ${item[2].count}${item[2].unit} = ${item[2].total}${item[2].conversion_unit}`
                        : ''}
                    </Text>
                  </View>
                );
              })}
            </View>
            {/* 第三行 */}
            <View style={{ ...styles.tableContent, borderTop: '1px solid black' }}>
              <View style={styles.tableCellTitle}>
                <Text>运输费</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.textPadding}>{waybill.weight_or_amount || '**'}</Text>
              </View>
              <View style={styles.tableCellTitle}>
                <Text>吨/趟</Text>
              </View>
              <View style={styles.tableCellTitle}>
                <Text>
                  单价
                  <Text style={styles.mainSize}>{formatQuantity(waybill.unit_price, 2)} 元</Text>
                </Text>
              </View>
              <View style={styles.tableCellTitle}>
                <Text>
                  附加价格
                  <Text style={styles.mainSize}>
                    {formatQuantity(waybill.additional_cost, 2) === '0.00'
                      ? '0'
                      : formatQuantity(waybill.additional_cost, 2)}
                    元
                  </Text>
                </Text>
              </View>
              <View style={styles.tableCellTitle}>
                <Text>金额</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text style={styles.textPadding}>
                  {formatQuantity(
                    (waybill.weight_or_amount || 0) * (waybill.unit_price || 1) + (waybill.additional_cost || 0),
                    2,
                  ) + '元'}
                </Text>
              </View>
            </View>
            {/* 第四行 */}
            <View style={styles.tableContentPayment}>
              <View style={{ ...styles.tableCellTitle }}>
                <Text>付款方式及</Text>
              </View>
              <View style={{ ...styles.tableCellTitle, borderBottom: '1px solid black' }}>
                <Text>付款日期</Text>
              </View>
              <View
                style={{ ...styles.tableCellTitle, flex: '2', borderBottom: '1px solid black', paddingRight: '1px' }}
              >
                <Text>付款方</Text>
              </View>
              <View style={{ ...styles.tableCellTitle, borderBottom: '1px solid black' }}>
                <Text>收款人</Text>
              </View>
              <View
                style={{ ...styles.tableCellLeftLast, flex: '2', borderBottom: '1px solid black', paddingRight: '1px' }}
              >
                <Text>收款人账号</Text>
              </View>
            </View>
            {/* 第四/五行 */}
            <View style={styles.tableContent}>
              <View style={styles.tableCellTitle}>
                <Text>收款人信息</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.textPadding}>
                  {waybill.pay_date ? converDate(waybill.pay_date, 'YYYY-MM-DD') : ''}
                </Text>
              </View>
              <View style={{ ...styles.tableCell, flex: '2', paddingRight: '1px' }}>
                <Text style={styles.textPadding}>
                  {waybill.payer?.company?.name} {waybill.payer?.name}
                </Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.textPadding}>{waybill.payee_account?.name}</Text>
              </View>
              <View style={{ ...styles.tableCellLast, flex: '2', paddingRight: '1px' }}>
                <Text style={styles.textPadding}>
                  {waybill.payee_account?.bank} {waybill.payee_account?.number}
                </Text>
              </View>
            </View>
            {/* 第六行 */}
            <View style={styles.tableContent}>
              <Text style={styles.tableCellTitle}>说明</Text>
              <View style={styles.tableCell6}>
                <Text>{waybill.comment ?? ''} 本协议一式三联，三方各执一份，单价及吨位按签字确认付款</Text>
              </View>
            </View>
            {/* 第七行 */}
            <View style={styles.tableContentPayment}>
              <Text style={styles.tableCellTitle}>发货方单位</Text>
              <View style={{ ...styles.tableCell3, borderBottom: '1px solid black' }}>
                <Text style={styles.textPadding}>
                  {waybill.out_stock?.company?.name} {waybill.out_stock?.name}
                </Text>
              </View>
              <View style={{ ...styles.tableCell, borderBottom: '1px solid black' }}>
                <Text style={styles.textPadding}>{waybill.shipper_contact?.name}</Text>
              </View>
              <View style={{ ...styles.tableCell, borderBottom: '1px solid black' }}>
                <Text style={styles.textPadding}> {waybill.shipper_contact?.phone}</Text>
              </View>
              <Text style={styles.tableCellLast}></Text>
            </View>
            {/* 第八行 */}
            <View style={styles.tableContent}>
              <Text style={styles.tableCellTitle}>发货方地址</Text>
              <View style={styles.tableCell3}>
                <Text style={styles.textPadding}>{waybill.out_stock?.address}</Text>
              </View>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCellLast}></Text>
            </View>
            {/* 第九行 */}
            <View style={styles.tableContentPayment}>
              <View style={styles.tableCellTitle}>
                <Text>收货方单位</Text>
              </View>
              <View style={{ ...styles.tableCell3, borderBottom: '1px solid black' }}>
                <Text style={styles.textPadding}>
                  {waybill.in_stock?.company?.name} {waybill.in_stock?.name}
                </Text>
              </View>
              <View style={{ ...styles.tableCell, borderBottom: '1px solid black' }}>
                <Text style={styles.textPadding}>{waybill.consignee_contact?.name}</Text>
              </View>
              <View style={{ ...styles.tableCell, borderBottom: '1px solid black' }}>
                <Text style={styles.textPadding}>{waybill.consignee_contact?.phone}</Text>
              </View>
              <Text style={styles.tableCellLast}></Text>
            </View>
            {/* 第十行 */}
            <View style={styles.tableContent}>
              <Text style={styles.tableCellTitle}>收货方地址</Text>
              <View style={styles.tableCell3}>
                <Text style={styles.textPadding}>{waybill.in_stock?.address}</Text>
              </View>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCell}></Text>
              <Text style={styles.tableCellLast}></Text>
            </View>
            {/* 第十一行 */}
            <View style={styles.tableContentPayment}>
              <Text style={styles.tableCellTitle}>承运方单位</Text>
              <View style={{ ...styles.tableCell3, borderBottom: '1px solid black' }}>
                <Text style={styles.textPadding}>{waybill.carrier?.name}</Text>
              </View>
              <Text style={{ ...styles.tableCell, borderBottom: '1px solid black' }}></Text>
              <Text style={{ ...styles.tableCell, borderBottom: '1px solid black' }}></Text>
              <Text style={styles.tableCellLast}></Text>
            </View>
            {/* 第十二行 */}
            <View style={styles.tableContentPayment}>
              <Text style={styles.tableCellTitle}>驾驶员</Text>
              <View style={styles.tableCell}>
                <Text style={styles.textPadding}>{waybill.driver?.name}</Text>
              </View>
              <Text style={styles.tableCellTitle}>身份证</Text>
              <Text style={styles.tableCell}>{waybill.driver?.id_card}</Text>
              <View style={styles.tableCell}>
                <Text style={styles.textPadding}>{waybill.record.vehicles.map((item) => item?.number).join(' ')}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.textPadding}>{waybill.driver?.phone}</Text>
              </View>
              <Text style={styles.tableCellLast}></Text>
            </View>
          </View>
          <View style={styles.side}>
            <Text>{waybill.side_information}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
export const renderWaybill = async (waybill: Waybill, settings = null) => {
  return await renderToStream(<PreviewDocument waybill={waybill} settings={settings} />);
};
