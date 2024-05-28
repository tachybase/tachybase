import React, { useEffect, useState } from 'react';
import { BlockItem, ExtendCollectionsProvider } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { SearchBar, Space, Tabs } from 'antd-mobile';

import { TabApplicantType } from './component/TabApplicantType';
import { TabApprovalItem } from './component/TabApprovalItem';
import { TabApprovalType } from './component/TabApprovalType';

import '../style/style.css';

import { CollectionApprovals } from '../collection/Approvals.collection';
import { CollectionApprovalTodos } from '../collection/ApprovalTodos';
import { CollectionFlowNodes } from '../collection/FlowNodes.collection';
import { CollectionWorkflows } from '../collection/Workflows.collection';
import { ApprovalReachDataType } from '../component/ApprovalReachDataType';
import { ApprovalTemplateType } from '../component/ApprovalTemplateType';
import { PendingStatus, ProcessedStatus } from '../constants';

export const TodosBlock = observer((props) => {
  const [filter, setFilter] = useState({
    status: PendingStatus,
  });
  const [changeInputValue, setChangeInputValue] = useState('');
  const [input, setInput] = useState('');
  const changeFilter = (data) => {
    setFilter(data);
  };
  const filterProps = {
    ...props,
    filter,
    input,
    changeFilter,
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
          onChange={(value) => {
            if (!value) {
              setInput(value);
            }
            setChangeInputValue(value);
          }}
          value={changeInputValue}
          onSearch={(value) => {
            setInput(value);
          }}
        />
        <Tabs
          onChange={(key) => {
            const tabFilter = { status: PendingStatus };
            switch (key) {
              case 'pending':
                tabFilter['status'] = PendingStatus;
                break;
              case 'processed':
                tabFilter['status'] = ProcessedStatus;
                break;
              case 'duplicate':
                delete tabFilter['status'];
                break;
            }
            setChangeInputValue('');
            setInput('');
            setFilter(tabFilter);
          }}
          style={{ '--title-font-size': '12px', backgroundColor: '#ffffff', marginTop: '10px' }}
        >
          <Tabs.Tab title="待处理" key="pending">
            <Space justify="evenly" className="todosSpacStyle">
              {/* 模版类型 */}
              <ApprovalTemplateType {...filterProps} />
              {/* 申请人 */}
              <TabApplicantType {...filterProps} />
              {/* 到达日期 */}
              <ApprovalReachDataType {...filterProps} />
            </Space>
            <TabApprovalItem {...filterProps} />
          </Tabs.Tab>
          <Tabs.Tab title="已处理" key="processed">
            <Space justify="evenly" className="todosSpacStyle">
              {/* 审批状态 */}
              <TabApprovalType {...filterProps} />
              {/* 模版类型 */}
              <ApprovalTemplateType {...filterProps} />
              {/* 申请人 */}
              <TabApplicantType {...filterProps} />
              {/* 到达日期 */}
              <ApprovalReachDataType {...filterProps} />
            </Space>
            <TabApprovalItem {...filterProps} />
          </Tabs.Tab>
          <Tabs.Tab title="抄送我" key="duplicate">
            <Space justify="evenly" className="todosSpacStyle">
              {/* 审批状态 */}
              <TabApprovalType {...filterProps} />
              {/* 模版类型 */}
              <ApprovalTemplateType {...filterProps} />
              {/* 申请人 */}
              <TabApplicantType {...filterProps} />
              {/* 到达日期 */}
              <ApprovalReachDataType {...filterProps} />
            </Space>
            <TabApprovalItem {...filterProps} />
          </Tabs.Tab>
        </Tabs>
      </BlockItem>
    </ExtendCollectionsProvider>
  );
});
