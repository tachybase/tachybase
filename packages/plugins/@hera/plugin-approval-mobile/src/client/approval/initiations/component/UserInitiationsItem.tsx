import { BlockItem } from '@tachybase/client';
import { Space } from 'antd-mobile';
import React, { useState } from 'react';
import { observer } from '@tachybase/schema';
import { ApprovalTemplateType } from '../../component/ApprovalTemplateType';
import { ApprovalStatus } from './ApprovalStatus';
import { ApprovalItem } from './ApprovalItem';
import { ApprovalReachDataType } from '../../component/ApprovalReachDataType';
import '../../style/style.css';

export const UserInitiationsItem = observer((props) => {
  const [filter, setFilter] = useState([]);
  const changeFilter = (data) => {
    setFilter(data);
  };
  const filterProps = {
    ...props,
    filter,
    changeFilter,
  };
  return (
    <BlockItem>
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
  );
});
