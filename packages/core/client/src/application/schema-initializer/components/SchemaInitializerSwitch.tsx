import React, { FC } from 'react';

import { Switch } from 'antd';

import { useCompile } from '../../../schema-component';
import { useSchemaInitializerItem } from '../context';
import { SchemaInitializerItem, SchemaInitializerItemProps } from './SchemaInitializerItem';

export interface SchemaInitializerSwitchItemProps extends SchemaInitializerItemProps {
  checked?: boolean;
  disabled?: boolean;
}

export const SchemaInitializerSwitch: FC<SchemaInitializerSwitchItemProps> = (props) => {
  const { title, checked, ...resets } = props;
  const compile = useCompile();
  return (
    <SchemaInitializerItem {...resets}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {compile(title)} <Switch style={{ marginLeft: 20 }} size={'small'} checked={checked} />
      </div>
    </SchemaInitializerItem>
  );
};

export const SchemaInitializerSwitchInternal = () => {
  const itemConfig = useSchemaInitializerItem<SchemaInitializerSwitchItemProps>();
  return <SchemaInitializerSwitch {...itemConfig} />;
};
