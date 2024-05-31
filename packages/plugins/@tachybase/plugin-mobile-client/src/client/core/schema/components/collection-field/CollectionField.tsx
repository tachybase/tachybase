import React, { useEffect, useMemo } from 'react';
import {
  CollectionFieldProvider,
  useCollectionField,
  useCollectionManager,
  useCollectionManager_deprecated,
  useCompile,
  useComponent,
  useFormBlockContext,
  useIsAllowToSetDefaultValue,
} from '@tachybase/client';
import { connect, Field, merge, useField, useFieldSchema } from '@tachybase/schema';

import { concat } from 'lodash';

import { canMobileField } from '../../CustomComponent';
import { useIsMobile } from '../../hooks';

type Props = {
  component: any;
  children?: React.ReactNode;
};

/**
 * TODO: 初步适配
 * @internal
 */
export const CollectionFieldInternalField: React.FC = (props: Props) => {
  const { component } = props;
  const compile = useCompile();
  const field = useField<Field>();
  const fieldSchema = useFieldSchema();
  const { getCollectionJoinField, getCollection } = useCollectionManager_deprecated();
  const { uiSchema: uiSchemaOrigin, defaultValue } = useCollectionField();
  const { isAllowToSetDefaultValue } = useIsAllowToSetDefaultValue();
  const uiSchema = useMemo(() => compile(uiSchemaOrigin), [JSON.stringify(uiSchemaOrigin)]);

  const isMobile = useIsMobile();
  const currModel = getCurrModel({ getCollectionJoinField, getCollection, fieldSchema, uiSchema });
  const Component = useComponent(component || uiComponent(isMobile, uiSchema, currModel) || 'Input');

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
  // TODO: 初步适配
  useEffect(() => {
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
  }, [JSON.stringify(uiSchema)]);
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

export const uiComponent = (isMobile, uiSchema, currMode?) => {
  const isMobileComponent = canMobileField(currMode || uiSchema['x-component']);
  if (isMobile && isMobileComponent) {
    return isMobileComponent;
  } else {
    return uiSchema['x-component'];
  }
};

export const getCurrModel = ({ getCollectionJoinField, getCollection, fieldSchema, uiSchema }) => {
  const collectionField = getCollectionJoinField(fieldSchema['x-collection-field']);
  const isFileCollection = getCollection(collectionField?.target)?.template === 'file';
  const isTreeCollection = getCollection(collectionField?.target)?.template === 'tree';

  const currentMode =
    fieldSchema['x-component-props']?.mode ||
    (isFileCollection ? 'FileManager' : isTreeCollection ? 'Cascader' : 'Select');
  return currentMode && uiSchema['x-component'] === 'AssociationField' ? currentMode : undefined;
};

CollectionField.displayName = 'CollectionField';
