import { ArrayItems, FormItem } from '@formily/antd-v5';
import { createForm, onFormValuesChange } from '@formily/core';
import { FormProvider, connect, createSchemaField, observer, useField, useFieldSchema } from '@formily/react';
import { uid } from '@formily/shared';
import { Input, Space, Spin, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { css, useAPIClient, useCollectionManager_deprecated } from '../../..';
import { mergeFilter } from '../../../filter-provider/utils';
import { CustomCascader, SchemaComponent, useCompile, useDesignable } from '../..';
import useServiceOptions, { useAssociationFieldContext } from './hooks';

const EMPTY = 'N/A';
const SchemaField = createSchemaField({
  components: {
    Space,
    Input,
    ArrayItems,
    FormItem,
  },
});

const Cascade = connect((props) => {
  const { data, mapOptions, onChange } = props;
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [options, setOptions] = useState(data);
  const fieldSchema = useFieldSchema();
  const [loading, setLoading] = useState(false);
  const api = useAPIClient();
  const { options: collectionField, field: associationField } = useAssociationFieldContext<any>();
  const resource = api.resource(collectionField.target);
  const fieldNames = associationField?.componentProps?.fieldNames;
  const fieldFilter = fieldSchema['x-component-props']?.service?.params?.filter;
  const sort = fieldSchema['x-component-props']?.service?.params?.sort;
  const field: any = useField();
  useEffect(() => {
    if (props.value) {
      const values = Array.isArray(props.value)
        ? extractLastNonNullValueObjects(
            props.value?.filter((v) => v.value),
            true,
          )
        : transformNestedData(props.value);
      const defaultData = values?.map?.((v) => {
        return v.id;
      });
      setSelectedOptions(defaultData);
    }
    onDropdownVisibleChange('true');
  }, []);
  const handleGetOptions = async () => {
    const response = await resource.list({
      pageSize: 9999,
      filter: mergeFilter([fieldFilter, filter]),
      sort,
      tree: true,
    });
    return response?.data?.data;
  };

  const handleSelect = async (option) => {
    if (option) {
      if (['o2m', 'm2m'].includes(collectionField.interface)) {
        const fieldValue = Array.isArray(associationField.fieldValue) ? associationField.fieldValue : [];
        fieldValue[field.index] = option[option.length - 1];
        associationField.fieldValue = fieldValue;
      } else {
        associationField.value = option[option.length - 1];
      }
      const options = [];
      options.push({
        key: undefined,
        children: [],
        value: option[0],
      });
      option.forEach((item, index) => {
        if (index === option.length - 1) {
          options.push({
            key: item.id,
            children: null,
          });
        } else {
          options.push({
            key: item.id,
            children: item.children,
            value: option[index + 1],
          });
        }
      });
      onChange?.(options);
    }
  };
  const cascadeOption = (option) => {
    option.forEach((item) => {
      item['value'] = item[fieldNames.value];
      item['label'] = item[fieldNames.label];
      if (item.children) {
        item.children = cascadeOption(item.children);
      }
    });
    return option;
  };

  const onDropdownVisibleChange = async (visible) => {
    if (visible) {
      setLoading(true);
      let result = await handleGetOptions();
      result = cascadeOption(result);
      setLoading(false);
      setOptions(result);
    }
  };
  const filter = (inputValue: string, path) => path.some((option) => (option.label as string).includes(inputValue));
  return (
    <Space
      wrap
      className={css`
        display: flex;
        > .ant-space-item {
          width: 100%;
        }
      `}
    >
      <CustomCascader
        style={{ width: '100%' }}
        showSearch={{ filter }}
        fieldNames={fieldNames}
        key={selectedOptions[0] ?? []}
        defaultValue={selectedOptions}
        options={options}
        onChange={(value, option) => handleSelect(option)}
        onDropdownVisibleChange={(visible) => {
          onDropdownVisibleChange(visible);
        }}
        changeOnSelect
        placeholder="Please select"
      />
    </Space>
  );
});
const AssociationCascadeSelect = connect((props: any) => {
  return (
    <div style={{ width: '100%' }}>
      <Cascade {...props} />
    </div>
  );
});

export const InternalCascader = observer(
  (props: any) => {
    const { options: collectionField } = useAssociationFieldContext();
    const selectForm = useMemo(() => createForm(), []);
    const { t } = useTranslation();
    const field: any = useField();
    const fieldSchema = useFieldSchema();
    useEffect(() => {
      const id = uid();
      selectForm.addEffects(id, () => {
        onFormValuesChange((form) => {
          if (collectionField.interface === 'm2o') {
            const value = extractLastNonNullValueObjects(form.values?.[fieldSchema.name]);
            setTimeout(() => {
              form.setValuesIn(fieldSchema.name, value);
              props.onChange(value);
              field.value = value;
            });
          } else {
            const value = extractLastNonNullValueObjects(form.values?.select_array).filter(
              (v) => v && Object.keys(v).length > 0,
            );
            setTimeout(() => {
              field.value = value;
              props.onChange(value);
            });
          }
        });
      });
      return () => {
        selectForm.removeEffects(id);
      };
    }, []);
    const toValue = () => {
      if (Array.isArray(field.value) && field.value.length > 0) {
        return field.value;
      }
      return [{}];
    };
    const defaultValue = toValue();
    const schema = {
      type: 'object',
      properties: {
        select_array: {
          type: 'array',
          'x-component': 'ArrayItems',
          'x-decorator': 'FormItem',
          default: defaultValue,
          items: {
            type: 'void',
            'x-component': 'Space',
            properties: {
              sort: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.SortHandle',
              },
              select: {
                type: 'string',
                'x-decorator': 'FormItem',
                'x-component': AssociationCascadeSelect,
                'x-component-props': {
                  ...props,
                  style: { width: '100%' },
                },
                'x-read-pretty': false,
              },
              remove: {
                type: 'void',
                'x-decorator': 'FormItem',
                'x-component': 'ArrayItems.Remove',
              },
            },
          },
          properties: {
            add: {
              type: 'void',
              title: t('Add new'),
              'x-component': 'ArrayItems.Addition',
            },
          },
        },
      },
    };
    return (
      <FormProvider form={selectForm}>
        {collectionField.interface === 'm2o' ? (
          <SchemaComponent
            components={{ FormItem }}
            schema={{
              ...fieldSchema,
              default: field.value,
              title: '',
              'x-component': AssociationCascadeSelect,
              'x-component-props': {
                ...props,
                style: { width: '100%' },
              },
              'x-read-pretty': false,
            }}
          />
        ) : (
          <SchemaField schema={schema} />
        )}
      </FormProvider>
    );
  },
  { displayName: 'InternalCascade' },
);

function extractLastNonNullValueObjects(data, flag?) {
  let result = [];
  if (!Array.isArray(data)) {
    return data;
  }
  for (const sublist of data) {
    let lastNonNullValue = null;
    if (Array.isArray(sublist)) {
      for (let i = sublist?.length - 1; i >= 0; i--) {
        if (sublist[i].value) {
          lastNonNullValue = sublist[i].value;
          break;
        }
      }
      if (lastNonNullValue) {
        result.push(lastNonNullValue);
      }
    } else {
      if (sublist?.value) {
        lastNonNullValue = sublist.value;
      } else {
        lastNonNullValue = null;
      }
      if (lastNonNullValue) {
        if (flag) {
          result?.push?.(lastNonNullValue);
        } else {
          result = lastNonNullValue;
        }
      } else {
        result?.push?.(sublist);
      }
    }
  }
  return result;
}

export function transformNestedData(inputData) {
  const resultArray = [];

  function recursiveTransform(data) {
    if (data?.parent) {
      const { parent } = data;
      recursiveTransform(parent);
    }
    const { parent, ...other } = data;
    resultArray.push(other);
  }
  if (inputData) {
    recursiveTransform(inputData);
  }
  return resultArray;
}
