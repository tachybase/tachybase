import React, { createContext, useContext, useRef, useState } from 'react';
import { PrinterOutlined } from '@ant-design/icons';
import {
  ActionInitializer,
  SchemaInitializer,
  SchemaInitializerItem,
  useApp,
  useSchemaInitializer,
  useSchemaInitializerItem,
} from '@tachybase/client';

const PDFViewerContext = createContext(null);

export const usePDFViewerRef = () => {
  const ref = useContext(PDFViewerContext);
  return ref;
};

export const PDFViewerProvider = (props) => {
  const ref = useRef(null);
  const app = useApp();
  const { decorator } = props;
  const Decorator = app.getComponent(decorator);
  if (Decorator) {
    return (
      <PDFViewerContext.Provider value={ref}>
        <Decorator>{props.children}</Decorator>
      </PDFViewerContext.Provider>
    );
  } else {
    return <PDFViewerContext.Provider value={ref}>{props.children}</PDFViewerContext.Provider>;
  }
};

export const usePDFViewerPrintActionProps = () => {
  const ref = usePDFViewerRef();
  return {
    onClick: async () => {
      (ref.current as any).print();
    },
  };
};

export const PDFViewerPrintActionInitializer = (props) => {
  const schema = {
    title: '{{ t("Print") }}',
    'x-action': 'print',
    'x-component': 'Action',
    'x-designer': 'Action.Designer',
    'x-component-props': {
      useProps: '{{ usePDFViewerPrintActionProps }}',
      icon: 'PrinterOutlined',
    },
  };
  return <ActionInitializer {...props} schema={schema} />;
};

export const pdfViewActionInitializer = new SchemaInitializer({
  name: 'PDFViewActionInitializer',
  title: 'Configure actions',
  icon: 'SettingOutlined',
  style: {
    marginLeft: 8,
  },
  items: [
    {
      name: 'enbaleActions',
      type: 'itemGroup',
      title: '{{t("Enable actions")}}',
      children: [
        {
          name: 'print',
          type: 'item',
          title: '{{t("Print")}}',
          component: 'PDFViewerPrintActionInitializer',
        },
        {
          name: 'edit',
          title: '{{t("Edit")}}',
          Component: 'UpdateActionInitializer',
          schema: {
            'x-component': 'Action',
            'x-decorator': 'ACLActionProvider',
            'x-component-props': {
              type: 'primary',
            },
          },
        },
      ],
    },
  ],
});

export const PDFViewerBlockInitializer = () => {
  const { insert } = useSchemaInitializer();
  const itemConfig = useSchemaInitializerItem();
  return (
    <SchemaInitializerItem
      {...itemConfig}
      icon={<PrinterOutlined />}
      onClick={() => {
        insert({
          type: 'void',
          'x-designer': 'Markdown.Void.Designer',
          'x-decorator': 'PDFViewerProvider',
          'x-decorator-props': {
            decorator: itemConfig.decorator ?? '',
          },
          'x-component': 'CardItem',
          properties: {
            actions: {
              type: 'void',
              'x-initializer': 'PDFViewActionInitializer',
              'x-component': 'ActionBar',
              'x-component-props': {},
              properties: {},
            },
            viewer: {
              type: 'void',
              'x-component': 'PDFViwer',
              'x-component-props': {
                target: itemConfig.target,
                usePdfPath: itemConfig.usePdfPath,
              },
            },
          },
        });
      }}
    />
  );
};
