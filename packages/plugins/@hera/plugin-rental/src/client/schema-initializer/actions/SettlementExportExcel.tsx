import { message } from 'antd';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import * as QRCode from 'qrcode';

import { AddItemsCategory, Itemcategory, PromptText, RecordCategory } from '../../../utils/constants';
import { formatPercent } from '../../../utils/currencyUtils';
import { converDate } from '../../../utils/daysUtils';

export const excelDataHandle = (excelData) => {
  const { calc, contracts, result } = excelData;
  const partyB = contracts.partyB?.[0];
  const categoryCount = (itemCategory) => {
    let category = '';
    switch (itemCategory) {
      case RecordCategory.lease:
        category = '租赁';
        break;
      case RecordCategory.purchase:
        category = '购销';
        break;
      case RecordCategory.staging:
        category = '暂存';
        break;
      case RecordCategory.inventory:
        category = '盘点';
        break;
      default:
        category = itemCategory;
        break;
    }
    return category;
  };

  const addCategoryCount = (itemcategory) => {
    let category = '';
    switch (itemcategory) {
      case AddItemsCategory.rent:
        category = Itemcategory.rent;
        break;
      case AddItemsCategory.h_compensate:
        category = Itemcategory.h_compensate;
        break;
      case AddItemsCategory.n_compensate:
        category = Itemcategory.n_compensate;
        break;
      case AddItemsCategory.loadFreight:
        category = Itemcategory.loadFreight;
        break;
      case AddItemsCategory.maintenance:
        category = Itemcategory.maintenance;
    }
    return category;
  };

  /**
   * 第一栏合同信息
   */
  const nameRows = [
    {
      companyName: { name: '承租单位：', value: `${partyB?.name ?? ''}` },
      companyName1: { name: '合同编号：', value: `${contracts.project?.code ?? ''}` },
      rowId: '3',
    },
    {
      companyName: { name: '项目名称：', value: `${contracts.project?.name ?? ''}` },
      companyName1: { name: '签约时间：', value: `${converDate(contracts.date, 'YYYY-MM-DD')}` },
      rowId: '4',
    },
    {
      projectAddress: { name: '项目地址：', value: `${contracts?.project?.address ?? ''}` },
      endData: {
        name: '结算时间：',
        value: `${converDate(calc.start, 'YYYY-MM-DD')} 至 ${converDate(calc.end, 'YYYY-MM-DD')}`,
      },
      rowId: '5',
    },
    {
      projectAddress: {
        name: '项目联系人：',
        value: `${contracts?.project.contacts.map((contact) => contact.name + ' ' + contact.phone).join(' ')}`,
      },
      endData: { name: '经办人：', value: `${contracts.operator.nickname}` },
      rowId: '6',
    },
  ];
  //本期汇总表格第一行
  const table1Row = nameRows.length + 5;
  /**
   * 本期汇总
   */
  const table1 = {
    name: '本期汇总',
    ref: `A${table1Row}`,
    nameRow: true,
    headerRow: true,
    style: {
      theme: null,
    },
    columns: [
      {
        name: '租金',
        key: 'name',
      },
      {
        name: '维修人工',
        key: 'name',
      },
      {
        name: '无物赔偿',
        key: 'name',
      },
      {
        name: '有物赔偿',
        key: 'name',
      },
      {
        name: '装卸运费',
        key: 'name',
      },
      {
        name: '其他',
        key: 'name',
      },
      {
        name: '税率',
        key: 'name',
      },
      {
        name: '本期费用',
        key: 'name',
      },
      {
        name: '累计费用',
        key: 'name',
      },
      {
        name: '本期收款',
        key: 'name',
      },
      {
        name: '累计收款',
        key: 'name',
      },
    ],
    rows: [
      [
        parseFloat(calc.rent.toFixed(2)),
        parseFloat(calc.maintenance.toFixed(2)),
        parseFloat(calc.n_compensate.toFixed(2)),
        parseFloat(calc.h_compensate.toFixed(2)),
        parseFloat(calc.loadfreight.toFixed(2)),
        parseFloat(calc.other.toFixed(2)),
        formatPercent(calc.tax, 2),
        parseFloat(calc.current_expenses.toFixed(2)),
        parseFloat(calc.accumulate.toFixed(2)),
        parseFloat(calc.current_collection.toFixed(2)),
        parseFloat(calc.accumulate_collection.toFixed(2)),
      ],
    ],
  };
  //上期结存表格第一行
  const table2Row = table1Row + 4;
  /**
   * 上期结存
   */
  const table2 = {
    name: 'table2',
    ref: `A${table2Row}`,
    nameRows: true,
    style: { theme: null },
    columns: [
      {
        name: '物料名称',
        key: 'name',
      },
      {
        name: ' ',
        key: ' ',
      },
      {
        name: '费用类别',
        key: 'name',
      },
      {
        name: '单位',
        key: 'name',
      },
      {
        name: '订单数量',
        key: 'name',
      },
      {
        name: '出入库数量',
        key: 'name',
      },
      {
        name: '租赁单价',
        key: 'name',
      },
      {
        name: '天日',
        key: 'name',
      },
      {
        name: '租费金额',
        key: 'name',
      },
      {
        name: ' ',
        key: ' ',
      },
    ],
    rows: [],
  };
  calc.history?.forEach((value) => {
    const category = categoryCount(value.category);
    table2.rows.push([
      value.name,
      '',
      category,
      value.unit_name,
      parseFloat(value.item_count?.toFixed(2) || 0),
      parseFloat(value.count.toFixed(2)),
      parseFloat(value.unit_price.toFixed(5)),
      value.days,
      parseFloat(value.amount.toFixed(2)),
      '',
    ]);
  });

  //本期明细表格第一行
  const historyLength = calc.history ? calc.history.length : 0;
  const table3Row = table2Row + historyLength + 3;
  /**
   * 本期明细
   */
  const table3 = {
    name: 'table3',
    ref: `A${table3Row}`,
    nameRow: true,
    style: {
      theme: null,
    },
    columns: [
      {
        name: '产生日期',
        key: 'name',
      },
      {
        name: '出入库',
        key: 'name',
      },
      {
        name: '物质名称',
        key: 'name',
      },
      {
        name: '费用类别',
        key: 'name',
      },
      {
        name: '单位',
        key: 'name',
      },
      {
        name: '订单数量',
        key: 'name',
      },
      {
        name: '出入库数量',
        key: 'name',
      },
      {
        name: '租赁单价',
        key: 'name',
      },
      {
        name: '天日',
        key: 'name',
      },
      {
        name: '租金金额',
        key: 'name',
      },
    ],
    rows: [],
  };
  calc.list?.forEach((value) => {
    const category = categoryCount(value.category);
    if (!value.is_excluded) {
      table3.rows.push([
        converDate(value.date, 'YYYY-MM-DD'),
        value.movement === '-1' ? '出库' : value.movement === '1' ? '入库' : '出入库',
        value.name,
        category,
        value.unit_name,
        parseFloat(value.item_count?.toFixed(2) || 0),
        parseFloat(value.count.toFixed(2)),
        parseFloat(value.unit_price.toFixed(5)),
        value.days !== 0 ? value.days : '',
        parseFloat(value.amount.toFixed(2)),
      ]);
    }
  });

  //本期费用增补表格第一行
  const table4row = calc.addItems?.length ? table3Row + calc.list?.length + 3 : table3Row;
  /**
   * 本期费用增补
   */
  const table4 = {
    name: 'table4',
    ref: `A${table4row}`,
    nameRow: true,
    style: {
      theme: null,
    },
    columns: [
      {
        name: '时间',
        key: 'name1',
      },
      {
        name: ' ',
        key: ' ',
      },
      {
        name: '名称',
        key: ' ',
      },
      {
        name: ' ',
        key: 'name2',
      },
      {
        name: '类别',
        key: ' ',
      },
      {
        name: '金额',
        key: 'name3',
      },
      {
        name: ' ',
        key: ' ',
      },
      {
        name: '备注',
        key: 'name4',
      },
      {
        name: '  ',
        key: 'name5',
      },
      {
        name: ' ',
        key: ' ',
      },
    ],
    rows: [],
  };
  calc.addItems?.forEach((item) => {
    table4.rows.push([
      converDate(item.date, 'YYYY-MM-DD'),
      '',
      item.name,
      '',
      addCategoryCount(item?.category),
      parseFloat(item.amount.toFixed(2)),
      '',
      item.notes,
      '',
      '',
    ]);
  });

  //本期结存表格第一行
  const addItemLength = calc.addItems ? calc.addItems?.length : calc.list ? calc.list.length : 0;
  const table5Row = table4row + addItemLength + 3;
  /**
   * 本期结存
   */
  const table5 = {
    name: 'table5',
    ref: `A${table5Row}`,
    nameRow: true,
    style: {
      theme: null,
    },
    columns: [
      {
        name: '物料名称',
        key: 'name1',
      },
      {
        name: ' ',
        key: ' ',
      },
      {
        name: '单位 ',
        key: ' ',
      },
      {
        name: '订单数量 ',
        key: 'name2',
      },
      {
        name: '结存数量 ',
        key: 'name2',
      },
      {
        name: '物料名称 ',
        key: 'name3',
      },
      {
        name: ' ',
        key: ' ',
      },
      {
        name: '单位',
        key: 'name4',
      },
      {
        name: '订单数量',
        key: 'name5',
      },
      {
        name: '结存数量',
        key: 'name5',
      },
    ],
    rows: [],
  };
  let countNum = -1;
  calc.summary?.forEach((item, index) => {
    if (index < Math.round(calc.summary?.length / 2)) {
      countNum += 2;
      table5.rows.push([
        calc.summary[countNum - 1]?.name,
        '',
        calc.summary[countNum - 1]?.unit_name,
        calc.summary[countNum - 1] ? parseFloat(calc.summary[countNum - 1].item_count?.toFixed(2) || 0) : ' ',
        calc.summary[countNum - 1] ? parseFloat(calc.summary[countNum - 1].count.toFixed(2)) : ' ',
        calc.summary[countNum]?.name ?? '',
        '',
        calc.summary[countNum]?.unit_name ?? '',
        calc.summary[countNum] ? parseFloat(calc.summary[countNum]?.item_count?.toFixed(2) || 0) : '',
        calc.summary[countNum] ? parseFloat(calc.summary[countNum]?.count.toFixed(2)) : '',
      ]);
    }
  });
  //备注的所属行
  const summaryLength = calc.summary.length
    ? Math.round(calc.summary?.length / 2)
    : calc.addItems
      ? calc.addItems.length
      : 0;
  const notesRow = table5Row + summaryLength + 2;

  const footRows = [
    {
      companyName: { name: '制表人：' },
      companyName1: { name: '审核人：' },
      companyName2: { name: '验收人：' },
      rowId: notesRow + 2,
    },
    {
      companyName: { name: '承租单位项目经理：' },
      companyName1: { name: '材料负责人：' },
      companyName2: { name: '出租单位代表人：' },
      rowId: notesRow + 4,
    },
  ];
  return {
    table1,
    table2,
    table3,
    table4,
    table5,
    table1Row,
    table2Row,
    table3Row,
    table4row,
    table5Row,
    notesRow,
    nameRows,
    footRows,
    calc,
    contracts,
    result,
  };
};

