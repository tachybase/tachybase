import React, { useEffect, useMemo, useState } from 'react';
import { useCollectionManager_deprecated, useCompile, useFieldInterfaceOptions } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { App, Button, Input, Select, Table, Tag } from 'antd';
import lodash from 'lodash';
import jsxRuntime from 'react/jsx-runtime';

import { useTranslation } from '../../../locale';
import { filterTree } from '../utils/filterTree';

export const PreviewFields = (props) => {
  const compile = useCompile();
  const { getInterface } = useCollectionManager_deprecated();
  const { t } = useTranslation();
  const form = useForm();
  const field: any = useField();

  const [dataSource, setDataSource] = useState(field.value);

  const fieldInterfaceOptions = useFieldInterfaceOptions().filter(
    (options) => !['relation', 'systemInfo'].includes(options.key),
  );

  const { modal } = App.useApp();

  const updateDataSource = (item, index) => {
    setTimeout(() => {
      dataSource.splice(index, 1, item);
      setDataSource(dataSource);
      field.value = dataSource.concat();
    }, 300);
  };

  const deleteDataSoureItem = (item) => {
    dataSource.splice(item, 1);

    const newDataSource = dataSource.concat();
    field.value = newDataSource;

    setDataSource(newDataSource);
  };

  const onClick = () => {
    modal.confirm({
      title: t('Are you sure you want to clear fields?'),
      onOk: () => {
        form.setValuesIn('fields', []);
        form.setValuesIn('preview', []);
      },
    });
  };

  const columnsData: any = useMemo(
    () => [
      {
        dataIndex: 'index',
        width: 60,
        key: 'index',
        render: (text, record, index) => index + 1,
      },
      {
        title: t('Field display name'),
        dataIndex: 'title',
        key: 'title',
        width: 150,
        render: (text, record, index) => {
          const targetDataSource = dataSource[index];
          return jsxRuntime.jsx(Input, {
            defaultValue: targetDataSource.uiSchema.title,
            onChange: lodash.debounce((changeValue) => {
              updateDataSource(
                {
                  ...targetDataSource,
                  uiSchema: {
                    ...lodash.omit(targetDataSource?.uiSchema, 'rawTitle'),
                    title: changeValue.target.value,
                  },
                },
                index,
              );
            }, 300),
          });
        },
      },
      {
        title: t('Field name'),
        dataIndex: 'name',
        key: 'name',
        width: 130,
      },
      {
        title: t('Field type'),
        dataIndex: 'type',
        width: 140,
        key: 'type',
        render: (text, record, index) => {
          const targetDataSource = dataSource[index];
          return targetDataSource?.source || !targetDataSource?.possibleTypes ? (
            <Tag> {text}</Tag>
          ) : (
            <Select
              defaultValue={text}
              popupMatchSelectWidth={false}
              style={{ width: '100%' }}
              options={
                targetDataSource?.possibleTypes.map((type) => ({
                  label: type,
                  value: type,
                })) || []
              }
              onChange={(type) => {
                updateDataSource(
                  {
                    ...targetDataSource,
                    type,
                  },
                  index,
                );
              }}
            />
          );
        },
      },
      {
        title: t('Field interface'),
        dataIndex: 'interface',
        key: 'interface',
        width: 150,
        render: (text, record, index) => {
          const targetItem = dataSource[index];
          const treeChild = targetItem?.type && filterTree(fieldInterfaceOptions, targetItem?.type);
          const handleSelectChange = (interfaceVal) => {
            const fieldInterface = getInterface(interfaceVal);
            updateDataSource(
              {
                ...targetItem,
                interface: interfaceVal,
                uiSchema: {
                  ...targetItem.uiSchema,
                  ...fieldInterface?.default?.uiSchema,
                },
              },
              index,
            );
          };
          return (
            <Select
              defaultValue={text}
              style={{ width: '100%' }}
              popupMatchSelectWidth={false}
              onChange={handleSelectChange}
            >
              {treeChild?.map((child) => (
                <Select.OptGroup key={child.key} label={compile(child.label)}>
                  {child.children.map(({ label, value, name }) => (
                    <Select.Option key={value} value={name}>
                      {compile(label)}
                    </Select.Option>
                  ))}
                </Select.OptGroup>
              ))}
            </Select>
          );
        },
      },
      {
        title: t('Actions'),
        dataIndex: 'actions',
        fixed: 'right',
        key: 'actions',
        align: 'center',
        width: 100,
        render: (text, record, index) => <a onClick={() => deleteDataSoureItem(index)}> {t('Delete')}</a>,
      },
    ],
    [dataSource],
  );

  useEffect(() => {
    setDataSource(field.value);
  }, [field.value]);

  return (
    <>
      {dataSource.length ? (
        <Button
          style={{
            position: 'absolute',
            top: '-10px',
            right: '0px',
          }}
          onClick={onClick}
        >
          {t('Clear')}
        </Button>
      ) : null}
      <Table
        bordered
        size="middle"
        columns={columnsData}
        dataSource={dataSource}
        scroll={{
          y: 300,
        }}
        pagination={false}
      />
    </>
  );
};
PreviewFields.displayName = 'PreviewFields';
