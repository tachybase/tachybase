import { BlockItem, ExtendCollectionsProvider, SchemaComponent, css } from '@tachybase/client';
import { Divider, SearchBar, Space, Tabs } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import { observer, useFieldSchema } from '@tachybase/schema';
import { ApprovalTemplateType } from '../component/ApprovalTemplateType';
import { ApprovalStatus } from './component/ApprovalStatus';
import { ApprovalItem } from './component/ApprovalItem';
import { ApprovalReachDataType } from '../component/ApprovalReachDataType';
import '../style/style.css';
import { CollectionWorkflows } from '../collection/Workflows.collection';
import { CollectionFlowNodes } from '../collection/FlowNodes.collection';
import { CollectionApprovals } from '../collection/Approvals.collection';
import { CollectionApprovalTodos } from '../collection/ApprovalTodos';

export const UserInitiationsBlock = observer((props) => {
  const [filter, setFilter] = useState({});
  const fieldSchema = useFieldSchema();
  const changeFilter = (data) => {
    setFilter(data);
  };
  const filterProps = {
    ...props,
    changeFilter,
    filter,
  };
  return (
    <ExtendCollectionsProvider
      collections={[CollectionWorkflows, CollectionFlowNodes, CollectionApprovals, CollectionApprovalTodos]}
    >
      <BlockItem>
        <SearchBar
          placeholder="搜索人名，标题、内容"
          clearable
          style={{ '--background': '#ffffff', padding: '10px' }}
        />
        <Space justify="evenly" className="userInitiationsStyle">
          {/* 模版类型 */}
          <ApprovalTemplateType {...filterProps} />
          {/* 到达日期 */}
          <ApprovalReachDataType {...filterProps} />
          {/* 审批状态 */}
          <ApprovalStatus {...filterProps} />
        </Space>
        <ApprovalItem {...filterProps} />
      </BlockItem>
    </ExtendCollectionsProvider>
  );
});
