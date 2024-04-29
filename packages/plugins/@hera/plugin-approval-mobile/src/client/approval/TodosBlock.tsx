import { BlockItem, SchemaComponent, css } from '@nocobase/client';
import { Divider, SearchBar, Space, Tabs } from 'antd-mobile';
import React, { useState } from 'react';
import { TabApplicantType } from './component/TabApplicantType';
import { TabTemplateType } from './component/TabTemplateType';
import { TabReachDataType } from './component/TabReachDataType';
import { TabBatchProcessingType } from './component/TabBatchProcessingType';
import { TabApprovalType } from './component/TabApprovalType';
import { TabReadingType } from './component/TabReadingType';
import { TabApprovalItem } from './component/TabApprovalItem';
import { useFieldSchema } from '@tachybase/schema';

export const TodosBlock = () => {
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
      <Tabs
        onChange={(key) => {
          props['approvalKey'] = key;
        }}
        style={{ '--title-font-size': '12px', backgroundColor: '#ffffff', marginTop: '10px' }}
      >
        <Tabs.Tab title="待处理" key="pending">
          <Space justify="evenly" style={spaceStyle}>
            {/* 模版类型 */}
            <TabTemplateType />
            {/* 申请人 */}
            <TabApplicantType />
            {/* 到达日期 */}
            <TabReachDataType />
            {/* 批量处理 */}
            <TabBatchProcessingType />
          </Space>
          <TabApprovalItem />
        </Tabs.Tab>
        <Tabs.Tab title="已处理" key="processed">
          <Space justify="evenly" style={spaceStyle}>
            {/* 阅读状态 */}
            <TabReadingType />
            {/* 审批状态 */}
            <TabApprovalType />
            {/* 模版类型 */}
            <TabTemplateType />
            {/* 申请人 */}
            <TabApplicantType />
            {/* 到达日期 */}
            <TabReachDataType />
          </Space>
          <TabApprovalItem />
        </Tabs.Tab>
        <Tabs.Tab title="抄送我" key="duplicate">
          <Space justify="evenly" style={spaceStyle}>
            {/* 阅读状态 */}
            <TabReadingType />
            {/* 审批状态 */}
            <TabApprovalType />
            {/* 模版类型 */}
            <TabTemplateType />
            {/* 申请人 */}
            <TabApplicantType />
            {/* 到达日期 */}
            <TabReachDataType />
          </Space>
          <TabApprovalItem />
        </Tabs.Tab>
      </Tabs>
    </BlockItem>
  );
};

const spaceStyle = { width: '100%', fontSize: '10px', color: '#8e8e8e' };
