import { Record } from './record';

export interface Waybill {
  side_information: string;
  driver: any;
  carrier: any;
  consignee_contact: any;
  in_stock: any;
  shipper_contact: any;
  out_stock: any;
  payee_account: any;
  payer: any;
  pay_date: Date;
  additional_cost: number;
  unit_price: number;
  weight_or_amount: number;
  arrival_date: Date;
  off_date: Date;
  pdfExplain: string;
  record: Record;
  comment: string;
}
