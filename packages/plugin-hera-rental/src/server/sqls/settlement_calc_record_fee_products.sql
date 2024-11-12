SELECT
  r.id,
  r.date,
  r.number,
  r."date",
  rc.movement,
  rfi.is_excluded,
  rfi.count,
  p.name,
  p.id AS fee_product_id
FROM
  settlements s
  JOIN record_contract rc ON rc.contract_id = s.contract_id
  JOIN records r ON r.id = rc.record_id
  AND (s.end_date + INTERVAL '1 day - 1 millisecond') >= r.date
  JOIN record_fee_items rfi ON rfi.record_id = r.id
  JOIN products p ON p.id = rfi.new_product_id
WHERE
  s.id = :settlementsId
