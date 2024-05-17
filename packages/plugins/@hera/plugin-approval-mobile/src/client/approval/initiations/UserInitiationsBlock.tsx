import { BlockItem, SchemaComponent, css } from '@tachybase/client';
import { Divider, SearchBar, Space, Tabs } from 'antd-mobile';
import React, { useState } from 'react';
import { useFieldSchema } from '@tachybase/schema';
import { ApprovalTemplateType } from './component/ApprovalTemplateType';
import { ApprovalStatus } from './component/ApprovalStatus';
import { ApprovalItem } from './component/ApprovalItem';
import { ApprovalReachDataType } from './component/ApprovalReachDataType';

export const UserInitiationsBlock = () => {
  const fieldSchema = useFieldSchema();
  fieldSchema['x-component-props'] = fieldSchema['x-component-props']?.['approvalKey']
    ? fieldSchema['x-component-props']
    : (() => {
        fieldSchema['x-component-props']['approvalKey'] = 'pending';
        return fieldSchema['x-component-props'];
      })();
  const props = fieldSchema['x-component-props'];
  return (
    <BlockItem>
      <SearchBar placeholder="搜索人名，标题、内容" clearable style={{ '--background': '#ffffff', padding: '10px' }} />
      <Space justify="evenly" style={spaceStyle}>
        {/* 模版类型 */}
        <ApprovalTemplateType />
        {/* 到达日期 */}
        <ApprovalReachDataType />
        {/* 审批状态 */}
        <ApprovalStatus />
      </Space>
      <ApprovalItem />
    </BlockItem>
  );
};

const spaceStyle = { width: '100%', fontSize: '10px', color: '#8e8e8e' };
