CREATE OR REPLACE VIEW
  public.view_effect_contract_fee_items AS
SELECT
  ('C'::TEXT || contract_plan_fee_items.contract_id)::CHARACTER VARYING AS effect_contract_id,
  contract_plan_fee_items.id
FROM
  contract_plan_fee_items
WHERE
  contract_plan_fee_items.lease_item_id IS NULL
  AND contract_plan_fee_items.contract_id IS NOT NULL
UNION ALL
SELECT
  (
    'P'::TEXT || contract_plan_fee_items.contract_plan_id
  )::CHARACTER VARYING AS effect_contract_id,
  contract_plan_fee_items.id
FROM
  contract_plan_fee_items
WHERE
  contract_plan_fee_items.lease_item_id IS NULL
  AND contract_plan_fee_items.contract_plan_id IS NOT NULL;
