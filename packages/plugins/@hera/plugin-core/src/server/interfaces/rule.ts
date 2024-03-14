import { Product } from './records';
import { ConversionLogics, countCource } from '../../utils/constants';

export interface FeeRule extends LeaseRule {
  id: number;
  product: Product;
  fee_product_id: number;
  count_source: countCource;
  unit: string;
  unit_name: string;
  product_id: number;
  unit_price: number;
  contract_rule_id: number;
  conversion_logic_id: number;
  alias: string;
}

export interface LeaseRule {
  unit_price: number;
  product_id?: number;
  conversion_logic_id: ConversionLogics;
  ucl: WeightRule;
  product_fee: any;
  products: any;
}

export interface Rule {
  fee_item: FeeRule[];
  lease_items: LeaseRule[];
}

export interface RuleItem {
  end_date: Date;
  start_date: Date;
  contract_rule_id: number;
  rule: Rule;
}

export interface WeightRule {
  weight_items: any[];
}