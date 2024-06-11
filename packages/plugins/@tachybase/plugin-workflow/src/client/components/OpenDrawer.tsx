import React, { useState } from 'react';
import { ActionContextProvider, SchemaComponent } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

export default function ({ component = 'div', children, ...props }) {
  const [visible, setVisible] = useState(false);
  const fieldSchema = useFieldSchema();
  return (
    <ActionContextProvider value={{ visible, setVisible, fieldSchema }}>
      {React.createElement(
        component,
        {
          ...props,
          onClick() {
            setVisible(true);
          },
        },
        children,
      )}
      <SchemaComponent schema={fieldSchema} onlyRenderProperties />
    </ActionContextProvider>
  );
}
