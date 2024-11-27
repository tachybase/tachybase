/**
 * 定义编辑器默认值
 */

// 默认组件代码
export const defaultReactCode = `import React from 'react';
import dayjs from 'dayjs';
import { Button, Card } from 'antd';

export default () => {
  const format = () => {
    return dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
  };
  return (
    <Card>
      <Button onClick={handleClick}>
        {config.props.text}
      </Button>
      <p>{format()}</p>
    </Card>
  );
};
`;

export const defaultMdCode = `# 云组件

## 介绍

这是一个云组件功能，支持属性配置，在线编译，在线预览，通过云组件可以满足更多个性化需求。

## 功能介绍
1. 在线开发
2. 代码格式化
3. 在线编译
4. 在线预览
5. 支持样式配置、属性配置

`;
