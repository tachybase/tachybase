import React from 'react';
import { Plugin, SchemaComponentOptions } from '@tachybase/client';

import { CustomRequestAction } from './components';
import { customRequestActionSettings } from './components/CustomRequestActionDesigner';
import { CustomRequestInitializer } from './initializer';
import { CustomRequestConfigurationFieldsSchema } from './schemas';
import { customizeCustomRequestActionSettings } from './schemaSettings';

const CustomRequestProvider: React.FC = (props) => {
  return (
    <SchemaComponentOptions
      scope={{
        CustomRequestConfigurationFieldsSchema,
      }}
      components={{ CustomRequestAction, CustomRequestInitializer }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
};

export class CustomRequestPlugin extends Plugin {
  async load() {
    this.app.use(CustomRequestProvider);
    this.app.schemaSettingsManager.add(customizeCustomRequestActionSettings);

    // @deprecated
    this.app.schemaSettingsManager.add(customRequestActionSettings);
  }
}

export default CustomRequestPlugin;
