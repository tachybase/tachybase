import React from 'react';
import { connect, isValid, mapProps, mapReadPretty, useField, useForm } from '@tachybase/schema';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Checkbox as AntdCheckbox, Radio, Tag } from 'antd';
import type { CheckboxGroupProps, CheckboxProps } from 'antd/es/checkbox';
import uniq from 'lodash/uniq';
import { useTranslation } from 'react-i18next';

import { useCollectionField } from '../../../data-source/collection-field/CollectionFieldProvider';
import { EllipsisWithTooltip } from '../input/EllipsisWithTooltip';

type ComposedCheckbox = React.ForwardRefExoticComponent<
  Pick<Partial<any>, string | number | symbol> & React.RefAttributes<unknown>
> & {
  Group?: React.FC<CheckboxGroupProps>;
  __ANT_CHECKBOX?: boolean;
  ReadPretty?: React.FC<CheckboxProps>;
};

const ReadPretty = (props) => {
  if (props.value) {
    return <CheckOutlined style={{ color: '#52c41a' }} />;
  }
  return props.showUnchecked ? <CloseOutlined style={{ color: '#ff4d4f' }} /> : null;
};

export const InternalCheckbox: ComposedCheckbox = connect(
  (props: any) => {
    const changeHandler = (val) => {
      props?.onChange(val);
    };
    return <AntdCheckbox {...props} onChange={changeHandler} />;
  },
  mapProps({
    value: 'checked',
    onInput: 'onChange',
  }),
  mapReadPretty(ReadPretty),
);

export const InternalRadioGroup: ComposedCheckbox = connect((props: any) => {
  const { t } = useTranslation();
  const field = useField();
  return (
    <Radio.Group
      {...props}
      onChange={(value) => {
        if (value.target.value !== 'null') {
          props.onChange(value);
        } else {
          field['value'] = undefined;
        }
      }}
      options={[
        { label: t('?'), value: 'null' },
        { label: t('Yes'), value: 'true' },
        { label: t('No'), value: 'false' },
      ]}
      optionType="button"
    />
  );
}, mapReadPretty(ReadPretty));

export const Checkbox = (props) => {
  switch (props.mode) {
    case 'Radio group':
      return <InternalRadioGroup {...props} />;
    case 'Checkbox':
    default:
      return <InternalCheckbox {...props} />;
  }
};

Checkbox.ReadPretty = ReadPretty;

Checkbox.__ANT_CHECKBOX = true;

Checkbox.Group = connect(
  AntdCheckbox.Group,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty((props) => {
    if (!isValid(props.value)) {
      return null;
    }
    const field = useField<any>();
    const collectionField = useCollectionField();
    const dataSource = field.dataSource || collectionField?.uiSchema.enum || [];
    const value = uniq(field.value ? field.value : []);
    return (
      <EllipsisWithTooltip ellipsis={props.ellipsis}>
        {dataSource
          .filter((option) => value.includes(option.value))
          .map((option, key) => (
            <Tag key={key} color={option.color} icon={option.icon}>
              {option.label}
            </Tag>
          ))}
      </EllipsisWithTooltip>
    );
  }),
);

export default Checkbox;
