CREATE OR REPLACE VIEW
  public.view_records_contracts AS
SELECT
  c.id AS contract_id,
  r.id,
  r."number",
  r.has_receipt,
  r.has_stub,
  r."date",
  r.original_number,
  p2."name" AS contract_party,
  r."comment",
  r.all_price,
  r.weight,
  rc.movement,
  p."name" AS contract_project,
  (
    SELECT
      COALESCE(STRING_AGG(v."number", ' '), '')
    FROM
      record_vehicles rv
      JOIN vehicles v ON v.id = rv.vehicle_id
    WHERE
      rv.record_id = r.id
  ) AS vehicle_number
FROM
  records r
  JOIN record_contract rc ON rc.record_id = r.id
  JOIN contracts c ON c.id = rc.contract_id
  JOIN company c1 ON c1.id = c.first_party_id
  JOIN project p ON p.company_id = c1.id
  LEFT JOIN project p2 ON c.project_id = p2.id
UNION ALL
SELECT
  c.id AS contract_id,
  r.id,
  r."number",
  r.has_receipt,
  r.has_stub,
  r."date",
  r.original_number,
  p2."name" AS contract_party,
  r."comment",
  r.all_price,
  r.weight,
  CASE
    WHEN rc.movement = '1' THEN '-1'
    ELSE '1'
  END,
  p."name" AS contract_project,
  (
    SELECT
      COALESCE(STRING_AGG(v."number", ' '), '')
    FROM
      record_vehicles rv
      JOIN vehicles v ON v.id = rv.vehicle_id
    WHERE
      rv.record_id = r.id
  ) AS vehicle_number
FROM
  records r
  JOIN record_contract rc ON rc.record_id = r.id
  JOIN contracts c ON c.id = rc.contract_id
  JOIN company c1 ON c1.id = c.party_b_id
  JOIN project p ON p.company_id = c1.id
  LEFT JOIN project p2 ON c.project_id = p2.id
