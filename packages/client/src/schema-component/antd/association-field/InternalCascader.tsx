import React, { useEffect, useMemo, useState } from 'react';
import { ArrayItems, FormItem } from '@tachybase/components';
import {
  connect,
  createForm,
  createSchemaField,
  FormProvider,
  observer,
  onFormValuesChange,
  uid,
  useField,
  useFieldSchema,
} from '@tachybase/schema';
import { fuzzysearch } from '@tachybase/utils/client';

import { Input, Space } from 'antd';
import { createStyles } from 'antd-style';
import { useTranslation } from 'react-i18next';

import { CustomCascader, SchemaComponent } from '../..';
import { useAPIClient } from '../../..';
import { mergeFilter } from '../../../filter-provider/utils';
import useServiceOptions, { useAssociationFieldContext } from './hooks';

const useStyles = createStyles(({ css }) => {
  return {
    space: css`
      display: flex;
      > .ant-space-item {
        width: 100%;
      }
    `,
  };
});

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
  const [options, setOptions] = useState(data);
  const fieldSchema = useFieldSchema();
  const [loading, setLoading] = useState(false);
  const api = useAPIClient();
  const { options: collectionField, field: associationField } = useAssociationFieldContext<any>();
  const resource = api.resource(collectionField.target);
  const fieldNames = associationField?.componentProps?.fieldNames;
  const fieldFilter = fieldSchema['x-component-props']?.service?.params?.filter;
  const sort = fieldSchema['x-component-props']?.service?.params?.sort;
  const changOnSelect = fieldSchema['x-component-props']?.changOnSelect || false;
  const field: any = useField();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [change, setChange] = useState(false);
  const [dataList, setDataList] = useState({});
  const { styles } = useStyles();
  useEffect(() => {
    const propsValue = props.value || fieldSchema['x-component-props'].value;
    if (!change && propsValue) {
      if (!propsValue.parent && !Object.keys(dataList).length) {
        resource
          .list({
            paginate: false,
            filter: propsValue.id
              ? {
                  id: {
                    $eq: propsValue.id,
                  },
                }
              : {},
            sort,
            tree: true,
          })
          .then((res) => {
            setDataList(res.data?.data[0]);
          })
          .catch(() => {});
      } else {
        const values = [];
        if (!propsValue.parent && Object.keys(dataList).length) {
          const defValue = transformChildrenData(dataList, [], propsValue.id);
          values.push(...defValue);
        } else {
          const defValue = Array.isArray(propsValue)
            ? extractLastNonNullValueObjects(
                propsValue?.filter((v) => v.value),
                true,
              )
            : transformNestedData(propsValue);
          values.push(...defValue);
        }
        const defaultData = values?.map?.((v) => {
          return v.id;
        });
        onDropdownVisibleChange(true);
        setSelectedOptions(defaultData);
      }
    }
  }, [fieldSchema['x-component-props'].value, fieldSchema['x-component-props']?.changOnSelect, dataList]);
  useEffect(() => {
    onDropdownVisibleChange(true);
  }, [fieldFilter]);
  const handleGetOptions = async () => {
    const response = await resource.list({
      paginate: false,
      filter: mergeFilter([fieldFilter, filter]),
      sort,
      tree: true,
    });
    return response?.data?.data;
  };

  const handleSelect = async (option) => {
    setChange(true);
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
            children: item.children || null,
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
    } else {
      onChange?.({});
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

  const filter = (inputValue: string, path) => {
    return fuzzysearch(inputValue, path.map((option) => option.label || '').join(''));
  };
  return (
    <Space wrap className={styles.space}>
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
        changeOnSelect={changOnSelect}
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
    // @ts-ignore
    const { t } = useTranslation();
    const field: any = useField();
    const fieldSchema = useFieldSchema();
    const service = useServiceOptions(props);
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
    useEffect(() => {
      const isChange = selectForm.values?.select_array?.filter((value) => value && Object.keys(value).length);
      if (collectionField.interface !== 'm2o' && props.value && !isChange.length) {
        selectForm.setInitialValues({ select_array: defaultValue });
      }
    }, [props.value]);

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
                service,
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
  { displayName: 'InternalCascader' },
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

export const transformChildrenData = (inputData, result, itemId) => {
  const { children, ...other } = inputData;
  result.push(other);
  if (children && inputData?.id !== itemId && children.length) {
    const { children } = inputData;
    return transformChildrenData(children[0], result, itemId);
  } else {
    return result;
  }
};
