import { RecordCategory } from '../../utils/constants';
import { RecordItems, Record_fee_item } from './records';

export interface Record {
  weight_items: any;
  record_items: RecordItems[];
  systemTitle: any;
  record_lease_rules: any;
  weight: number;
  record_weight_items: any;
  in_stock: any;
  out_stock: any;
  contract: any;
  userPhone: string;
  nickname: string;
  comment: any;
  date: any;
  number: any;
  vehicles: any;
  original_number: any;
  movement: number;
  category: RecordCategory;
  record_fee_items: Record_fee_item[];
  pdfExplain: string;
}
