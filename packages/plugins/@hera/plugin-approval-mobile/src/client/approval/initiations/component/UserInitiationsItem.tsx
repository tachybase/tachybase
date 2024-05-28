import React, { useState } from 'react';
import { BlockItem } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { Space } from 'antd-mobile';

import { ApprovalReachDataType } from '../../component/ApprovalReachDataType';
import { ApprovalTemplateType } from '../../component/ApprovalTemplateType';
import { ApprovalItem } from './ApprovalItem';
import { ApprovalStatus } from './ApprovalStatus';

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
