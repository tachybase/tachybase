import React from 'react';
import { RemoteSchemaComponent, SchemaComponentOptions } from '@tachybase/client';

import { MessageViewActionInitializer } from './components/MessageViewActionInitializer';
import { Message } from './deplicated/Message';
import { MessageTableActionColumnInitializer } from './initializers/MessageTableActionColumnInitializer';
import { MessageTableActionColumnInitializers } from './initializers/MessageTableActionColumnInitializers';
import { MessageBlockInitializer } from './MessageBlockInitializer';
import { MessageBlockProvider } from './MessageBlockProvider';
import { MessageSchemaComponent } from './MessageSchemaComponent';
import { SchemaComponentContextProvider } from './SchemaComponent.provider';

export const setMessageUid = (field) => {
  field.componentProps.messageId = field.record?.id;
  field.componentProps.read = field.record?.read;
  field.componentProps.uid = field.record?.schemaName;
};

export const setMessageDeleteDisabled = (field) => {
  field.componentProps.disabled = !field.record?.read;
};

export const MessageProvider = (props: any) => {
  return (
    <SchemaComponentOptions
      components={{
        Message,
        MessageBlockProvider,
        MessageBlockInitializer,
        MessageViewActionInitializer,
        MessageTableActionColumnInitializer,
        RemoteSchemaComponent,
        MessageSchemaComponent,
        SchemaComponentContextProvider,
      }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
};
