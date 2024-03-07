export interface recordItems {
  id: number;
  sort: number;
  count: number;
  comment: string;
  product: product;
  createdAt: string;
  record_id: number;
  t_item_id: any;
  updatedAt: string;
  product_id: number;
  unit_price: any;
  createdById: number;
  updatedById: number;
  record_item_fee_items: record_fee_item[];
}

export interface product {
  id: number;
  name: string;
  sort: number;
  spec: string;
  label: string;
  ratio: number | null;
  weight: number | null;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  category_id: number;
  createdById: number;
  custom_name: string;
  updatedById: number;
  product_category: product_category;
}

export interface product_category {
  id: number;
  attr: string[];
  name: string;
  sort: number;
  unit: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  convertible: boolean;
  createdById: number;
  updatedById: number;
  product_name: string;
  conversion_unit: string;
}

export interface record_fee_item {
  product: product;
  id: number;
  sort: number;
  count: number;
  comment: string;
  fee_item: any[];
  createdAt: Date;
  record_id: number;
  updatedAt: Date;
  product_id: number;
  createdById: number;
  is_excluded: boolean;
  updatedById: number;
  record_item_id: number;
}
