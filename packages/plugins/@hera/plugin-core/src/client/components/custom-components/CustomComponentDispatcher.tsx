import { SchemaComponent, SchemaSettings, useApp, useDesignable, usePlugin } from '@tachybase/client';
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from '../../locale';
import { useField, useFieldSchema } from '@tachybase/schema';
import { Field } from '@tachybase/database';
import { useCustomComponent } from '../../hooks/useCustomComponent';
import { CustomComponentType } from './custom-components';
import { ErrorBoundaryFallBack } from './ErrorBoundary';

export const CustomComponentStub = (props) => {
  return <div>请选择组件</div>;
};

export const CustomComponentDispatcher = (props) => {
  if (!props.component) return;
  return (
    <ErrorBoundary fallback={<ErrorBoundaryFallBack />}>
      <SchemaComponent
        schema={{
          type: 'void',
          name: props.component,
          'x-component': props.component,
          'x-component-props': props,
        }}
      />
    </ErrorBoundary>
  );
};

export const customComponentDispatcherSettings = new SchemaSettings({
  name: 'customComponentDispatcherSettings',
  items: [
    {
      name: 'component',
      type: 'select',
      useComponentProps() {
        const formItemComponents = useCustomComponent(CustomComponentType.CUSTOM_FORM_ITEM);
        const { t } = useTranslation();
        const field = useField<Field>();
        const fieldSchema = useFieldSchema();
        const { dn } = useDesignable();
        return {
          title: t('component'),
          value: field.componentProps?.component || 'CustomComponentStub',
          options: [
            {
              label: '未选择组件',
              value: 'CustomComponentStub',
            },
            ...formItemComponents,
          ],
          onChange(component) {
            const schema = {
              ['x-uid']: fieldSchema['x-uid'],
            };
            fieldSchema['x-component-props']['component'] = component;
            fieldSchema['x-acl-ignore'] = true;
            schema['x-component-props'] = fieldSchema['x-component-props'];
            schema['x-acl-ignore'] = true;
            field.componentProps.component = component;
            dn.emit('patch', {
              schema,
            });
          },
        };
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'remove',
      type: 'remove',
      componentProps: {
        removeParentsIfNoChildren: true,
      },
    },
  ],
});
