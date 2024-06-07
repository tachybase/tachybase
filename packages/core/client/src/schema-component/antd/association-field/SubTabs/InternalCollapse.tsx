import React, { useState } from 'react';
import { ArrayField, observer, onFieldChange, Schema, useFieldSchema, useFormEffects } from '@tachybase/schema';
import { fuzzysearch } from '@tachybase/utils/client';

import { CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { useAsyncEffect, useDeepCompareEffect } from 'ahooks';
import { Button, Collapse, CollapseProps, Input, Space, Tabs } from 'antd';
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
  const { field } = useAssociationFieldContext<ArrayField>();
  const { t } = useTranslation();
  const [changeForm, setChangeForm] = useState<any>();

  const quickAddSchema = fieldSchema.reduceProperties((buf, schema) => {
    const found = schema.reduceProperties((buf, schema) => {
      if (schema.name === quickAddField) {
        return schema;
      }
      return buf;
    });
    if (found) {
      return found;
    }
    return buf;
  }, new Schema({}));
  const tabparams = quickAddSchema['x-component-props']?.['service']?.['params'];
  const [fieldServiceFilter] = useFieldServiceFilter(tabparams?.filter);
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

      if (quickAddSchema && fieldInterface === 'm2o') {
        itemParams['service'] = quickAddSchema['x-component-props'].service;
        itemParams['collectionName'] = cm.getCollection(quickAddSchema['x-collection-field']).name;
        const childrenItem = await api.request({
          url: itemParams['collectionName'] + ':list',
          params,
        });
        itemParams['childrenTitleField'] = cm.getCollection(itemParams['collectionName']).titleField;
        itemParams['childrenOptions'] = childrenItem?.data?.data;

        if (
          itemParams['parentOptions']?.length &&
          itemParams['childrenOptions']?.length &&
          quickAddParentField?.value !== 'none'
        ) {
          optionsItem.unshift({
            value: 'all',
            label: t('All'),
            key: 'all',
            childrenItems: [],
          });
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
            optionsItem[0].childrenItems.push(...items);
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
      } else if (quickAddSchema) {
        const fieldItem = cm.getCollectionField(quickAddSchema['x-collection-field']);
        if (!fieldItem?.uiSchema || !fieldItem?.uiSchema.enum) return;
        fieldItem.uiSchema.enum.forEach((item) => {
          optionsItem.push(item);
        });
        setOptions(optionsItem);
        setDefOptions(optionsItem);
      }
    }
  }, [fieldServiceFilter, tabparams?.filter, changeForm, isQuickAdd, quickAddField, quickAddParentField]);

  useDeepCompareEffect(() => {
    if (!defOptions.length) return;
    const fieldTabs = field.value;
    if (quickAddParentField && quickAddParentField?.value !== 'none') {
      const filterParantOptions = tabsParantFilterOptions(defOptions, fieldTabs, quickAddField);
      const filterOptions = tabsParantFilterOptions(options, fieldTabs, quickAddField);
      setDefOptions(filterParantOptions);
      setOptions(filterOptions);
    } else {
      const filterDefOptions = tabsFilterOptions(defOptions, fieldTabs, quickAddField);
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
    if (!value) {
      setOptions(defOptions);
    }
    if (quickAddParentField && quickAddParentField.value !== 'none') {
      const filterOption = defOptions
        ?.map((item) => {
          const filterItem = item?.childrenItems?.filter((childrenItem) => fuzzysearch(value, childrenItem?.label));
          if (fuzzysearch(value, item?.label) || filterItem?.length) {
            return {
              ...item,
              childrenItems: filterItem.length ? filterItem : item.childrenItems,
            };
          }
        })
        .filter(Boolean);
      setOptions(filterOption);
    } else {
      const filterOption = defOptions.filter((item) => fuzzysearch(value, item?.label));
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

  return (
    <div>
      <Input
        placeholder={t('Please enter search content')}
        prefix={<SearchOutlined />}
        onChange={(e) => {
          onSelect(e?.target?.value);
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
                  <Space style={{ maxHeight: '30vh', overflow: 'auto', padding: '10px 0px 20px 0px' }}>
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
              style={{ maxHeight: '30vh', padding: '10px' }}
              defaultActiveKey="all"
            ></Tabs>
          ) : null}
        </>
      ) : (
        <Space style={{ maxHeight: '30vh', overflow: 'auto', padding: '10px' }}>
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
  );
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

export const InternalCollapse = observer((props) => {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const isQuickAdd = fieldSchema['parent']['x-component-props']['isQuickAdd'];
  const { value: quickAddField } = fieldSchema['parent']['x-component-props']?.['quickAddField'] || {};
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: t('Quick create'),
      children: <InternalTabs {...props} />,
    },
  ];
  return isQuickAdd && quickAddField && quickAddField !== 'none' ? (
    <Collapse items={items} defaultActiveKey={['1']} />
  ) : null;
});
