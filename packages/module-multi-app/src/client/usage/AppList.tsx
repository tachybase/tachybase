import { useCallback } from 'react';
import { MediaCard, useTableBlockContext } from '@tachybase/client';

import { Spin } from 'antd';

export const AppList = () => {
  const contextTableBlock = useTableBlockContext();
  const service = contextTableBlock?.service;
  const { data, loading } = service || {};

  if (loading) {
    return <Spin />;
  }

  const { data: appList } = data || {};
  console.log('%c Line:16 🍢 appList', 'font-size:18px;color:#ed9ec7;background:#465975', appList);

  return <div>{appList?.map((app) => <AppCard key={app.name} {...app} />)}</div>;
};

const AppCard = (props) => {
  const { cname, displayName, icon, color } = props;

  const handleClick = useCallback(() => {
    window.open(`https://${cname}`, '_blank');
  }, [cname]);

  return <MediaCard layout="vertical" title={displayName} icon={icon} color={color} onClick={handleClick} />;
};
