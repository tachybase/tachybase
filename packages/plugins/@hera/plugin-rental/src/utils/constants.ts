export enum ConversionLogics {
  /**
   * 1 不换算
   */
  Keep = 1,
  /**
   * 3实际重量
   */
  ActualWeight = 3,
  /**
   * 2换算
   */
  Product = 2,
  /**
   * 4默认重量
   */
  ProductWeight = 4,
}

export enum RecordCategory {
  /**
   * 0租赁
   */
  lease = '0',
  /**
   * 1购销
   */
  purchase = '1',
  /**
   * 2暂存
   */
  staging = '2',
  /**
   * 3盘点
   */
  inventory = '3',
  /**
   * 4采购直发
   */
  purchase2lease = '4',
  /**
   * 5租赁直发
   */
  lease2lease = '5',
}

export enum AddItemsCategory {
  /**
   * 0 租金
   */
  rent = '0',
  /**
   * 维修人工
   */
  maintenance = '1',
  /**
   * 无物赔偿
   */
  n_compensate = '2',
  /**
   * 有物赔偿
   */
  h_compensate = '3',
  /**
   * 装卸运费
   */
  loadFreight = '4',
}

export enum SourcesType {
  /**
   * 0 人工录入
   */
  staff = '0',
  /**
   * 1 出库量
   */
  outbound = '1',
  /**
   * 2 入库量
   */
  inbound = '2',
  /**
   * 3 出入库量
   */
  inAndOut = '3',
  /**
   * 4 出库单数
   */
  outboundNumber = '4',
  /**
   * 5 入库单数
   */
  inboundNumber = '5',
  /**
   * 6 出入库单数
   */
  inAndOutNumber = '6',
}

export enum PromptText {
  noContractedCompany = '无签约公司，请联系管理员修改',
}

export enum Itemcategory {
  /**
   * 维修人工
   */
  maintenance = '维修人工',
  /**
   * 无物赔偿
   */
  n_compensate = '无物赔偿',
  /**
   * 有物赔偿
   */
  h_compensate = '有物赔偿',
  /**
   * 装卸运费
   */
  loadFreight = '装卸运费',
  /**
   * 租金
   */
  rent = '租金',
}

export enum countCource {
  /**
   * 0人工录入
   */
  artificial = '0',
  /**
   * 1出库产品数量
   */
  outProduct = '1',
  /**
   * 2入库产品数量
   */
  enterProduct = '2',
  /**
   * 3出入库产品数量
   */
  product = '3',
  /**
   * 4出库单数量
   */
  outItem = '4',
  /**
   * 5入库单数量
   */
  enterItem = '5',
  /**
   * 6出入库单数量
   */
  item = '6',
}

export enum Movement {
  /**
   * -1出库
   */
  out = '-1',
  /**
   * 1入库
   */
  in = '1',
}

export const PLUGIN_NAME = '@hera/plugin-core';

export enum settlementStatus {
  /**
   * 0需要计算
   */
  needCompute = '0',
  /**
   * 1需要重新计算
   */
  needReCompute = '1',
  /**
   * 2最新
   */
  latest = '2',
}

export enum CalcDateType {
  /**
   * 0: 计头不计尾
   */
  countHeads = '0',
  /**
   * 1: 计尾不计头
   */
  countTails = '1',
  /**
   * 2: 计头计尾
   */
  countHT = '2',
  /**
   * 3: 不计头不计尾
   */
  withoutHT = '3',
}

export enum RecordTypes {
  /**
   * 0: 采购直发
   */
  purchaseDirect = '0',
  /**
   * 1: 租赁直发
   */
  rentDirect = '1',
  /**
   * 2: 采购入库
   */
  purchaseInStock = '2',
  /**
   * 3: 销售出库
   */
  sellOutStock = '3',
  /**
   * 4: 租赁入库
   */
  rentInStock = '4',
  /**
   * 5: 租赁出库
   */
  rentOutStock = '5',
}

export const RulesNumber = 99999;
