#!/usr/bin/env node

const http = require('http');
const net = require('net');

// 配置
const config = {
  host: 'localhost',
  port: 13015,
  endpoints: [
    '/api/log-metrics:getTrackingMetrics',
    '/api/log-metrics:getMetrics',
    '/api/log-metrics:getTrackingMetricsForPrometheus',
  ],
};

// 检查端口
function checkPort(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(3000);

    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });

    socket.connect(port, host);
  });
}

// 测试端点
function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const req = http.get(`http://${config.host}:${config.port}${endpoint}`, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          endpoint,
          statusCode: res.statusCode,
          contentType: res.headers['content-type'],
          dataLength: data.length,
        });
      });
    });

    req.on('error', (error) => {
      resolve({
        endpoint,
        error: error.message,
      });
    });

    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        endpoint,
        error: '请求超时',
      });
    });
  });
}

// 主函数
async function main() {
  console.log('🔍 检查 Tachybase 服务器状态...\n');

  // 1. 检查端口
  console.log('1. 检查服务器端口...');
  const portOpen = await checkPort(config.host, config.port);
  if (portOpen) {
    console.log(`✅ 端口 ${config.port} 开放`);
  } else {
    console.log(`❌ 端口 ${config.port} 未开放`);
    console.log('💡 请启动服务器: pnpm tachybase start');
    return;
  }

  // 2. 测试端点
  console.log('\n2. 测试端点...');
  for (const endpoint of config.endpoints) {
    const result = await testEndpoint(endpoint);

    console.log(`\n=== ${endpoint} ===`);
    if (result.error) {
      console.log(`❌ 错误: ${result.error}`);
    } else {
      console.log(`状态码: ${result.statusCode}`);
      console.log(`Content-Type: ${result.contentType || '未设置'}`);
      console.log(`数据长度: ${result.dataLength} 字符`);

      if (result.statusCode === 200) {
        console.log('✅ 端点正常');
        if (result.contentType && result.contentType.includes('text/plain')) {
          console.log('✅ Content-Type 正确');
        } else {
          console.log('⚠️  Content-Type 可能不正确');
        }
      } else if (result.statusCode === 503) {
        console.log('❌ 服务不可用 (503)');
      } else {
        console.log(`❌ 状态码: ${result.statusCode}`);
      }
    }
  }

  console.log('\n检查完成！');
}

main().catch(console.error);
