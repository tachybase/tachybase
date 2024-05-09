CREATE OR REPLACE VIEW
  public.view_effect_contracts AS
SELECT
  contracts.name,
  ('S-'::TEXT || contracts.id)::CHARACTER VARYING AS id,
  contracts.id AS contract_id,
  ('C'::TEXT || contracts.id)::CHARACTER VARYING AS effect_contract_id,
  contracts.project_id,
  contracts.tax_rate,
  contracts.calc_type,
  contracts.tax_included,
  contracts.record_category,
  contracts.first_party_id,
  contracts.party_b_id,
  contracts.date_range,
  contracts.status,
  LOWER(contracts.date_range) AS start_date,
  UPPER(contracts.date_range) - '1 day'::INTERVAL AS end_date
FROM
  contracts
WHERE
  contracts.effectiveness::TEXT = '1'::TEXT
UNION ALL
SELECT
  (
    (contracts.name::TEXT || '-'::TEXT) || contract_plans.name::TEXT
  )::CHARACTER VARYING AS NAME,
  (
    (('L-'::TEXT || contracts.id) || '-'::TEXT) || contract_plans.id
  )::CHARACTER VARYING AS id,
  contracts.id AS contract_id,
  ('P'::TEXT || contract_plans.id)::CHARACTER VARYING AS effect_contract_id,
  contracts.project_id,
  contracts.tax_rate,
  contracts.calc_type,
  contracts.tax_included,
  contracts.record_category,
  contracts.first_party_id,
  contracts.party_b_id,
  contract_items.date_range,
  contracts.status,
  LOWER(contract_items.date_range) AS start_date,
  UPPER(contract_items.date_range) - '1 day'::INTERVAL AS end_date
FROM
  contracts
  JOIN contract_items ON contracts.id = contract_items.id
  JOIN contract_plans ON contract_plans.id = contract_items.contract_plan_id
WHERE
  contracts.effectiveness::TEXT = '0'::TEXT;
