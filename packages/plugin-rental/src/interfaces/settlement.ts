import { Contract } from './contract';
import { Record } from './record';

export interface Settlement {
  settlement_summary_items: any[];
  settlement_items: any[];
  settlement_history_items: any[];
  settlement_add_items: any[];
  accumulate_collection: number;
  current_collection: number;
  tax: number;
  accumulate: number;
  loadfreight: number;
  h_compensate: number;
  n_compensate: number;
  other: number;
  maintenance: number;
  rent: number;
  current_expenses: number;
  settlements: Settlement[];
  end_date: Date;
  start_date: Date;
  records: Record[];
  contracts: Contract;
  contract_id: number;
  createdById: number;
  updatedById: number;
  createdAt: number;
  updatedAt: number;
  sort: number;
  name: number;
  free_date: any[];
}
