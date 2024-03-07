import React from 'react';
import { ActionInitializer } from '@nocobase/client';

export const OutboundLinkActionInitializer = (props) => {
  const schema = {
    title: '外链',
    'x-action': 'outbound',
    'x-component': 'OutboundButton',
    'x-designer': 'Action.Designer',
    'x-component-props': {
      icon: 'ShareAltOutlined',
      useProps: '{{ useOutboundActionProps }}',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};
