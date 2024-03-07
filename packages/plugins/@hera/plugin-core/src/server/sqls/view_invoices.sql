CREATE OR REPLACE VIEW
  public.view_invoice AS
SELECT "createdAt",
    "updatedAt",
    sort,
    "createdById",
    "updatedById",
    id,
    seller_id,
    purchaser_id,
    category,
    type,
    "Invoicing_date",
    comment,
    number,
    inclusive_amount,
    name,
    conten,
    tax_rate,
    tax_amount,
    net_amount,
    authentication_date,
    state,
        CASE
            WHEN "type"::text = 'input_invoice'::text THEN seller_id
            ELSE purchaser_id
        END AS opposite_id,
        CASE
            WHEN "type"::text = 'input_invoice'::text THEN purchaser_id
            ELSE seller_id
        END AS company_id
   FROM invoice_new;
