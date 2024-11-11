import React, { FC, useMemo } from 'react';
import { useField, useFieldSchema } from '@tachybase/schema';

import { useDesignable } from '../../../schema-component';
import { SchemaSettingsDropdown } from '../../../schema-settings';
import { SchemaSettingOptions } from '../types';
import { SchemaSettingsChildren } from './SchemaSettingsChildren';
import { SchemaSettingsIcon } from './SchemaSettingsIcon';

/**
 * @internal
 */
export const SchemaSettingsWrapper: FC<SchemaSettingOptions<any>> = (props) => {
  const { items, Component = SchemaSettingsIcon, name, componentProps, style, ...others } = props;
  const { dn } = useDesignable();
  const field = useField();
  const fieldSchema = useFieldSchema();
  const cProps = useMemo(
    () => ({
      options: props,
      style,
      ...componentProps,
    }),
    [componentProps, props, style],
  );
  return (
    <SchemaSettingsDropdown
      title={React.createElement(Component, cProps)}
      dn={dn}
      field={field}
      fieldSchema={fieldSchema}
      {...others}
    >
      <SchemaSettingsChildren>{items}</SchemaSettingsChildren>
    </SchemaSettingsDropdown>
  );
};
