import React from 'react';

import { AssigneesSelectCustom } from './AssigneesSelectCustom.view';
import { AssigneesSelectNormal } from './AssigneesSelectNormal';

// 添加审批人-选择器
export const AssigneesSelect = (props) => {
  if (typeof props.value === 'object' && props.value) {
    return <AssigneesSelectCustom {...props} />;
  } else {
    return <AssigneesSelectNormal {...props} />;
  }
};
