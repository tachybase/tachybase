import { useField, useFieldSchema } from '@formily/react';
import { useDesignable, useFieldNames } from '@nocobase/client';
import { App, Button, Flex, Modal, Select } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from '../../locale';
import { GroupBlockContext } from '../../schema-initializer/GroupBlockInitializer';
import { transformers } from './transformers';
import { DeleteOutlined } from '@ant-design/icons';

export type SelectedField = {
  field: string | string[];
  alias?: string;
};

export const GroupConfigure = (props) => {
  const { visible, setVisible } = useContext(GroupBlockContext);
  const { t } = useTranslation();
  const { dn } = useDesignable();
  const { modal } = App.useApp();
  const fieldSchema = useFieldSchema();
  const measure = fieldSchema['x-decorator-props']?.params?.measures;
  const [fieldOption, setFieldOption] = useState(
    JSON.parse(JSON.stringify(measure.filter((item) => item.fieldFormat))),
  );
  const valueOption = measure.map((item) => {
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
        measure.forEach((measureItem) => {
          delete measureItem['fieldFormat'];
          fieldOption.forEach((fieldOptionItem) => {
            if (measureItem.field[0] === fieldOptionItem?.fieldFormat?.fieldValue) {
              measureItem['fieldFormat'] = { ...fieldOptionItem.fieldFormat };
            }
          });
        });

        fieldSchema['x-decorator-props']['params'].measures = measure;
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
                options={valueOption}
                placeholder="Field"
                style={{ marginRight: '5px' }}
                value={item?.fieldFormat?.fieldValue ? item?.fieldFormat?.fieldValue : undefined}
                onChange={(v) => {
                  fieldConfig('field', fieldOption, setFieldOption, index, v);
                }}
              />
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
