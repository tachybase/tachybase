import React, { createContext, useState } from 'react';
import { BlockProvider, useBlockRequestContext } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { Spin } from 'antd';

export const GroupBlockContext = createContext<any>({});

const InternalGroupBlockProvider = (props) => {
  const field = useField<any>();
  const { resource, service } = useBlockRequestContext();
  const [visible, setVisible] = useState(false);
  if (service.loading && !field.loaded) {
    return <Spin />;
  }
  field.loaded = true;
  return (
    <GroupBlockContext.Provider
      value={{
        props: {
          resource: props.resource,
        },
        field,
        service,
        resource,
        visible,
        setVisible,
      }}
    >
      {props.children}
    </GroupBlockContext.Provider>
  );
};

export const GroupBlockProvider = (props) => {
  const params = { ...props.params };
  return (
    <BlockProvider name="group" {...props} params={params}>
      <InternalGroupBlockProvider {...props} params={params} />
    </BlockProvider>
  );
};
