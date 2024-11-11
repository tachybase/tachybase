import React from 'react';
import { useAssociatedFields, useCollectionManager_deprecated, useCompile, Variable } from '@tachybase/client';

export const Expression = (props) => {
  const { value = '', useCurrentFields, onChange } = props;
  const compile = useCompile();
  const { interfaces, getCollectionFields } = useCollectionManager_deprecated();

  const fields = useCurrentFields?.() ?? [];
  const associatedFields = useAssociatedFields();
  console.log(associatedFields, 'associatedFields', fields);

  const options = fields.map((field) => ({
    label: compile(field.uiSchema.title),
    value: field.name,
    children:
      getCollectionFields(field.target)
        ?.filter((subField) => subField.uiSchema)
        .map((subField) => ({
          label: subField.uiSchema ? compile(subField.uiSchema.title) : '',
          value: subField.name,
        })) ?? [],
  }));

  return <Variable.Input value={value} onChange={onChange} scope={options} changeOnSelect />;
};

export default Expression;
