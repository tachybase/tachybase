-- dialect: postgres
CREATE
OR REPLACE FUNCTION format_timestamp_with_timezone (
  date_val TIMESTAMP WITH TIME ZONE,
  timezone_val TEXT,
  format_val TEXT
) RETURNS TEXT AS $$
DECLARE
    formatted_text text;
BEGIN
    -- 使用 to_char 函数进行格式化
    SELECT to_char(date_val AT TIME ZONE timezone_val, format_val) INTO formatted_text;

    -- 返回格式化后的字符串
    RETURN formatted_text;
END;
$$ LANGUAGE plpgsql;
