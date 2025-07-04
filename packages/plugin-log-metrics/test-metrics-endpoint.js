#!/usr/bin/env node

const http = require('http');

// 测试配置
const config = {
  host: 'localhost',
  port: 13015,
  endpoints: [
    '/api/log-metrics:getTrackingMetrics',
    '/api/log-metrics:getMetrics',
    '/api/log-metrics:getTrackingMetricsForPrometheus',
  ],
};

async function testEndpoint(endpoint) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: config.host,
      port: config.port,
      path: endpoint,
      method: 'GET',
      headers: {
        Accept: 'text/plain',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const contentType = res.headers['content-type'];
        const statusCode = res.statusCode;

        console.log(`\n=== 测试端点: ${endpoint} ===`);
        console.log(`状态码: ${statusCode}`);
        console.log(`Content-Type: ${contentType}`);
        console.log(`响应长度: ${data.length} 字符`);
        console.log(`响应前100字符: ${data.substring(0, 100)}...`);

        if (contentType && contentType.includes('text/plain')) {
          console.log('✅ Content-Type 正确 (text/plain)');
        } else if (contentType && contentType.includes('application/json')) {
          console.log('✅ Content-Type 正确 (application/json) - 适用于 JSON 端点');
        } else {
          console.log('❌ Content-Type 错误，期望 text/plain 或 application/json');
        }

        if (statusCode === 200) {
          console.log('✅ 状态码正确 (200)');
        } else {
          console.log(`❌ 状态码错误，期望 200，实际 ${statusCode}`);
        }

        resolve({ endpoint, statusCode, contentType, dataLength: data.length });
      });
    });

    req.on('error', (error) => {
      console.error(`❌ 请求失败: ${error.message}`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

async function runTests() {
  console.log('开始测试 Prometheus metrics 端点...\n');

  for (const endpoint of config.endpoints) {
    try {
      await testEndpoint(endpoint);
    } catch (error) {
      console.error(`测试失败: ${error.message}`);
    }
  }

  console.log('\n测试完成！');
}

// 运行测试
runTests().catch(console.error);
