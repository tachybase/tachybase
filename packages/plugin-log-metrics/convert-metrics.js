#!/usr/bin/env node

const http = require('http');

// 配置
const config = {
  host: 'localhost',
  port: 13015,
  endpoint: '/api/log-metrics:getTrackingMetricsForPrometheus',
};

// 获取 JSON 响应并转换为 Prometheus 格式
function convertJsonToPrometheus() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: config.host,
      port: config.port,
      path: config.endpoint,
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonResponse = JSON.parse(data);

          if (jsonResponse.success && jsonResponse.data) {
            // 检查是否是嵌套的 JSON 结构
            if (typeof jsonResponse.data === 'object' && jsonResponse.data.data) {
              // 嵌套结构：{data: {data: "prometheus_text", ...}}
              console.log(jsonResponse.data.data);
              resolve(jsonResponse.data.data);
            } else {
              // 直接结构：{data: "prometheus_text"}
              console.log(jsonResponse.data);
              resolve(jsonResponse.data);
            }
          } else {
            console.error('# ERROR: Failed to get metrics');
            console.error(`# ${jsonResponse.error || 'Unknown error'}`);
            reject(new Error(jsonResponse.error || 'Unknown error'));
          }
        } catch (error) {
          console.error('# ERROR: Failed to parse JSON response');
          console.error(`# ${error.message}`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error('# ERROR: Request failed');
      console.error(`# ${error.message}`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// 主函数
async function main() {
  try {
    await convertJsonToPrometheus();
  } catch (error) {
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = { convertJsonToPrometheus };
