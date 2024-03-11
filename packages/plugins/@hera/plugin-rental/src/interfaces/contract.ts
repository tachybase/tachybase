import { RuleItem } from './rule';

export interface Contract {
  tax_rate: number;
  tax_included: any;
  rule_items: RuleItem[];
  calc_type: number;
}
