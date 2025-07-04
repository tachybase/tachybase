#!/usr/bin/env node

const { convertJsonToPrometheus } = require('./convert-metrics');

async function testConversion() {
  console.log('🧪 测试 JSON 到 Prometheus 格式转换...\n');

  try {
    console.log('1. 获取 JSON 响应...');
    const prometheusData = await convertJsonToPrometheus();

    console.log('\n2. 转换结果:');
    console.log('='.repeat(50));
    console.log(prometheusData);
    console.log('='.repeat(50));

    console.log('\n✅ 转换成功！');
    console.log(`📊 数据长度: ${prometheusData.length} 字符`);

    // 检查是否包含 Prometheus 格式的特征
    if (prometheusData.includes('# HELP') || prometheusData.includes('# TYPE')) {
      console.log('✅ 包含 Prometheus 格式标记');
    } else {
      console.log('⚠️  可能不是标准的 Prometheus 格式');
    }

    if (prometheusData.includes('tachybase_')) {
      console.log('✅ 包含 Tachybase 指标');
    } else {
      console.log('⚠️  未找到 Tachybase 指标');
    }
  } catch (error) {
    console.error('\n❌ 转换失败:', error.message);
    process.exit(1);
  }
}

// 运行测试
testConversion();
