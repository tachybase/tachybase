import { useMemo } from 'react';

import { Steps } from 'antd';

import { ViewStepTitle } from './ViewStepTitle';

export const AntdStepList = (props) => {
  const { items = [], current } = props;
  const stepItems = useMemo(
    () =>
      items.map((item, index) => ({
        title: <ViewStepTitle {...item} index={index} />,
      })),
    [items],
  );
  return <Steps className={''} current={current} items={stepItems} />;
};
