import React from 'react';

import { Input } from 'antd';
import _ from 'lodash';

export const IconFilterInput = (props) => {
  const { changeFilterKey } = props;
  const onChange = _.debounce((e) => {
    const inputValue = e.target.value;
    changeFilterKey(inputValue);
  }, 100);

  return <Input allowClear placeholder={`Antd的key,例如"ApiOutlined",忽略大小写`} onChange={onChange} />;
};
