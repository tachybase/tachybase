import React from 'react';
import { connect, useField } from '@tachybase/schema';
import { Checkbox } from 'antd';
import { Field } from '@tachybase/schema';

export const ChartFilterCheckbox = connect((props) => {
  const { content } = props;
  const field = useField<Field>();
  const handleClick = () => {
    field.setValue(!field.value);
  };
  return (
    <Checkbox onClick={handleClick} checked={field.value}>
      {content}
    </Checkbox>
  );
});
