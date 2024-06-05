import React, { useEffect, useState } from 'react';
import { ArrayField, observer, onFieldChange, Schema, useFieldSchema, useFormEffects } from '@tachybase/schema';

import { CheckOutlined, CheckSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { useAsyncEffect, useDeepCompareEffect } from 'ahooks';
import { Badge, Button, Input, Space, Tabs } from 'antd';
import flat from 'flat';
import { useTranslation } from 'react-i18next';

import { useAPIClient } from '../../../../api-client';
import { useCollectionManager } from '../../../../data-source';
import { markRecordAsNew } from '../../../../data-source/collection-record/isNewRecord';
import { useAssociationFieldContext } from '../hooks';
import { useFieldServiceFilter } from './hook';

export const InternalTabs = observer((props) => {
  const { fieldValue, setFieldValue } = props as any;
  const fieldSchema = useFieldSchema();
  const cm = useCollectionManager();
  const api = useAPIClient();
  const isQuickAdd = fieldSchema['parent']['x-component-props']['isQuickAdd'];
  const { value: quickAddField, fieldInterface } = fieldSchema['parent']['x-component-props']?.['quickAddField'] || {};
  const quickAddParentField = fieldSchema['parent']['x-component-props']['quickAddParentCollection'];
  const [options, setOptions] = useState([]);
  const [defOptions, setDefOptions] = useState([]);
  const { field, options: collectionField } = useAssociationFieldContext<ArrayField>();
  const { t } = useTranslation();
  const [changeForm, setChangeForm] = useState<any>();

  const tableSchema = fieldSchema.reduceProperties((buf, schema) => {
    const found = schema.reduceProperties(
      (buf, schema) => {
        if (schema.name === quickAddField) {
          return schema;
        }
        return buf;
      },
      new Schema({ name: 'not-found' }),
    );
    if (found.name === quickAddField) {
      return found;
    }
    return buf;
  }, new Schema({}));
  const tabparams = tableSchema['x-component-props']?.['service']?.['params'];
  const [fieldServiceFilter, setFieldServiceFilter] = useFieldServiceFilter(tabparams?.filter);
  const formFilter = flat(tabparams?.filter || {});
  const formFieldFilter = Object.values(formFilter)
    ?.map((item) => {
      const field = item as String;
      const match = field.match(/^{{\$nForm\.(.*?)\./);
      if (match) return match[1];
    })
    .filter(Boolean);
  useAsyncEffect(async () => {
    const itemParams = {};
    const optionsItem = [];
    if (tabparams?.filter && !fieldServiceFilter) return;
    if ((quickAddField || quickAddField !== 'none' || !isQuickAdd) && fieldSchema.properties) {
      const params = { pageSize: 99999, filter: JSON.stringify(fieldServiceFilter) };
      if (quickAddParentField && quickAddParentField?.value !== 'none') {
        params['appends'] = [quickAddParentField.value];
        const collection = cm.getCollection(quickAddParentField.collectionField);
        const parentItem = await api.request({
          url: collection.name + ':list',
          params: { pageSize: 9999 },
        });
        itemParams['parentTitleField'] = collection.titleField;
        itemParams['parentOptions'] = parentItem?.data?.data;
      }

      if (tableSchema && fieldInterface === 'm2o') {
        itemParams['service'] = tableSchema['x-component-props'].service;
        itemParams['collectionName'] = cm.getCollection(tableSchema['x-collection-field']).name;
        const childrenItem = await api.request({
          url: itemParams['collectionName'] + ':list',
          params,
        });
        itemParams['childrenTitleField'] = cm.getCollection(itemParams['collectionName']).titleField;
        itemParams['childrenOptions'] = childrenItem?.data?.data;

        if (itemParams['parentOptions']?.length && itemParams['childrenOptions']?.length) {
          itemParams['parentOptions'].forEach((parentItem) => {
            const items = itemParams['childrenOptions']
              .map((item) => {
                if (item[quickAddParentField?.value]?.id === parentItem.id) {
                  return {
                    ...item,
                    label: item[itemParams['childrenTitleField']],
                    keys: item.id,
                    value: item.id,
                    checked: false,
                  };
                }
              })
              .filter(Boolean);
            if (!items.length) return;
            optionsItem.push({
              ...parentItem,
              value: parentItem?.id,
              label: parentItem[itemParams['parentTitleField']],
              key: parentItem.id,
              childrenItems: items,
            });
          });
        } else if (
          itemParams['childrenOptions']?.length &&
          (!quickAddParentField || quickAddParentField?.value === 'none')
        ) {
          itemParams['childrenOptions'].forEach((item) => {
            optionsItem.push({
              ...item,
              label: item[itemParams['childrenTitleField']],
              value: item?.id,
              key: item?.id,
              checked: false,
            });
          });
        }
        setOptions(optionsItem);
        setDefOptions(optionsItem);
      } else if (tableSchema) {
        const fieldItem = cm.getCollectionField(tableSchema['x-collection-field']);
        if (!fieldItem?.uiSchema || !fieldItem?.uiSchema.enum) return;
        fieldItem.uiSchema.enum.forEach((item) => {
          optionsItem.push(item);
        });
        setOptions(optionsItem);
        setDefOptions(optionsItem);
      }
    }
  }, [fieldServiceFilter, fieldSchema, changeForm]);

  useDeepCompareEffect(() => {
    if (!defOptions.length) return;
    const fieldTabs = field.value;
    if (quickAddParentField && quickAddParentField?.value !== 'none') {
      const filterParantOptions = tabsParantFilterOptions(defOptions, fieldTabs, quickAddField);
      const filterOptions = tabsParantFilterOptions(options, fieldTabs, quickAddField);
      setDefOptions(filterParantOptions);
      setOptions(filterOptions);
    } else {
      const filterDefOptions = tabsFilterOptions(options, fieldTabs, quickAddField);
      setDefOptions(filterDefOptions);
      const filterOptions = tabsFilterOptions(options, fieldTabs, quickAddField);
      setOptions(filterOptions);
    }
  }, [quickAddField, fieldValue]);

  useFormEffects(() => {
    onFieldChange(formFieldFilter, (field) => {
      setChangeForm(field);
    });
  });
  const onSelect = (value) => {
    if (quickAddParentField && quickAddParentField.value !== 'none') {
      const filterOption = defOptions
        .map((item) => {
          const filterItem = item?.childrenItems?.filter((childrenItem) => childrenItem?.label?.includes(value));
          if (item?.label?.includes(value) || filterItem.length) {
            return {
              ...item,
              childrenItems: filterItem.length ? filterItem : item.childrenItems,
            };
          }
        })
        .filter(Boolean);
      setOptions(filterOption);
    } else {
      const filterOption = defOptions.filter((item) => item?.label?.includes(value));
      setOptions(filterOption);
    }
  };

  const onChange = (item) => {
    field.value = field.value || [];
    const addItem = {};
    addItem[quickAddField] = item;
    field.value.push(markRecordAsNew(addItem));
    setFieldValue([...field.value]);
  };

  return isQuickAdd && quickAddField && quickAddField !== 'none' ? (
    <div>
      <Input
        placeholder={t('Please enter search content')}
        prefix={<SearchOutlined />}
        onChange={(e) => {
          onSelect(e.target.value);
        }}
      />

      {quickAddParentField && quickAddParentField?.value !== 'none' ? (
        <>
          {options.length ? (
            <Tabs
              tabPosition="left"
              items={options.map((item) => ({
                ...item,
                children: (
                  <Space>
                    {item?.childrenItems?.map((childrenitem, index) => (
                      <Button
                        key={index}
                        onClick={() => {
                          onChange(childrenitem);
                        }}
                        icon={childrenitem.checked ? <CheckOutlined /> : null}
                      >
                        {childrenitem.label}
                      </Button>
                    ))}
                  </Space>
                ),
              }))}
              style={{ height: '30vh', overflow: 'auto', padding: '10px' }}
            ></Tabs>
          ) : null}
        </>
      ) : (
        <Space style={{ height: '30vh', overflow: 'auto', padding: '10px' }}>
          {options.map((item, index) => (
            <Button
              key={index}
              onClick={() => {
                onChange(item);
              }}
              icon={item.checked ? <CheckOutlined /> : null}
            >
              {item.label}
            </Button>
          ))}
        </Space>
      )}
    </div>
  ) : null;
});

const tabsParantFilterOptions = (options, fieldTabs, arrayField) => {
  const filterOptions = options?.map((oItem) => {
    const filterItem = oItem.childrenItems.map((childrenItem) => {
      const fieldTabsValue = fieldTabs.find((item) => item[arrayField]?.value === childrenItem.value);
      return {
        ...childrenItem,
        checked: fieldTabsValue ? true : false,
      };
    });
    return {
      ...oItem,
      childrenItems: filterItem,
    };
  });
  return filterOptions;
};

const tabsFilterOptions = (optitons, filterTabs, arrayField) => {
  const filterOptions = optitons.map((item) => {
    const filterValue = filterTabs.find((filterTabsItem) => filterTabsItem[arrayField]?.value === item.value);
    return {
      ...item,
      checked: filterValue ? true : false,
    };
  });
  return filterOptions;
};
