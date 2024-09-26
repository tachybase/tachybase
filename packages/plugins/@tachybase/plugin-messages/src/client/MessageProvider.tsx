import React from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import { MessageViewActionInitializer } from './components/MessageViewActionInitializer';
import { Message } from './deplicated/Message';
import { MessageTableActionColumnInitializer } from './initializers/MessageTableActionColumnInitializer';
import { MessageBlockInitializer } from './MessageBlockInitializer';
import { MessageBlockProvider } from './MessageBlockProvider';

export const MessageProvider = (props: any) => {
  return (
    <SchemaComponentOptions
      components={{
        Message,
        MessageBlockProvider,
        MessageBlockInitializer,
        MessageViewActionInitializer,
        MessageTableActionColumnInitializer,
      }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
};
