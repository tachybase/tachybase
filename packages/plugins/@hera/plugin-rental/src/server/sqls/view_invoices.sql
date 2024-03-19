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
TYPE,
"Invoicing_date",
COMMENT,
inclusive_amount,
NAME,
CONTENT,
tax_rate,
tax_amount,
net_amount,
authentication_date,
state,
CASE
  WHEN "type"::TEXT = 'input_invoice'::TEXT THEN seller_id
  ELSE purchaser_id
END AS opposite_id,
CASE
  WHEN "type"::TEXT = 'input_invoice'::TEXT THEN purchaser_id
  ELSE seller_id
END AS company_id
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
TYPE,
"Invoicing_date",
COMMENT,
inclusive_amount,
NAME,
CONTENT,
tax_rate,
tax_amount,
net_amount,
authentication_date,
state,
CASE
  WHEN "type"::TEXT = 'input_invoice'::TEXT THEN seller_id
  ELSE purchaser_id
END AS opposite_id,
CASE
  WHEN "type"::TEXT = 'input_invoice'::TEXT THEN purchaser_id
  ELSE seller_id
END AS company_id
FROM
  invoice_output;
