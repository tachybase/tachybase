import { useField, useFieldSchema } from '@formily/react';
import { useDesignable, useFieldNames, useFilterBlock } from '@nocobase/client';
import { App, Button, Flex, Input, Modal, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from '../../locale';
import { GroupBlockContext } from '../../schema-initializer/blocks/GroupBlockInitializer';
import { transformers } from './transformers';
import { DeleteOutlined, PullRequestOutlined } from '@ant-design/icons';
import { uid } from '@formily/shared';

export type SelectedField = {
  field: string | string[];
  alias?: string;
};
export type fieldOptionType = {
  label: string;
  fieldFormat: {
    fieldValue: string;
    option: string;
    type: string;
    decimal?: string;
    requestUrl?: string;
  };
  aggregation?: string;
  field?: [string];
  display?: boolean;
};

export const GroupConfigure = (props) => {
  const { visible, setVisible } = useContext(GroupBlockContext);
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const { modal } = App.useApp();
  const fieldSchema = useFieldSchema();
  const measures = fieldSchema['x-decorator-props']?.params?.measures;
  const option: fieldOptionType[] = [];
  const params = fieldSchema['x-decorator-props']?.params;
  if (params['config']) {
    if (params['config']['measures']) {
      option.push(...params['config']['measures']);
    }
    if (params['config']['request']) {
      option.push(...params['config']['request']);
    }
  }

  const [fieldOption, setFieldOption] = useState(JSON.parse(JSON.stringify(option)));
  const fieldType = [
    {
      label: '字段配置',
      value: 'field',
    },
    {
      label: '请求配置',
      value: 'custom',
    },
  ];
  const valueOption = measures.map((item) => {
    return {
      label: item.label,
      value: item.field[0],
    };
  });

  const decimal = transformers.option.filter((item) => item.value === 'decimal')[0].childrens;
  useEffect(() => {
    if (!visible) {
      return;
    }
  }, [visible]);
  return (
    <Modal
      title={t('Configure Group')}
      open={visible}
      onOk={() => {
        const request = [];
        const configMeasures = [];
        fieldOption.forEach((fieldOptionItem) => {
          if (fieldOptionItem.fieldFormat.type === 'field') {
            const { measureItem, index } = measures
              .map((measureItem, index) => {
                if (measureItem.field[0] === fieldOptionItem?.fieldFormat?.fieldValue) {
                  return { measureItem, index };
                } else {
                  return {};
                }
              })
              .filter((value) => value.measureItem)[0];
            if (measureItem) {
              measureItem['fieldFormat'] = { ...fieldOptionItem.fieldFormat };
              configMeasures.push(measureItem);
            }
          } else if (fieldOptionItem.fieldFormat.type === 'custom') {
            request.push({ ...fieldOptionItem, label: '自定义请求', field: [uid()] });
          }
        });
        fieldSchema['x-decorator-props']['params']['config'] = {
          measures: configMeasures,
          request,
        };
        dn.emit('patch', {
          schema: fieldSchema,
        });
        setVisible(false);
        dn.refresh();
      }}
      onCancel={() => {
        modal.confirm({
          title: t('Are you sure to cancel?'),
          content: t('You changes are not saved. If you click OK, your changes will be lost.'),
          okButtonProps: {
            danger: true,
          },
          onOk: () => {
            setVisible(false);
          },
        });
      }}
      width={'30%'}
    >
      <div style={{ display: 'flex', marginBottom: '10px', marginTop: '10px', flexDirection: 'column' }}>
        {fieldOption.map((item, index) => {
          return (
            <div style={{ marginBottom: '7px' }} key={index}>
              <Select
                options={fieldType}
                placeholder="Type"
                style={{ marginRight: '5px' }}
                value={item?.fieldFormat?.type ? item?.fieldFormat?.type : undefined}
                onChange={(v) => {
                  fieldConfig('type', fieldOption, setFieldOption, index, v);
                }}
              />
              {item?.fieldFormat?.type === 'field' ? (
                <Select
                  options={valueOption}
                  placeholder="Field"
                  style={{ marginRight: '5px' }}
                  value={item?.fieldFormat?.fieldValue ? item?.fieldFormat?.fieldValue : undefined}
                  onChange={(v) => {
                    fieldConfig('field', fieldOption, setFieldOption, index, v);
                  }}
                />
              ) : null}
              {item?.fieldFormat?.type === 'custom' ? (
                <Input
                  addonBefore={<PullRequestOutlined />}
                  placeholder="RequestUrl"
                  allowClear
                  style={{ marginRight: '5px', marginTop: '5px', marginBottom: '5px' }}
                  defaultValue={item?.fieldFormat?.requestUrl ? item?.fieldFormat?.requestUrl : undefined}
                  onChange={(v) => {
                    fieldConfig('url', fieldOption, setFieldOption, index, v.currentTarget.value);
                  }}
                />
              ) : null}
              <Select
                options={transformers.option}
                placeholder="Format"
                style={{ marginRight: '5px' }}
                value={item?.fieldFormat?.option ? item?.fieldFormat?.option : undefined}
                onChange={(v) => {
                  fieldConfig('format', fieldOption, setFieldOption, index, v);
                }}
              />
              {item?.fieldFormat?.option === 'decimal' ? (
                <Select
                  options={decimal}
                  placeholder="Digits"
                  style={{ marginRight: '5px' }}
                  value={item.fieldFormat.decimal}
                  onChange={(v) => fieldConfig('decimal', fieldOption, setFieldOption, index, v)}
                />
              ) : null}
              <DeleteOutlined
                style={{ fontSize: '14px' }}
                onClick={() => {
                  fieldConfig('del', fieldOption, setFieldOption, index);
                }}
              />
            </div>
          );
        })}
      </div>
      <Button
        type="dashed"
        style={{ borderRadius: '0', width: '30%' }}
        onClick={() => {
          fieldConfig('add', fieldOption, setFieldOption);
        }}
      >
        + Add Field
      </Button>
    </Modal>
  );
};

const fieldConfig = (type, fieldOption, setFieldOption, index?, record?) => {
  const option = [...fieldOption];
  if (type === 'add') {
    option.push({});
  } else if (type === 'del') {
    option.splice(index, 1);
  } else if (type === 'type') {
    option[index]['fieldFormat'] = {
      ...option[index]['fieldFormat'],
      type: record,
    };
  } else if (type === 'url') {
    option[index]['fieldFormat'] = {
      ...option[index]['fieldFormat'],
      requestUrl: record,
    };
  } else if (type === 'field') {
    option[index]['fieldFormat'] = {
      ...option[index]['fieldFormat'],
      fieldValue: record,
    };
  } else if (type === 'format') {
    option[index]['fieldFormat'] = {
      ...option[index]['fieldFormat'],
      option: record,
    };
  } else if (type === 'decimal') {
    option[index]['fieldFormat'] = {
      ...option[index]['fieldFormat'],
      decimal: record,
    };
  }
  setFieldOption(option);
};
