import { BlockItem, ExtendCollectionsProvider } from '@tachybase/client';
import { SearchBar, Space, Tabs } from 'antd-mobile';
import React, { useEffect, useState } from 'react';
import { TabApplicantType } from './component/TabApplicantType';
import { TabApprovalType } from './component/TabApprovalType';
import { TabApprovalItem } from './component/TabApprovalItem';
import { observer } from '@tachybase/schema';
import '../style/style.css';
import { ApprovalReachDataType } from '../component/ApprovalReachDataType';
import { ApprovalTemplateType } from '../component/ApprovalTemplateType';
import { PendingStatus, ProcessedStatus } from '../constants';
import { CollectionWorkflows } from '../collection/Workflows.collection';
import { CollectionFlowNodes } from '../collection/FlowNodes.collection';
import { CollectionApprovals } from '../collection/Approvals.collection';
import { CollectionApprovalTodos } from '../collection/ApprovalTodos';

export const TodosBlock = observer((props) => {
  const [tabValue, setTabValue] = useState('pending');
  const [filter, setFilter] = useState({});
  const changeFilter = (data) => {
    setFilter(data);
  };
  useEffect(() => {
    const changeTabs = { ...filter };
    switch (tabValue) {
      case 'pending':
        changeTabs['status'] = PendingStatus;
        break;
      case 'processed':
        changeTabs['status'] = ProcessedStatus;
        break;
      case 'duplicate':
        break;
    }
    setFilter(changeTabs);
  }, [tabValue]);
  const filterProps = {
    ...props,
    filter,
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
        />
        <Tabs
          onChange={(key) => {
            setFilter({});
            setTabValue(key);
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
