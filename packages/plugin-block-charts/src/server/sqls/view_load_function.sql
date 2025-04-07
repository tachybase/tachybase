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

CREATE
OR REPLACE FUNCTION format_timestamp_with_timezone (
  date_val TIME WITHOUT TIME ZONE,
  timezone_val TEXT,
  format_val TEXT
) RETURNS TEXT AS $$
BEGIN
    RETURN format_timestamp_with_timezone(
      NOW()::DATE + date_val, -- 把 time 转换为 timestamp
      timezone_val,
      format_val
    );
END;
$$ LANGUAGE plpgsql;

CREATE
OR REPLACE FUNCTION format_timestamp_with_timezone (date_val TEXT, timezone_val TEXT, format_val TEXT) RETURNS TEXT AS $$
DECLARE
    converted_timestamp TIMESTAMP WITH TIME ZONE;
    formatted_text TEXT;
BEGIN
    -- 解析输入格式
    IF date_or_time ~ '^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$' THEN
        -- 处理完整的 TIMESTAMP
        converted_timestamp := date_or_time::TIMESTAMP WITH TIME ZONE;
    ELSIF date_or_time ~ '^\d{2}:\d{2}:\d{2}$' THEN
        -- **修正的关键点**：确保 `DATE` 先转换为 `TIMESTAMP`
        converted_timestamp := (CURRENT_DATE::TIMESTAMP + date_or_time::TIME) AT TIME ZONE timezone_val;
    ELSE
        RAISE EXCEPTION 'Invalid date_or_time format. Use "YYYY-MM-DD HH24:MI:SS" or "HH24:MI:SS".';
    END IF;

    -- 格式化最终的时间
    formatted_text := to_char(converted_timestamp AT TIME ZONE timezone_val, format_val);

    RETURN formatted_text;
END;
$$ LANGUAGE plpgsql;
