SELECT
  r.number record_number,
  w.arrival_date, -- 到货日期
  w.off_date, -- 承运日期
  w.weight_or_amount, -- 吨/趟
  w.unit_price, -- 单价
  w.additional_cost, -- 附加金额
  w.pay_date, -- 付款日期
  w.comment,
  p."name" AS payer_name, -- 付款方
  c."name" AS payer_company, -- 付款方公司
  a."name" AS payee_account_name, -- 收款账户
  a."number" AS payee_account_number, -- 收款账户
  a.bank AS payee_account_bank, -- 收款名称
  p2.address AS shipper_address, -- 发货方
  p2."name" AS shipper_name, -- 发货方单位
  c3.name AS shipper_company, -- 发货方单位
  c4."name" AS shipper_contact, -- 发货方联系人
  c4.phone AS shipper_contact_phone, -- 发货方联系人
  c2."name" AS consignee_contact, -- 收款人
  p3.name AS consignee_name, -- 收货方单位
  p3.address AS consignee_address,
  c5."name" AS consignee_company, -- 收货方单位
  c6."name" AS consignee_contact, -- 收货人
  c6.phone AS consignee_contact_phone,
  c7.name AS carrier, -- 承运商
  c8.name AS driver, --	驾驶员
  c8.phone AS driver_phone,
  c8.id_card AS driver_idcard, --驾驶员
  (
    SELECT
      STRING_AGG(v.number::TEXT, ', ')
    FROM
      record_vehicles rv
      JOIN vehicles v ON rv.vehicle_id = v.id
    WHERE
      r.id = rv.record_id
  ) AS vehicles,
  (
    SELECT
      waybills_explain
    FROM
      basic_configuration
  ) side_information
FROM
  waybills w
  JOIN records r ON r.id = w.record_id
  LEFT JOIN record_contract rc ON r.id = rc.record_id
  LEFT JOIN project p ON w.payer_id = p.id
  LEFT JOIN company c ON p.company_id = c.id
  LEFT JOIN account a ON w.payee_account_id = a.id
  LEFT JOIN contacts c2 ON w.consignee_contact_id = c2.id
  JOIN project p2 ON r.out_stock_id = p2.id -- 发货方
  LEFT JOIN company c3 ON p2.company_id = c3.id
  LEFT JOIN contacts c4 ON w.shipper_contact_id = c4.id
  JOIN project p3 ON r.in_stock_id = p3.id -- 收货方
  LEFT JOIN company c5 ON p3.company_id = c5.id
  LEFT JOIN contacts c6 ON w.consignee_contact_id = c6.id
  LEFT JOIN company c7 ON w.carrier_id = c7.id
  LEFT JOIN contacts c8 ON w.driver_id = c8.id
WHERE
  w.id = :recordId
LIMIT
  1 --rc数量不为1
