import * as React from 'react';

import { Document, Image, Page, renderToStream, StyleSheet, Text, View } from '@hera/plugin-core';
import _ from 'lodash';
import * as QRCode from 'qrcode';

import { Itemcategory, PromptText } from '../../utils/constants';
import { formatCurrency, formatPercent, formatQuantity } from '../../utils/currencyUtils';
import { converDate } from '../../utils/daysUtils';
import { mapIfHas } from '../../utils/mapUtils';

const fontSizes = {
  title: '12px',
  subTitle: '9px',
  main: '9px',
  side: '9px',
};
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFF',
    fontFamily: 'source-han-sans',
    fontWeight: 200,
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
    flex: 1,
  },
  headerRight: {
    width: '170px',
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
    borderBottom: '1px solid black',
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
    borderBottom: '1px solid black',
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
    border: '1px solid black',
    paddingLeft: '50px',
    marginLeft: '-1px',
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
    marginTop: '20px',
    flexDirection: 'row',
  },
  signPart: {
    flex: 1,
    fontSize: fontSizes.main,
  },
  spacing: {
    height: '8px',
  },
  cellInOut: {
    flex: '0 1 30px',
  },
  cellCategory: {
    flex: '0 1 40px',
  },
  cellUnit: {
    flex: '0 1 30px',
  },
  cellDays: {
    flex: '0 1 20px',
  },
  cellName: {
    flex: 1.5,
  },
});

