CREATE OR REPLACE VIEW
  public.view_products AS
SELECT
  product.id,
  product.label,
  product.category_id,
  product.category_id AS raw_category_id,
  0 AS product_level,
  product.sort
FROM
  product
UNION
SELECT
  product_category.id + 99999 AS id,
  product_category.product_name::TEXT AS LABEL,
  product_category.id AS category_id,
  product_category.id AS raw_category_id,
  1 AS product_level,
  product_category.sort
FROM
  product_category;
