import { MenuOutlined } from '@ant-design/icons';
import { TinyColor } from '@ctrl/tinycolor';
import { css } from '@emotion/css';
import { ArrayField, Field } from '@nocobase/schema';
import {
  RecursionField,
  Schema,
  SchemaExpressionScopeContext,
  observer,
  useField,
  useFieldSchema,
} from '@nocobase/schema';
import { Table, TableColumnProps } from 'antd';
import { default as classNames, default as cls } from 'classnames';
import React, { useContext, useState } from 'react';
import ReactDragListView from 'react-drag-listview';
import { DndContext } from '../..';
import {
  RecordIndexProvider,
  RecordProvider,
  useCollectionParentRecordData,
  useCollectionRecordData,
  useRequest,
  useSchemaInitializerRender,
} from '../../../';
import { useToken } from '../__builtins__';

const isColumnComponent = (schema: Schema) => {
  return schema['x-component']?.endsWith('.Column') > -1;
};

const useTableColumns = () => {
  const field = useField<ArrayField>();
  const schema = useFieldSchema();
  const { exists, render } = useSchemaInitializerRender(schema['x-initializer'], schema['x-initializer-props']);
  const scope = useContext(SchemaExpressionScopeContext);
  const parentRecordData = useCollectionParentRecordData();
  const recordData = useCollectionRecordData();

  const columns = schema
    .reduceProperties((buf, s) => {
      if (isColumnComponent(s) && scope[s['x-visible'] as unknown as string] !== false) {
        return buf.concat([s]);
      }
      return buf;
    }, [])
    .map((s: Schema) => {
      return {
        title: <RecursionField name={s.name} schema={s} onlyRenderSelf />,
        dataIndex: s.name,
        key: s.name,
        render: (v, record) => {
          const index = field.value?.indexOf(record);
          return (
            <RecordIndexProvider index={index}>
              {/* fix https://nocobase.height.app/T-3232/description */}
              {/* 如果作为关系表格区块，则 parentRecordData 应该有值；如果作为普通表格使用（如数据源管理页面的表格）则应该使用 recordData，且 parentRecordData 为空 */}
              <RecordProvider record={record} parent={parentRecordData || recordData}>
                <RecursionField schema={s} name={record.__index || index} onlyRenderProperties />
              </RecordProvider>
            </RecordIndexProvider>
          );
        },
      } as TableColumnProps<any>;
    });
  if (!exists) {
    return columns;
  }
  return columns.concat({
    title: render(),
    dataIndex: 'TABLE_COLUMN_INITIALIZER',
    key: 'TABLE_COLUMN_INITIALIZER',
  });
};

export const components = {
  header: {
    wrapper: (props) => {
      return (
        <DndContext>
          <thead {...props} />
        </DndContext>
      );
    },
    cell: (props) => {
      return (
        <th
          {...props}
          className={cls(
            props.className,
            css`
              &:hover .general-schema-designer {
                display: block;
              }
            `,
          )}
        />
      );
    },
  },
  body: {
    wrapper: (props) => {
      return (
        <DndContext>
          <tbody {...props} />
        </DndContext>
      );
    },
    row: (props) => {
      return <tr {...props} />;
    },
    cell: (props) => (
      <td
        {...props}
        className={classNames(
          props.className,
          css`
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          `,
        )}
      />
    ),
  },
};

const useDef = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  return [selectedRowKeys, setSelectedRowKeys];
};

const useDefDataSource = (options, props) => {
  const field = useField<Field>();
  return useRequest(() => {
    return Promise.resolve({
      data: field.value,
    });
  }, options);
};

const SortHandle = (props) => {
  return <MenuOutlined className={'drag-handle'} style={{ cursor: 'grab' }} {...props} />;
};

const TableIndex = (props) => {
  const { index, ...otherProps } = props;
  return (
    <div className={classNames('nb-table-index')} style={{ padding: '0 8px 0 16px' }} {...otherProps}>
      {index + 1}
    </div>
  );
};

const useDefAction = () => {
  return {
    async move() {},
  };
};

export const TableArray: React.FC<any> = observer(
  (props) => {
    const { token } = useToken();
    const field = useField<ArrayField>();
    const columns = useTableColumns();
    const {
      dragSort = false,
      showIndex = true,
      useSelectedRowKeys = useDef,
      useDataSource = useDefDataSource,
      useAction = useDefAction,
      onChange,
      ...others
    } = props;
    const [selectedRowKeys, setSelectedRowKeys] = useSelectedRowKeys();
    useDataSource({
      onSuccess(data) {
        field.value = data?.data || [];
      },
    });
    const { move } = useAction();
    const restProps = {
      rowSelection: props.rowSelection
        ? {
            type: 'checkbox',
            selectedRowKeys,
            onChange(selectedRowKeys: any[]) {
              setSelectedRowKeys(selectedRowKeys);
            },
            getCheckboxProps: (record: any) => {
              return {
                'aria-label': `checkbox-${record.name}`,
              };
            },
            renderCell: (checked, record, index, originNode) => {
              const current = props?.pagination?.current;
              const pageSize = props?.pagination?.pageSize || 20;
              if (current) {
                index = index + (current - 1) * pageSize;
              }
              return (
                <div
                  className={classNames(
                    checked ? 'checked' : null,
                    css`
                      position: relative;
                      display: flex;
                      align-items: center;
                      justify-content: space-evenly;
                      padding-right: 8px;
                      .nb-table-index {
                        opacity: 0;
                      }
                      &:not(.checked) {
                        .nb-table-index {
                          opacity: 1;
                        }
                      }
                      &:hover {
                        .nb-table-index {
                          opacity: 0;
                        }
                        .nb-origin-node {
                          display: block;
                        }
                      }
                    `,
                  )}
                >
                  <div
                    className={classNames(
                      checked ? 'checked' : null,
                      css`
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: space-evenly;
                      `,
                    )}
                  >
                    {dragSort && <SortHandle role="button" aria-label={`sort-handle-${record?.name || index}`} />}
                    {showIndex && (
                      <TableIndex role="button" aria-label={`table-index-${record?.name || index}`} index={index} />
                    )}
                  </div>
                  <div
                    className={classNames(
                      'nb-origin-node',
                      checked ? 'checked' : null,
                      css`
                        position: absolute;
                        right: 50%;
                        transform: translateX(50%);
                        &:not(.checked) {
                          display: none;
                        }
                      `,
                    )}
                  >
                    {originNode}
                  </div>
                </div>
              );
            },
            ...props.rowSelection,
          }
        : undefined,
    };

    const defaultRowKey = (record: any) => {
      return field.value?.indexOf?.(record);
    };

    return (
      <div
        className={css`
          .ant-table {
            overflow-x: auto;
            overflow-y: hidden;
          }
        `}
      >
        <ReactDragListView
          handleSelector={'.drag-handle'}
          onDragEnd={async (fromIndex, toIndex) => {
            const from = field.value[fromIndex];
            const to = field.value[toIndex];
            field.move(fromIndex, toIndex);
            await move(from, to);
          }}
          lineClassName={css`
            border-bottom: 2px solid ${new TinyColor(token.colorSettings).setAlpha(0.6).toHex8String()} !important;
          `}
        >
          <Table
            rowKey={defaultRowKey}
            {...others}
            {...restProps}
            components={components}
            columns={columns}
            dataSource={field?.value?.slice?.()}
          />
        </ReactDragListView>
      </div>
    );
  },
  { displayName: 'TableArray' },
);
