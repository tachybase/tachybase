import React, { useEffect } from 'react';
import { useCollectionField } from '@tachybase/client';
import { connect, isValid, mapProps, mapReadPretty, useField } from '@tachybase/schema';

import { Radio, RadioGroupProps, RadioProps, Tag } from 'antd-mobile';

type ComposedRadio = React.FC<RadioProps> & {
  Group?: any;
};

export const MRadio: ComposedRadio = connect(
  Radio,
  mapProps({
    value: 'checked',
    onInput: 'onChange',
  }),
);

MRadio.Group = connect(
  (props) => {
    const collectionField = useCollectionField();
    const dataSource = collectionField?.uiSchema.enum || [];
    return (
      <Radio.Group {...props}>
        {dataSource.map((item, index) => {
          return (
            <Radio value={item.value} key={index} style={{ marginRight: '10px' }}>
              {item.label}
            </Radio>
          );
        })}
      </Radio.Group>
    );
  },
  mapProps((props: any, field: any) => {
    useEffect(() => {
      const defaultOption = field.dataSource?.find((option) => option.value == props.value);
      if (defaultOption) {
        field.setValue(defaultOption.value);
      }
    }, [props.value, field.dataSource]);
    return {
      ...props,
    };
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
            <Tag key={key} color={option.color}>
              {option.label}
            </Tag>
          ))}
      </div>
    );
  }),
);

export default MRadio;
