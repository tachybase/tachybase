import React from 'react';
import { SchemaComponent } from '@tachybase/client';

import { Spin } from 'antd';

import { useProps } from './MessageDetail.props';

export const ViewMessageDetail = (props) => {
  const { schemaData, loading, handleSchemaChange } = useProps(props);

  if (loading) {
    return <Spin />;
  }
  return (
    <SchemaComponent
      schema={schemaData as any}
      scope={{
        // 用户界面组件的自定义实现, 功能是获取具体数据, 用 form set 进去
        usePropsShowDetail: () => ({}),
      }}
      memoized={true}
      onChange={handleSchemaChange}
    />
  );
};
