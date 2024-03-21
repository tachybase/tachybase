CREATE OR REPLACE VIEW
  public.view_invoice_all AS
SELECT
  "createdAt",
  "updatedAt",
  "createdById",
  "updatedById",
  number,
  seller_id,
  purchaser_id,
  category,
  CAST('进项发票' AS TEXT) AS "type",
  "Invoicing_date",
  "comment",
  inclusive_amount,
  "name",
  "content",
  tax_rate,
  tax_amount,
  net_amount,
  authentication_date,
  "state",
  seller_id AS opposite_id,
  purchaser_id AS company_id,
  - CAST(tax_rate AS FLOAT8) AS sign_tax_rate,
  - CAST(tax_amount AS FLOAT8) AS sign_tax_amount,
  - CAST(net_amount AS FLOAT8) AS sign_net_amount
FROM
  invoice_input
UNION
SELECT
  "createdAt",
  "updatedAt",
  "createdById",
  "updatedById",
  number,
  seller_id,
  purchaser_id,
  category,
  CAST('销项发票' AS TEXT) AS "type",
  "Invoicing_date",
  "comment",
  inclusive_amount,
  "name",
  "content",
  tax_rate,
  tax_amount,
  net_amount,
  authentication_date,
  "state",
  purchaser_id AS opposite_id,
  seller_id AS company_id,
  CAST(tax_rate AS FLOAT8) AS tax_rate,
  CAST(tax_amount AS FLOAT8) AS tax_amount,
  CAST(net_amount AS FLOAT8) AS net_amount
FROM
  invoice_output
UNION
SELECT
  "createdAt",
  "updatedAt",
  "createdById",
  "updatedById",
  number,
  seller_id,
  purchaser_id,
  category,
  CAST('进项发票' AS TEXT) AS "type",
  "Invoicing_date",
  "comment",
  inclusive_amount,
  NULL AS "name",
  "content",
  '1' AS tax_rate,
  tax_amount,
  '0' AS net_amount,
  authentication_date,
  "state",
  seller_id AS opposite_id,
  purchaser_id AS company_id,
  - CAST(1 AS FLOAT8) AS sign_tax_rate,
  - CAST(tax_amount AS FLOAT8) AS sign_tax_amount,
  CAST(0 AS FLOAT8) AS sign_net_amount
FROM
  invoice_receipt
