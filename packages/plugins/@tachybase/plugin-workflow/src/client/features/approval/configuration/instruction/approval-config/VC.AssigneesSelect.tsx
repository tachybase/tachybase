import { default as React } from 'react';
import { RemoteSelect, SchemaComponent, useCollectionFilterOptions, useToken, Variable } from '@tachybase/client';
import { useField } from '@tachybase/schema';

import { FilterDynamicComponent } from '../../../../../components';
import { useWorkflowVariableOptions } from '../../../../../variable';

// 添加审批人-选择器
export const AssigneesSelect = (props) => {
  if (typeof props.value === 'object' && props.value) {
    return <AssigneesSelectCustom {...props} />;
  } else {
    return <AssigneesSelectNormal {...props} />;
  }
};

function isUserKeyField(field) {
  if (field.isForeignKey) {
    return field.target === 'users';
  } else {
    return field.collectionName === 'users' && field.name === 'id';
  }
}

const AssigneesSelectNormal = ({ value, onChange }) => {
  const scope = useWorkflowVariableOptions({ types: [isUserKeyField] });
  return (
    <Variable.Input scope={scope} value={value} onChange={onChange}>
      <RemoteSelect
        fieldNames={{ label: 'nickname', value: 'id' }}
        service={{ resource: 'users' }}
        manual={false}
        value={value}
        onChange={onChange}
      />
    </Variable.Input>
  );
};

const AssigneesSelectCustom = () => {
  const field = useField();
  const currentFormFields = useCollectionFilterOptions('users');
  const { token } = useToken();
  return (
    <div style={{ border: `1px dashed ${token.colorBorder}`, padding: token.paddingSM }}>
      <SchemaComponent
        basePath={field.address}
        schema={{
          type: 'void',
          properties: {
            filter: {
              type: 'object',
              'x-component': 'Filter',
              'x-component-props': {
                options: currentFormFields,
                dynamicComponent: FilterDynamicComponent,
              },
            },
          },
        }}
      />
    </div>
  );
};
