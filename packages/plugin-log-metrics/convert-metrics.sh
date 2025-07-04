#!/bin/bash

# 配置
HOST="localhost"
PORT="13015"
ENDPOINT="/api/log-metrics:getTrackingMetricsForPrometheus"
URL="http://${HOST}:${PORT}${ENDPOINT}"

# 获取 JSON 响应并转换为 Prometheus 格式
convert_json_to_prometheus() {
    # 检查是否安装了 jq
    if ! command -v jq &> /dev/null; then
        echo "# ERROR: jq is not installed. Please install jq to parse JSON."
        echo "# Install on Ubuntu/Debian: sudo apt-get install jq"
        echo "# Install on CentOS/RHEL: sudo yum install jq"
        echo "# Install on macOS: brew install jq"
        exit 1
    fi

    # 获取 JSON 响应
    JSON_RESPONSE=$(curl -s -H "Accept: application/json" "$URL")

    # 检查 curl 是否成功
    if [ $? -ne 0 ]; then
        echo "# ERROR: Failed to fetch metrics from $URL"
        exit 1
    fi

    # 检查 JSON 响应是否成功
    SUCCESS=$(echo "$JSON_RESPONSE" | jq -r '.success // false')

    if [ "$SUCCESS" = "true" ]; then
        # 检查是否是嵌套的 JSON 结构
        NESTED_DATA=$(echo "$JSON_RESPONSE" | jq -r '.data.data // empty')
        if [ -n "$NESTED_DATA" ]; then
            # 嵌套结构：{data: {data: "prometheus_text", ...}}
            echo "$NESTED_DATA"
        else
            # 直接结构：{data: "prometheus_text"}
            echo "$JSON_RESPONSE" | jq -r '.data // "# ERROR: No data field found"'
        fi
    else
        # 输出错误信息
        ERROR_MSG=$(echo "$JSON_RESPONSE" | jq -r '.error // "Unknown error"')
        echo "# ERROR: Failed to get metrics"
        echo "# $ERROR_MSG"
        exit 1
    fi
}

# 主函数
main() {
    convert_json_to_prometheus
}

# 运行主函数
main "$@"
