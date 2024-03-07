SELECT
  (
    SELECT
      waybills_explain
    FROM
      basic_configuration
  ) side_information,
  w.*,
  TO_JSONB(
    JSONB_SET(
      TO_JSONB(payer),
      '{company}',
      (
        SELECT
          TO_JSONB(c2)
        FROM
          company c2
        WHERE
          payer.company_id = c2.id
      )
    )
  ) AS payer, -- 付款方， 查公司company_id
  TO_JSONB(payee_account) AS payee_account, -- 收款方账号
  TO_JSONB(shipper_contact) AS shipper_contact, -- 发货方联系人
  TO_JSONB(consignee_contact) AS consignee_contact, -- 收货方联系人
  TO_JSONB(carrier) AS carrier, -- 承运商
  TO_JSONB(driver) AS driver, --司机
  TO_JSONB(
    JSONB_SET(
      TO_JSONB(in_stock),
      '{company}',
      (
        SELECT
          TO_JSONB(c)
        FROM
          company c
        WHERE
          in_stock.company_id = c.id
      )
    )
  ) AS in_stock,
  TO_JSONB(
    JSONB_SET(
      TO_JSONB(out_stock),
      '{company}',
      (
        SELECT
          TO_JSONB(c)
        FROM
          company c
        WHERE
          out_stock.company_id = c.id
      )
    )
  ) AS out_stock,
  TO_JSONB(records.*) || JSONB_BUILD_OBJECT(
    'items',
    (
      SELECT
        JSONB_AGG(
          TO_JSONB(record_items) || JSONB_BUILD_OBJECT(
            'product',
            TO_JSONB(product.*) || JSONB_BUILD_OBJECT('category', TO_JSONB(product_category.*))
          )
        )
      FROM
        record_items
        LEFT JOIN product ON record_items.product_id = product.id
        LEFT JOIN product_category ON product.category_id = product_category.id
      WHERE
        records.id = record_items.record_id
    ),
    'vehicles',
    (
      SELECT
        COALESCE(JSONB_AGG(v), '[]'::jsonb)
      FROM
        record_vehicles rv
        JOIN vehicles v ON rv.vehicle_id = v.id
      WHERE
        records.id = rv.record_id
    )
  ) AS record
FROM
  waybills w
  LEFT JOIN
  -- 	付款方
  project payer ON w.payer_id = payer.id
  LEFT JOIN
  -- 收款方账户
  account payee_account ON w.payee_account_id = payee_account.id
  LEFT JOIN
  -- 发货方联系人
  contacts shipper_contact ON w.shipper_contact_id = shipper_contact.id
  LEFT JOIN
  -- 收货方联系人
  contacts consignee_contact ON w.consignee_contact_id = consignee_contact.id
  LEFT JOIN
  -- 承运商
  company carrier ON w.carrier_id = carrier.id
  LEFT JOIN
  -- 司机
  contacts driver ON w.driver_id = driver.id
  JOIN
  -- 订单信息
  records ON w.record_id = records.id
  JOIN record_items ON record_items.record_id = w.record_id
  JOIN product ON product.id = record_items.product_id
  JOIN product_category ON product_category.id = product.category_id
  LEFT JOIN record_vehicles ON records.id = record_vehicles.record_id
  LEFT JOIN project in_stock ON records.in_stock_id = in_stock.id
  LEFT JOIN project out_stock ON records.out_stock_id = out_stock.id
WHERE
  w.id = :recordId
