import { useCallback, useState } from 'react';
import { useBlockRequestContext, withDynamicSchemaProps } from '@tachybase/client';
import { Field, RecursionField, Schema, useField, useFieldSchema } from '@tachybase/schema';

import { List, Spin } from 'antd';

import { styles } from './styles';

export const CommentList = withDynamicSchemaProps((props) => {
  const fieldSchema = useFieldSchema();
  const field = useField<Field>();
  const [schemaState] = useState(new Map());
  const { wrapSSR, hashId, componentCls } = styles();

  const { service } = useBlockRequestContext();
  const { run, params } = service;

  const metaData = service?.data?.meta;

  const getFieldSchema = useCallback(
    (index) => {
      if (schemaState.has(index)) {
        return schemaState.get(index);
      }

      const newSchema = new Schema({
        type: 'object',
        properties: {
          [index]: fieldSchema.properties.item,
        },
      });
      schemaState.set(index, newSchema);

      return newSchema;
    },
    [fieldSchema.properties, schemaState],
  );

  const handleChangePage = useCallback(
    (page, pageSize) => {
      run({
        ...params?.[0],
        page,
        pageSize,
      });
    },
    [run, params],
  );

  const pagination =
    !metaData || metaData.count <= metaData.pageSize
      ? false
      : {
          onChange: handleChangePage,
          total: metaData?.count || 0,
          pageSize: metaData?.pageSize || 10,
          current: metaData?.page || 1,
        };

  if (service?.loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Spin spinning={true} />
      </div>
    );
  }

  return wrapSSR(
    <div className={`${componentCls} ${hashId}`}>
      <List {...props} pagination={pagination}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {field.value?.length
            ? field.value.map((val, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      padding: `${index === 0 ? 0 : '10px'} 0 ${index === field.value.length - 1 ? 0 : '10px'} 0`,
                    }}
                  >
                    <RecursionField
                      basePath={field.address}
                      name={index}
                      onlyRenderProperties={true}
                      schema={getFieldSchema(index)}
                    />
                  </div>
                );
              })
            : null}
        </div>
      </List>
    </div>,
  );
});
