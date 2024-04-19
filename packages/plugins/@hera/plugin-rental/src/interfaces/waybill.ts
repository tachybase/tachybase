import { Record } from './record';

export interface Waybill {
  record_number: string;
  weight_or_amount: number;
  off_date: Date;
  arrival_date: Date;
  unit_price: number;
  pay_date: Date;
  additional_cost: number;
  products: any[];
  payer_company: string;
  payer_name: string;
  payee_account_name: string;
  payee_account_bank: string;
  payee_account_number: string;
  shipper_company: string;
  shipper_name: string;
  shipper_contact_phone: string;
  shipper_address: string;
  consignee_company: string;
  consignee_contact_phone: string;
  consignee_address: string;
  consignee_name: string;
  comment: string;
  shipper_contact: string;
  carrier: string;
  driver: string;
  driver_idcard: string;
  vehicles: string;
  driver_phone: string;
  side_information: string;
  consignee_contact: string;
}