const PreviewDocument = ({
  imageUrl,
  calc,
  contracts,
  result,
}: {
  imageUrl: string;
  calc: any;
  contracts: any;
  result: any;
}) => {
  // 汇总
  const group = {
    租金: calc.rent,
    维修人工: calc.maintenance ?? 0.0,
    无物赔偿: calc.n_compensate ?? 0.0,
    有物赔偿: calc.h_compensate ?? 0.0,
    装卸运费: calc.loadfreight ?? 0.0,
    其他: calc.other ?? 0.0,
    税率: calc.tax ?? 0.0,
    本期费用: calc.current_expenses ?? 0.0,
    累计费用: calc.accumulate ?? 0.0,
    本期收款: calc.current_collection ?? 0.0,
    累计收款: calc.accumulate_collection ?? 0.0,
  };
  const evenNumber = -1;
  let countNum = -1;
  const addItem = () => {
    if (calc.addItems?.length) {
      return (
        <>
          <View style={styles.spacing} />
          <View style={styles.tableContentTitle}>
            <Text style={[styles.tableCellTitle, styles.tableCellTitleLast]}>本期费用增补</Text>
          </View>
          <View style={styles.tableContentTitle}>
            <Text style={[styles.tableCellTitle, styles.cellName]}>时间</Text>
            <Text style={[styles.tableCellTitle, styles.cellName]}>名称</Text>
            <Text style={[styles.tableCellTitle, styles.cellCategory]}>费用类别</Text>
            <Text style={[styles.tableCellTitle]}>金额</Text>
            <Text style={[styles.tableCellTitleLast, styles.cellName]}>备注</Text>
          </View>
          {calc.addItems?.map((item) => {
            return (
              <View key={item.id} style={styles.tableContent} wrap={false}>
                <Text style={[styles.tableCell, styles.cellName]}>{converDate(item.date, 'YYYY-MM-DD')}</Text>
                <Text style={[styles.tableCell, styles.cellName]}>{item.name}</Text>
                <Text style={[styles.tableCell, styles.cellCategory]}>{mapIfHas(getAddCategory, item?.category)}</Text>
                <Text style={styles.tableCell}>{formatCurrency(item.amount, 2)}</Text>
                <Text style={[styles.tableCellLast, styles.cellName]}>{item.notes}</Text>
              </View>
            );
          })}
        </>
      );
    }
  };

  const partyA = contracts.partyA?.[0];
  const partyB = contracts.partyB?.[0];
  const settlementTitle = contracts.partyA?.[0].roles.includes('associated')
    ? contracts.partyA?.[0].name
    : contracts.partyB?.[0].name;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {settlementTitle ?? `${PromptText.noContractedCompany}`}
          对账单
        </Text>
        <Text style={styles.subTitle}>客户各项费用明细</Text>
        <View style={styles.content}>
          <View style={styles.main}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>
                承租单位：
                {partyB?.name}
              </Text>
              <Text style={styles.headerRight}>
                合同编号：
                {contracts.number}
              </Text>
            </View>
            <View style={styles.tableHeader}>
              <Text style={styles.headerLeft}>
                出租单位：
                {partyA?.name}
              </Text>
              <Text style={styles.headerRight}>签约时间：{converDate(contracts.date, 'YYYY-MM-DD')}</Text>
            </View>
            <view style={styles.tableHeader}>
              <Text style={styles.headerLeft}>
                项目名称：
                {contracts.project?.name}
              </Text>
              <Text style={styles.headerRight}>
                结算时间：{converDate(calc.start, 'YYYY-MM-DD')} 至 {converDate(calc.end, 'YYYY-MM-DD')}
              </Text>
            </view>
            <view style={styles.tableHeader}>
              <Text style={styles.headerLeft}>
                项目地址：
                {contracts.project?.address}
              </Text>
              <Text style={styles.headerRight}>
                项目联系人：
                {contracts.project?.contacts
                  .map((contact) => contact.name.toString() + ' ' + contact.phone.toString())
                  .join(' ')}
              </Text>
            </view>
            <View style={styles.spacing} />
            <View style={styles.tableContentTitle}>
              <Text style={[styles.tableCellTitle, styles.tableCellTitleLast]}>本期汇总</Text>
            </View>
            <View style={styles.tableContentTitle}>
              <Text style={styles.tableCellTitle}>租金</Text>
              <Text style={styles.tableCellTitle}>维修人工</Text>
              <Text style={styles.tableCellTitle}>无物赔偿</Text>
              <Text style={styles.tableCellTitle}>有物赔偿</Text>
              <Text style={styles.tableCellTitle}>装卸运费</Text>
              <Text style={styles.tableCellTitle}>其他</Text>
              <Text style={styles.tableCellTitle}>税率</Text>
              <Text style={styles.tableCellTitle}>本期费用</Text>
              <Text style={styles.tableCellTitle}>累计费用</Text>
              <Text style={styles.tableCellTitle}>本期收款</Text>
              <Text style={styles.tableCellTitleLast}>累计收款</Text>
            </View>
            <View style={styles.tableContent}>
              <Text style={styles.tableCell}>{formatCurrency(group['租金'], 2)}</Text>
              <Text style={styles.tableCell}>{formatCurrency(group['维修人工'], 2)}</Text>
              <Text style={styles.tableCell}>{formatCurrency(group['无物赔偿'], 2)}</Text>
              <Text style={styles.tableCell}>{formatCurrency(group['有物赔偿'], 2)}</Text>
              <Text style={styles.tableCell}>{formatCurrency(group['装卸运费'], 2)}</Text>
              <Text style={styles.tableCell}>{formatCurrency(group['其他'], 2)}</Text>
              <Text style={styles.tableCell}>{formatPercent(group['税率'], 2)}</Text>
              <Text style={styles.tableCell}>{formatCurrency(group['本期费用'], 2)}</Text>
              <Text style={styles.tableCell}>{formatCurrency(group['累计费用'], 2)} </Text>
              <Text style={styles.tableCell}>{formatCurrency(group['本期收款'], 2)}</Text>
              <Text style={styles.tableCellLast}>{formatCurrency(group['累计收款'], 2)}</Text>
            </View>
            <View style={styles.spacing} />
            <View style={styles.tableContentTitle} wrap={false}>
              <Text style={[styles.tableCellTitle, styles.tableCellTitleLast]}>上期结存</Text>
            </View>
            <View style={styles.tableContentTitle} wrap={false}>
              <Text style={[styles.tableCellTitle, styles.cellName]}>物料名称</Text>
              <Text style={[styles.tableCellTitle, styles.cellCategory]}>费用类别</Text>
              <Text style={[styles.tableCellTitle, styles.cellUnit]}>单位</Text>
              <Text style={styles.tableCellTitle}>订单数量</Text>
              <Text style={styles.tableCellTitle}>出入库数量</Text>
              <Text style={styles.tableCellTitle}>租赁单价</Text>
              <Text style={[styles.tableCellTitle, styles.cellDays]}>天日</Text>
              <Text style={styles.tableCellTitleLast}>租费金额</Text>
            </View>
            {calc.history?.map((item) => {
              return (
                <View key={item.id} style={styles.tableContent} wrap={false}>
                  <Text style={[styles.tableCell, styles.cellName]}>{item.name}</Text>
                  <Text style={[styles.tableCell, styles.cellCategory]}>{mapIfHas(getCategory, item.category)}</Text>
                  <Text style={[styles.tableCell, styles.cellUnit]}>{item.unit_name}</Text>
                  <Text style={styles.tableCell}>{formatQuantity(item.item_count, 2)}</Text>
                  <Text style={styles.tableCell}>{formatQuantity(item.count, 2)}</Text>
                  <Text style={styles.tableCell}>{formatCurrency(item.unit_price, 5)}</Text>
                  <Text style={[styles.tableCell, styles.cellDays]}>{item.days}</Text>
                  <Text style={styles.tableCellLast}>{formatCurrency(item.amount, 2)}</Text>
                </View>
              );
            })}
            <View style={styles.spacing} />
            <View style={styles.tableContentTitle}>
              <Text style={[styles.tableCellTitle, styles.tableCellTitleLast]}>本期明细</Text>
            </View>
            <View style={styles.tableContentTitle} wrap={false}>
              <Text style={styles.tableCellTitle}>产生日期</Text>
              <Text style={[styles.tableCellTitle, styles.cellInOut]}>出入库</Text>
              <Text style={[styles.tableCellTitle, styles.cellName]}>物料名称</Text>
              <Text style={[styles.tableCellTitle, styles.cellCategory]}>费用类别</Text>
              <Text style={[styles.tableCellTitle, styles.cellUnit]}>单位</Text>
              <Text style={styles.tableCellTitle}>订单数量</Text>
              <Text style={styles.tableCellTitle}>出入库数量</Text>
              <Text style={styles.tableCellTitle}>租赁单价</Text>
              <Text style={[styles.tableCellTitle, styles.cellDays]}>天日</Text>
              <Text style={styles.tableCellTitleLast}>租费金额</Text>
            </View>
            {calc.list?.map((item) => {
              if (item) {
                if (!item.is_excluded) {
                  return (
                    <View key={item.id} style={styles.tableContent} wrap={false}>
                      <Text style={styles.tableCell}>{converDate(item.date, 'YYYY-MM-DD')}</Text>
                      <Text style={[styles.tableCell, styles.cellInOut]}>
                        {item.movement === '-1' ? '出库' : item.movement === '1' ? '入库' : '出入库'}
                      </Text>
                      <Text style={[styles.tableCell, styles.cellName]}>{item.name}</Text>
                      <Text style={[styles.tableCell, styles.cellCategory]}>
                        {mapIfHas(getCategory, item.category)}
                      </Text>
                      <Text style={[styles.tableCell, styles.cellUnit]}>{item.unit_name}</Text>
                      <Text style={styles.tableCell}>{formatQuantity(item.item_count, 2)}</Text>
                      <Text style={styles.tableCell}>{formatQuantity(item.count, 2)}</Text>
                      <Text style={styles.tableCell}>{formatCurrency(item.unit_price, 5)}</Text>
                      <Text style={[styles.tableCell, styles.cellDays]}>{item.days !== 0 ? item.days : ''}</Text>
                      <Text style={styles.tableCellLast}>{formatCurrency(item.amount, 2)}</Text>
                    </View>
                  );
                }
              }
            })}
            {addItem()}
            <View style={styles.spacing} />
            <View style={styles.tableContentTitle}>
              <Text style={[styles.tableCellTitle, styles.tableCellTitleLast]}>本期结存</Text>
            </View>
            <View style={styles.tableContentTitle}>
              <Text style={styles.tableCellTitle}>物料名称</Text>
              <Text style={styles.tableCellTitle}>单位</Text>
              <Text style={styles.tableCellTitle}>订单数量</Text>
              <Text style={styles.tableCellTitle}>结存数量</Text>
              <Text style={styles.tableCellTitle}>物料名称</Text>
              <Text style={styles.tableCellTitle}>单位</Text>
              <Text style={styles.tableCellTitle}>订单数量</Text>
              <Text style={styles.tableCellTitleLast}>结存数量</Text>
            </View>
            {calc.summary?.map((item, index) => {
              countNum = countNum + 2;
              if (index < Math.round(calc.summary.length / 2)) {
                return (
                  <View key={item.name} style={styles.tableContent} wrap={false}>
                    <Text style={styles.tableCell}>{calc.summary[countNum - 1]?.name}</Text>
                    <Text style={styles.tableCell}>{calc.summary[countNum - 1]?.unit_name}</Text>
                    <Text style={styles.tableCell}>
                      {calc.summary[countNum - 1] ? formatQuantity(calc.summary[countNum - 1]?.item_count, 2) : ''}
                    </Text>
                    <Text style={styles.tableCell}>
                      {calc.summary[countNum - 1] ? formatQuantity(calc.summary[countNum - 1]?.count, 2) : ''}
                    </Text>
                    <Text style={styles.tableCell}>{calc.summary[countNum]?.name}</Text>
                    <Text style={styles.tableCell}>{calc.summary[countNum]?.unit_name}</Text>
                    <Text style={styles.tableCell}>
                      {calc.summary[countNum]?.item_count ? formatQuantity(calc.summary[countNum]?.item_count, 2) : ''}
                    </Text>
                    <Text style={styles.tableCellLast}>
                      {calc.summary[countNum]?.count ? formatQuantity(calc.summary[countNum]?.count, 2) : ''}
                    </Text>
                  </View>
                );
              }
            })}
            <View style={styles.spacing} />
            <View style={styles.tableFooter}>
              <View style={styles.tableFooterQr}>
                <Image src={imageUrl} />
              </View>
              <View style={styles.tableFooterLeft}>
                <Text>
                  承租单位收到租费单结算明细15日内未提异议即视为确认。请签字盖章后邮寄一份至
                  {contracts.project?.associated_company.address}
                </Text>
              </View>
              <View style={styles.tableFooterRight}>
                <Text>备注：{contracts.project?.comment}</Text>
                <Text>
                  出租单位：
                  {partyA?.name ?? `${PromptText.noContractedCompany}`}
                </Text>
              </View>
            </View>
            <View style={styles.sign}>
              <Text style={styles.signPart}>制表人： </Text>
              <Text style={styles.signPart}>审核人：</Text>
              <Text style={styles.signPart}>验收：</Text>
            </View>
            <View style={styles.sign}>
              <Text style={styles.signPart}>承租单位项目经理：</Text>
              <Text style={styles.signPart}>材料负责人： </Text>
              <Text style={styles.signPart}>出租单位代表人：</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export const renderIt = async (rent: { calc: any; contracts: any; result: any }) => {
  const url = 'http://985.so/bpw6g';
  const imageUrl = await QRCode.toDataURL(url);
  return await renderToStream(<PreviewDocument imageUrl={imageUrl} {...rent} />);
};

const getCategory = (type) => {
  const enums = {
    '0': '租赁',
    '1': '购销',
    '2': '暂存',
    '3': '盘点',
  };
  return enums[type];
};

const getAddCategory = (type) => {
  const enums = {
    '0': Itemcategory.rent,
    '1': Itemcategory.maintenance,
    '2': Itemcategory.n_compensate,
    '3': Itemcategory.h_compensate,
    '4': Itemcategory.loadFreight,
  };
  return enums[type];
};
