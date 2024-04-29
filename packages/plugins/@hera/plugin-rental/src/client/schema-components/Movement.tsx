import { useCollectionField } from '@nocobase/client';
import { connect, isValid, mapProps, mapReadPretty, useField } from '@tachybase/schema';
import { Tag } from 'antd';
import React from 'react';
import { useEffect } from 'react';
import { MovementStatus } from '../custom-components/MovementStatus';

export const Movement = connect(
  MovementStatus,
  mapProps(
    {
      dataSource: 'options',
    },
    (props: any, field: any) => {
      useEffect(() => {
        const defaultOption = field.dataSource?.find((option) => option.value === props.value);
        if (defaultOption) {
          field.setValue(defaultOption.value);
        }
      }, [props.value, field.dataSource]);
      return {
        ...props,
      };
    },
  ),
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
          .filter((option) => option.value === value)
          .map((option, key) => (
            <Tag key={key} color={option.color} icon={option.icon}>
              {option.label}
            </Tag>
          ))}
      </div>
    );
  }),
);
