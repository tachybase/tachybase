import React, { useState } from 'react';
import { BlockItem } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { Space } from 'antd-mobile';

import { ApprovalReachDataType } from '../../component/ApprovalReachDataType';
import { ApprovalTemplateType } from '../../component/ApprovalTemplateType';
import { PendingStatus } from '../../constants';
import { useTodosContext } from '../provider/todosContext';
import { TabApplicantType } from './TabApplicantType';
import { TabApprovalItem } from './TabApprovalItem';
import { TabApprovalType } from './TabApprovalType';

import '../../style/style.css';

//审批-抄送我
export const TabDuplicateItem = observer((props) => {
  const [filter, setFilter] = useState({});
  const filterContext = useTodosContext();
  const changeFilter = (data) => {
    setFilter(data);
  };
  const filterProps = {
    ...props,
    filter,
    changeFilter,
  };
  if (filterContext['key'] === 'duplicate') {
    filterProps['input'] = filterContext['inputFilter'];
  }
  return (
    <BlockItem>
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
    </BlockItem>
  );
});
