CREATE OR REPLACE VIEW
  public.view_products_search_rule_special AS
WITH RECURSIVE
  tree_nodes AS (
    SELECT
      id,
      ARRAY[id] AS parents
    FROM
      products
    WHERE
      "parentId" IS NULL
    UNION ALL
    SELECT
      t.id,
      tn.parents || t.id
    FROM
      products t
      JOIN tree_nodes tn ON t."parentId" = tn.id
  )
SELECT DISTINCT
  id,
  parents
FROM
  tree_nodes
