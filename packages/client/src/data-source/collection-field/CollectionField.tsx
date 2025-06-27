import React, { useEffect } from 'react';
import { connect, Field, merge, useField, useFieldSchema } from '@tachybase/schema';

import { useDeepCompareEffect } from 'ahooks';
import { concat } from 'lodash';

import { useFormBlockContext } from '../../block-provider/FormBlockProvider';
import { useCompile, useComponent } from '../../schema-component';
import { useIsAllowToSetDefaultValue } from '../../schema-settings/hooks/useIsAllowToSetDefaultValue';
import { CollectionFieldProvider, useCollectionField } from './CollectionFieldProvider';

type Props = {
  component: any;
  children?: React.ReactNode;
};

/**
 * @internal
 */
export const CollectionFieldInternalField = (props: Props) => {
  const { component } = props;
  const compile = useCompile();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { uiSchema: uiSchemaOrigin, defaultValue } = useCollectionField();
  console.log('%c Line:26 🥥 uiSchemaOrigin', 'font-size:18px;color:#ed9ec7;background:#93c0a4', uiSchemaOrigin);
  const { isAllowToSetDefaultValue } = useIsAllowToSetDefaultValue();
  const uiSchema = compile(uiSchemaOrigin);
  const Component = useComponent(component || uiSchema?.['x-component'] || 'Input');
  const setFieldProps = (key, value) => {
    field[key] = typeof field[key] === 'undefined' ? value : field[key];
  };
  const setRequired = () => {
    if (typeof fieldSchema['required'] === 'undefined') {
      field.required = !!uiSchema['required'];
    }
  };
  const ctx = useFormBlockContext();

  useEffect(() => {
    if (ctx?.field) {
      ctx.field.added = ctx.field.added || new Set();
      ctx.field.added.add(fieldSchema.name);
    }
  });
  useDeepCompareEffect(() => {
    if (!uiSchema) {
      return;
    }
    setFieldProps('content', uiSchema['x-content']);
    setFieldProps('title', uiSchema.title);
    setFieldProps('description', uiSchema.description);
    if (ctx?.form) {
      const defaultVal = isAllowToSetDefaultValue() ? fieldSchema.default || defaultValue : undefined;
      defaultVal !== null && defaultVal !== undefined && setFieldProps('initialValue', defaultVal);
    }

    if (!field.validator && (uiSchema['x-validator'] || fieldSchema['x-validator'])) {
      const concatSchema = concat([], uiSchema['x-validator'] || [], fieldSchema['x-validator'] || []);
      field.validator = concatSchema;
    }
    if (fieldSchema['x-disabled'] === true) {
      field.disabled = true;
    }
    if (fieldSchema['x-read-pretty'] === true) {
      field.readPretty = true;
    }
    setRequired();
    // @ts-ignore
    field.dataSource = uiSchema.enum;
    const originalProps = compile(uiSchema['x-component-props']) || {};
    const componentProps = merge(originalProps, field.componentProps || {});
    field.component = [Component, componentProps];
  }, [uiSchema]);
  if (!uiSchema) {
    return null;
  }
  return <Component {...props} />;
};

export const CollectionField = connect((props) => {
  const fieldSchema = useFieldSchema();
  return (
    <CollectionFieldProvider name={fieldSchema.name}>
      <CollectionFieldInternalField {...props} />
    </CollectionFieldProvider>
  );
});

CollectionField.displayName = 'CollectionField';
