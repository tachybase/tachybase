import { RuleItem } from './rule';

export interface Company {
  name: string;
  roles: any[];
  address: string;
}

export interface Contract {
  tax_rate: number;
  tax_included: any;
  rule_items: RuleItem[];
  calc_type: number;
  party_a: Company;
  party_b: Company;
}
