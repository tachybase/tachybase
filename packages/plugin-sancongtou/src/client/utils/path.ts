interface ProductDetailParams {
  name?: string;
  dataSource?: string;
  collection: string;
  id?: string;
}
export function getPathProductDetail(params: ProductDetailParams) {
  const { name = 'detail', dataSource = 'main', collection, id } = params;
  return `/mobile/${name}/${dataSource}/${collection}/${id}`;
}
