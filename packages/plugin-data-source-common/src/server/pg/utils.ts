export function showUniqueIndexes(tableInfo2) {
  return `
  SELECT
  tc.constraint_schema,
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  CASE WHEN (SELECT COUNT(*)
             FROM information_schema.key_column_usage kcu2
             WHERE kcu2.constraint_name = tc.constraint_name
               AND kcu2.table_schema = tc.constraint_schema) = 1 THEN TRUE
       ELSE FALSE END AS is_single_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_name = '"${tableInfo2.tableName}"'
  AND tc.table_schema = '${tableInfo2.schema || 'public'}'
ORDER BY tc.constraint_name, kcu.column_name;
  `;
}
