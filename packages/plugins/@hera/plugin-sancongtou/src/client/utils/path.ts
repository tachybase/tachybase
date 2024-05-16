interface ProductDetailParams {
  name?: string;
  collection: string;
  field: string;
  fieldParams: string;
}
export function getPathProductDetail(params: ProductDetailParams) {
  const { name = 'main', collection, field, fieldParams } = params;
  return `/mobile/${name}/${collection}/${field}`;
}
