import React, { useEffect, useState } from 'react';
import { EllipsisWithTooltip, useCollectionManager_deprecated, useCompile } from '@tachybase/client';
import { RecursionField, uid, useForm } from '@tachybase/schema';

import { Table } from 'antd';

import { useTranslation } from '../../../locale';

export const PreviewComponent = (props) => {
  const form = useForm();
  const compile = useCompile();
  const { t } = useTranslation();

  const { fields, preview } = props;
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState(preview);

  const { getInterface } = useCollectionManager_deprecated();

  const filterAndMapSchemas = (schemas) => {
    // 过滤出有 source 或 interface 属性的项
    const filteredSchemas = schemas.filter((schema) => schema.source || schema.interface);
    // 如果没有过滤出的项，则返回 undefined
    if (!filteredSchemas) {
      return undefined;
    }

    // 映射过滤出的项，创建新的表格列配置数组
    const columnsConfig = filteredSchemas.map((schema) => {
      const schemaTitle = schema?.uiSchema?.title || schema.name;
      const defaultUiSchema = getInterface(schema.interface)?.default.uiSchema;

      return {
        key: schema.name,
        title: compile(schemaTitle),
        dataIndex: schema.name,
        width: 200,
        render: (text, record, name) => {
          const value = record[schema.name];
          const mySchema = {
            type: 'object',
            properties: {
              [schema.name]: {
                name: `${schema.name}`,
                ...defaultUiSchema,
                'x-read-pretty': true,
                default: schema.interface === 'json' || typeof value == 'object' ? JSON.stringify(value) : value,
              },
            },
          };

          return (
            <EllipsisWithTooltip ellipsis>
              <RecursionField schema={mySchema} name={name} onlyRenderProperties />
            </EllipsisWithTooltip>
          );
        },
      };
    });

    return columnsConfig;
  };

  useEffect(() => {
    setDataSource(preview);
  }, [preview, fields]);

  useEffect(() => {
    setColumns([]);
    const schemaColumns = filterAndMapSchemas(fields);
    setColumns(schemaColumns);
  }, [form.values.fields]);

  return (
    <div key={uid()} style={{ marginBottom: 'var(--nb-spacing)' }}>
      {dataSource?.length > 0 && (
        <>
          <div
            className="ant-formily-item-label"
            style={{ marginTop: 'var(--nb-spacing)', display: 'flex', padding: '0 0 8px' }}
          >
            <div className="ant-formily-item-label-content">
              <span>
                <label>{t('Preview')}</label>
              </span>
            </div>
            <span className="ant-formily-item-colon">:</span>
          </div>
          <Table
            key="preview"
            size="middle"
            pagination={false}
            bordered
            columns={columns}
            dataSource={dataSource}
            scroll={{
              x: 1000,
              y: 300,
            }}
          />
        </>
      )}
    </div>
  );
};
