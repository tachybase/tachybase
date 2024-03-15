import { CloseCircleFilled, CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { connect, mapProps, mapReadPretty, useFieldSchema } from '@formily/react';
import { isValid, toArr } from '@formily/shared';
import { isPlainObject } from '@nocobase/utils/client';
import type { SelectProps } from 'antd';
import { Select as AntdSelect, Empty, Spin, Tag } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { ReadPretty } from './ReadPretty';
import { FieldNames, defaultFieldNames, getCurrentOptions } from './utils';
import { useAPIClient, useCollection_deprecated, useRequest } from '@nocobase/client';
import { useAsyncEffect } from 'ahooks';

type Props = SelectProps<any, any> & {
  objectValue?: boolean;
  onChange?: (v: any) => void;
  multiple: boolean;
  rawOptions: any[];
  fieldNames: FieldNames;
};

const isEmptyObject = (val: any) => !isValid(val) || (typeof val === 'object' && Object.keys(val).length === 0);

const ObjectSelect = (props: Props) => {
  const { value, options, onChange, fieldNames, mode, loading, rawOptions, defaultValue, ...others } = props;
  const [defoptions, setDefOptions] = useState();
  const fieldSchema = useFieldSchema();
  const collectionName = fieldSchema['collectionName'];
  const filterField = fieldSchema['x-component-props']['params'];
  const api = useAPIClient();
  useAsyncEffect(async () => {
    if (collectionName) {
      const defValue = await api.request({
        url: collectionName + ':list',
        params: {
          pageSize: 99999,
          filter: filterField ? { ...filterField.filter } : {},
        },
      });
      setDefOptions(defValue?.data?.data);
    }
  }, [filterField?.filter]);
  const toValue = (v: any) => {
    if (isEmptyObject(v)) {
      return;
    }
    const values = toArr(v)
      .filter((item) => item)
      .map((val) => {
        return isPlainObject(val) ? val[fieldNames.value] : val;
      });
    const currentOptions = getCurrentOptions(values, options, fieldNames)?.map((val) => {
      return {
        label: val[fieldNames.label],
        value: val[fieldNames.value],
      };
    });
    if (['tags', 'multiple'].includes(mode) || props.multiple) {
      return currentOptions;
    }
    return currentOptions.shift();
  };
  if (fieldNames['formula']) {
    delete others.onSearch;
    delete others.filterOption;
  }
  return (
    <AntdSelect
      // @ts-ignore
      role="button"
      data-testid={`select-object-${mode || 'single'}`}
      value={toValue(value)}
      defaultValue={toValue(defaultValue)}
      allowClear={{
        clearIcon: <CloseCircleFilled role="button" aria-label="icon-close-select" />,
      }}
      labelInValue
      notFoundContent={loading ? <Spin /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
      options={defoptions || options}
      fieldNames={fieldNames}
      showSearch
      popupMatchSelectWidth={false}
      filterOption={(input, option) => (option?.[fieldNames.label || 'label'] ?? '').includes(input)}
      filterSort={(optionA, optionB) =>
        (optionA?.[fieldNames.label || 'label'] ?? '')
          .toLowerCase()
          .localeCompare((optionB?.[fieldNames.label || 'label'] ?? '').toLowerCase())
      }
      onChange={(changed) => {
        const current = getCurrentOptions(
          toArr(changed).map((v) => v.value),
          rawOptions || options,
          fieldNames,
        );
        if (['tags', 'multiple'].includes(mode as string) || props.multiple) {
          onChange?.(current);
        } else {
          onChange?.(current.shift() || null);
        }
      }}
      mode={mode}
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
      {...others}
    />
  );
};

const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes((input || '').toLowerCase());

const replacePlaceholders = (inputStr, values) => {
  return inputStr.replace(/{{(.*?)}}/g, function (match, placeholder) {
    return Object.prototype.hasOwnProperty.call(values, placeholder) ? values[placeholder] : match;
  });
};

const useLabelOptions = (others) => {
  const fieldSchema = useFieldSchema();
  const { getField } = useCollection_deprecated();
  const collectionField = useMemo(() => getField(fieldSchema.name), [fieldSchema.name]);
  const collectionName = fieldSchema['x-compoent-custom'] ? fieldSchema['name'].toString().slice(7) : '';
  const request = {
    resource: collectionField ? collectionField?.target : collectionName,
    action: 'list',
    params: {
      pageSize: 99999,
    },
  };
  const regex = /{{(.*?)}}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(others.fieldNames.formula)) !== null) {
    matches.push(match[1]);
  }
  const association = matches.filter((value) => value.includes('.'));
  if (association.length) {
    request.params['appends'] = association.map((value) => value.split('.')[0]);
  }

  const formula = others.fieldNames.formula;
  const [data, setData] = useState([]);
  const { run } = useRequest(request, {
    manual: true,
    onSuccess: (result) => {
      setData(result.data);
    },
  });
  useEffect(() => {
    if (formula) {
      run();
    } else {
      setData(others.options);
    }
  }, [formula]);
  if (formula) {
    others.options?.forEach((op) => {
      const valueOject = {};
      let outputStr = '';
      let match;
      data?.forEach((opValue) => {
        if (op.id === opValue.id) {
          while ((match = regex.exec(formula))) {
            if (match[1].includes('.')) {
              const opvalue = opValue[match[1].split('.')[0]];
              const value = opvalue ? opValue[match[1].split('.')[0]][match[1].split('.')[1]] : '';
              valueOject[match[1]] = value ?? '';
            } else {
              valueOject[match[1]] = op[match[1]] || '';
            }
          }
          outputStr = replacePlaceholders(formula, valueOject);
        }
      });
      op[others.fieldNames.label] = outputStr;
    });
  }
  return others;
};
const InternalSelect = connect(
  (props: Props) => {
    const { objectValue, loading, value, rawOptions, defaultValue, ...others } = props;
    let mode: any = props.multiple ? 'multiple' : props.mode;
    if (mode && !['multiple', 'tags'].includes(mode)) {
      mode = undefined;
    }
    const fieldSchema = useFieldSchema();
    const modifiedProps = useLabelOptions(others);
    if (objectValue || fieldSchema['x-compoent-custom']) {
      return (
        <ObjectSelect
          rawOptions={rawOptions}
          {...modifiedProps}
          defaultValue={defaultValue}
          value={value}
          mode={mode}
          loading={loading}
        />
      );
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
        value={toValue(value)}
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

export const Select = InternalSelect as unknown as typeof InternalSelect & {
  ReadPretty: typeof ReadPretty;
};

Select.ReadPretty = ReadPretty;

export default Select;