const excelAddTable = (tablerow, tableHeaderText, ws, table) => {
  ws.getCell(`A${tablerow - 1}`).value = tableHeaderText;
  ws.mergeCells(`A${tablerow - 1}:J${tablerow - 1}`);
  ws.getCell(`A${tablerow - 1}`).alignment = { horizontal: 'center' };
  ws.getCell(`A${tablerow - 1}`).border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' },
  };
  ws.addTable(table);
  const row11 = ws.getRow(tablerow);
  row11.alignment = { horizontal: 'center' };
};

export const ExportToExcel = async (data) => {
  if (!data) return;
  const {
    table1,
    table2,
    table3,
    table4,
    table5,
    table1Row,
    table2Row,
    table3Row,
    table4row,
    table5Row,
    notesRow,
    nameRows,
    footRows,
    calc,
    contracts,
    result,
  } = excelDataHandle(data);
  const workBook = new ExcelJS.Workbook();
  workBook.views = [
    {
      x: 0,
      y: 0,
      width: 2000,
      height: 2000,
      firstSheet: 0,
      activeTab: 1,
      visibility: 'visible',
    },
  ];
  const ws = workBook.addWorksheet('Sheet1', {
    properties: { defaultColWidth: 15 },
    views: [{ showGridLines: false }],
  });
  const rows = ws.getRows(1, 10 + footRows[footRows.length - 1].rowId);
  rows.forEach((value) => {
    value.height = 20;
  });
  //设置表格边框
  const cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const CellBorder = (row) => {
    cols.forEach((value) => {
      if (value === 'A' && row === `${notesRow}`) {
        ws.getCell(`${value}${row}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
        };
      } else if ((value === 'B' || value === 'C' || value === 'D' || value === 'E') && row === `${notesRow}`) {
        ws.getCell(`${value}${row}`).border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      } else {
        ws.getCell(`${value}${row}`).border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }
    });
  };
  //设置表格表头
  ws.getCell('A1').value = `${contracts.partyA?.[0]?.name ?? `${PromptText.noContractedCompany}`}  对账单`;
  ws.mergeCells('A1:J1');
  ws.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };
  ws.getCell('A1').font = {
    size: 16,
  };
  const row = ws.getRow(1);
  row.height = 30;
  //设置第一行内容
  ws.getCell('A2').value = '客户各项费用明细';
  ws.mergeCells('A2:J2');
  ws.getCell('A2').alignment = { horizontal: 'center' };
  //设置表格上层合同信息
  nameRows.forEach((value) => {
    ws.getCell(`A${value?.rowId}`).value = value[Object.keys(value)[0]].name + value[Object.keys(value)[0]].value;
    ws.mergeCells(`A${value?.rowId}:F${value?.rowId}`);
    ws.getCell(`G${value?.rowId}`).value = value[Object.keys(value)[1]].name + value[Object.keys(value)[1]].value;
    ws.mergeCells(`G${value?.rowId}:J${value?.rowId}`);
  });

  //本期汇总
  ws.getCell(`A${table1Row - 1}`).value = '本期汇总';
  ws.mergeCells(`A${table1Row - 1}:J${table1Row - 1}`);
  ws.getCell(`A${table1Row - 1}`).alignment = { horizontal: 'center' };
  ws.getCell(`A${table1Row - 1}`).border = {
    bottom: { style: 'thin' },
  };
  ws.addTable(table1);
  const row9 = ws.getRow(table1Row + 1);
  row9.alignment = { horizontal: 'right' };
  const row8 = ws.getRow(table1Row);
  row8.alignment = { horizontal: 'center' };
  CellBorder(table1Row - 1);
  CellBorder(table1Row);
  CellBorder(table1Row + 1);
  ws.mergeCells(`A${table1Row + 2}:J${table1Row + 2}`);

  //设置上期结存表格
  excelAddTable(table2Row, '上期结存', ws, table2);
  const rows24 = ws.getRows(table2Row, calc.history ? calc.history?.length + 1 : 1);
  rows24.forEach((value) => {
    ws.mergeCells(`A${value['_number']}:B${value['_number']}`);
    ws.mergeCells(`I${value['_number']}:J${value['_number']}`);
    if (value['_number'] !== table2Row) {
      const row25 = ws.getRow(value['_number']);
      row25.alignment = { horizontal: 'right' };
    }
    CellBorder(value['_number']);
  });
  ws.getCell('K' + table2Row).border = {
    left: { style: 'thin' },
  };

  //设置本期明细
  excelAddTable(table3Row, '本期明细', ws, table3);
  const rows37 = ws.getRows(table3Row, calc.list ? calc.list?.length + 1 : 1);
  rows37.forEach((value) => {
    if (value['_number'] !== table3Row) {
      const row38 = ws.getRow(value['_number']);
      row38.alignment = { horizontal: 'right' };
    }
    CellBorder(value['_number']);
  });
  //设置本期费用增补
  if (calc.addItems?.length) {
    excelAddTable(table4row, '本期费用增补', ws, table4);
    const rows37 = ws.getRows(table4row, calc.addItems?.length + 1);
    rows37?.forEach((value) => {
      ws.mergeCells(`A${value['_number']}:B${value['_number']}`);
      ws.mergeCells(`C${value['_number']}:D${value['_number']}`);
      ws.mergeCells(`F${value['_number']}:G${value['_number']}`);
      ws.mergeCells(`H${value['_number']}:J${value['_number']}`);
      if (value['_number'] !== table4row) {
        const row38 = ws.getRow(value['_number']);
        row38.alignment = { horizontal: 'right' };
      }
      CellBorder(value['_number']);
    });
    ws.getCell('K' + table4row).border = {
      left: { style: 'thin' },
    };
  }

  //设置本期结存
  excelAddTable(table5Row, '本期结存', ws, table5);
  const rows1 = ws.getRows(
    table5Row,
    Math.round(calc.summary?.length / 2) ? Math.round(calc.summary?.length / 2) + 1 : 1,
  );
  CellBorder(table5Row);
  rows1?.forEach((value) => {
    ws.mergeCells(`A${value['_number']}:B${value['_number']}`);
    ws.mergeCells(`F${value['_number']}:G${value['_number']}`);
    if (value['_number'] !== table5Row) {
      const row38 = ws.getRow(value['_number']);
      row38.alignment = { horizontal: 'right' };
    }
    CellBorder(value['_number']);
  });
  ws.getCell('K' + table5Row).border = {
    left: { style: 'thin' },
  };
  //设置表格下方的备注区域
  const notesrow = ws.getRow(notesRow);
  notesrow.height = 61;
  notesrow.alignment = { vertical: 'top', wrapText: true };
  ws.mergeCells(`B${notesRow}:E${notesRow}`);
  ws.getCell(`B${notesRow}`).value =
    '承租单位收到租费单结算明细15日内未提异议即视为确认。请签字盖章后邮寄一份至' +
    contracts.project?.associated_company.address;
  ws.getCell(`F${notesRow}`).value = `
  备注:${contracts.project?.comment ?? ''}
  出租单位：${contracts.partyA?.[0]?.name ?? PromptText.noContractedCompany}`;
  ws.mergeCells(`F${notesRow}:J${notesRow}`);
  const url = 'http://985.so/bpw6g';
  const imageUrl = await QRCode.toDataURL(url);
  const imageId1 = workBook.addImage({
    base64: imageUrl,
    extension: 'png',
  });
  const imgRow = notesRow - 1 + 0.02;
  ws.addImage(imageId1, {
    tl: { col: 0.3, row: imgRow },
    ext: { width: 79, height: 79 },
    editAs: 'undefined',
  });
  CellBorder(notesRow);
  //设置底部签名区域
  footRows.forEach((value) => {
    ws.getCell(`A${value?.rowId}`).value = value[Object.keys(value)[0]].name;
    ws.mergeCells(`A${value?.rowId}:C${value?.rowId}`);
    ws.getCell(`D${value?.rowId}`).value = value[Object.keys(value)[1]].name;
    ws.mergeCells(`D${value?.rowId}:G${value?.rowId}`);
    ws.getCell(`H${value?.rowId}`).value = value[Object.keys(value)[2]].name;
    ws.mergeCells(`H${value?.rowId}:J${value?.rowId}`);
  });

  const buffer = await workBook.xlsx.writeBuffer();

  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  await saveAs(blob, `${contracts.name}-${calc.name}.xlsx`);
  await message.success('导出成功');
};
