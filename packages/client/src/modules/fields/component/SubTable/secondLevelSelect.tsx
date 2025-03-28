import { useEffect } from 'react';
import { connect, mapProps, mapReadPretty, toArr, useFieldSchema } from '@tachybase/schema';

import { CloseCircleFilled, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Select as AntdSelect, Empty, Radio, Spin, Tag, type SelectProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { useCollectionManager } from '../../../../data-source';
import { defaultFieldNames, FieldNames, useCompile } from '../../../../schema-component';
import { ReadPretty } from '../../../../schema-component/antd/select/ReadPretty';

type Props = SelectProps<any, any> & {
  objectValue?: boolean;
  onChange?: (v: any) => void;
  multiple: boolean;
  rawOptions: any[];
  fieldNames: FieldNames;
  firstLevelValue: string;
  collectionField: string;
};

const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes((input || '').toLowerCase());

export const SecondLevelSelect = connect(
  (props: Props) => {
    const { objectValue, loading, value, rawOptions, defaultValue, firstLevelValue, collectionField, ...others } =
      props;
    const { t } = useTranslation();
    const compile = useCompile();
    const cm = useCollectionManager();
    let mode: any = props.multiple ? 'multiple' : props.mode;
    if (mode && !['multiple', 'tags'].includes(mode)) {
      mode = undefined;
    }
    const toValue = (v) => {
      if (['tags', 'multiple'].includes(props.mode) || props.multiple) {
        if (v) {
          return toArr(v);
        }
        return undefined;
      }
      return v;
    };
    const Parentoptions = cm.getCollectionFields(`${collectionField}.${firstLevelValue}`);
    const fieldParentTabsOptions = Parentoptions.map((item) => {
      if (item.interface === 'm2o')
        return {
          ...item,
          label: compile(item.uiSchema.title),
          value: item.name,
        };
    }).filter(Boolean);
    fieldParentTabsOptions.unshift({
      label: t('none'),
      value: 'none',
    });
    const matchedOption = fieldParentTabsOptions.find((option) => option.value === value);
    const newValue = matchedOption ? value : 'none';

    useEffect(() => {
      if (!matchedOption) {
        props.onChange?.('none');
      }
    }, [value, fieldParentTabsOptions]);

    return (
      <AntdSelect
        // @ts-ignore
        role="button"
        data-testid={`select-${mode || 'single'}`}
        showSearch
        filterOption={filterOption}
        allowClear={{
          clearIcon: <CloseCircleFilled role="button" aria-label="icon-close-select" />,
        }}
        popupMatchSelectWidth={false}
        notFoundContent={loading ? <Spin /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        value={toValue(newValue)}
        defaultValue={toValue(defaultValue)}
        tagRender={(props) => {
          return (
            // @ts-ignore
            <Tag
              role="button"
              aria-label={props.label}
              closeIcon={<CloseOutlined role="button" aria-label="icon-close-tag" />}
              {...props}
            >
              {props.label}
            </Tag>
          );
        }}
        options={fieldParentTabsOptions}
        {...others}
        onChange={(changed) => {
          props.onChange?.(changed === undefined ? null : changed);
        }}
        mode={mode}
      />
    );
  },
  mapProps(
    {
      dataSource: 'options',
    },
    (props, field) => {
      return {
        ...props,
        fieldNames: { ...defaultFieldNames, ...props.fieldNames },
        suffixIcon: field?.['loading'] || field?.['validating'] ? <LoadingOutlined /> : props.suffixIcon,
      };
    },
  ),
  mapReadPretty(ReadPretty),
);
