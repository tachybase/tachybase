import React, { useEffect } from 'react';
import { css, useCollectionField } from '@tachybase/client';
import { connect, isValid, mapProps, mapReadPretty, useField } from '@tachybase/schema';

import { Checkbox, CheckboxGroupProps, CheckboxProps, Tag } from 'antd-mobile';

import { getMobileColor } from '../../../CustomColor';

type ComposedCheckBox = React.FC<CheckboxProps> & {
  Group?: any;
};
export const MCheckbox: ComposedCheckBox = connect(
  Checkbox,
  mapProps((props) => {
    return { ...props };
  }),
);
MCheckbox.Group = connect(
  (props) => {
    const collectionField = useCollectionField();
    const dataSource = collectionField?.uiSchema.enum || [];
    const check = props.value || [];
    return (
      <Checkbox.Group value={check}>
        {dataSource.map((item, index) => {
          return (
            <Checkbox
              value={item.value}
              key={index}
              style={{ '--icon-size': '12px', '--font-size': '12px' }}
              onChange={(status) => {
                if (status) {
                  check.push(item.value);
                } else {
                  const itemIndex = check.findIndex((cItem) => item.value?.toString() === cItem);
                  check.splice(itemIndex, 1);
                }
                props.onChange(check);
              }}
              {...props}
            >
              {item.label}
            </Checkbox>
          );
        })}
      </Checkbox.Group>
    );
  },
  mapProps((props: any, field: any) => {
    return { ...props };
  }),
  mapReadPretty((props) => {
    if (!isValid(props.value)) {
      return <div></div>;
    }
    const { value } = props;
    const field = useField<any>();
    const collectionField = useCollectionField();
    const dataSource = field.dataSource || collectionField?.uiSchema.enum || [];
    return (
      <div>
        {dataSource
          .filter((option) => option.value == value)
          .map((option, key) => (
            <Tag key={key} color={getMobileColor(option.color)}>
              {option.label}
            </Tag>
          ))}
      </div>
    );
  }),
);

export default MCheckbox;
