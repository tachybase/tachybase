import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  action,
  ArrayField,
  observer,
  RecursionField,
  Schema,
  spliceArrayState,
  uid,
  useField,
  useFieldSchema,
} from '@tachybase/schema';
import { isPortalInBody } from '@tachybase/utils/client';

import { CopyOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons';
import { SortableContext, SortableContextProps, useSortable } from '@dnd-kit/sortable';
import { useMemoizedFn } from 'ahooks';
import { Table as AntdTable, TableColumnProps } from 'antd';
import { default as classNames, default as cls } from 'classnames';
import _, { each } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useToken } from '../__builtins__';
import { DndContext, useDesignable, useTableSize } from '../..';
import {
  RecordIndexProvider,
  RecordProvider,
  useACLFieldWhitelist,
  useCollection,
  useCollection_deprecated,
  useCollectionParentRecordData,
  useSchemaInitializerRender,
  useTableBlockContext,
  useTableSelectorContext,
} from '../../../';
import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import { isNewRecord, markRecordAsNew } from '../../../data-source/collection-record/isNewRecord';
import { DeclareVariable } from '../../../modules/variable/DeclareVariable';
import { SubFormProvider } from '../association-field/hooks';
import { ColumnFieldProvider } from './components/ColumnFieldProvider';
import { useStyles } from './Table.styles';
import { extractIndex, isCollectionFieldComponent, isColumnComponent } from './utils';

const useArrayField = (props) => {
  const field = useField<ArrayField>();
  return (props.field || field) as ArrayField;
};

const useTableColumns = (props: { showDel?: boolean; isSubTable?: boolean; setFieldValue?: any }) => {
  const { t } = useTranslation();
  const { styles } = useStyles();
  const field = useArrayField(props);
  const schema = useFieldSchema();
  const { schemaInWhitelist } = useACLFieldWhitelist();
  const { designable } = useDesignable();
  const { exists, render } = useSchemaInitializerRender(schema['x-initializer'], schema['x-initializer-props']);
  const parentRecordData = useCollectionParentRecordData();
  const collection = useCollection();

  const dataSource = field?.value?.slice?.()?.filter?.(Boolean) || [];
  const columns = schema
    .reduceProperties((buf, s) => {
      if (isColumnComponent(s) && schemaInWhitelist(Object.values(s.properties || {}).pop())) {
        return buf.concat([s]);
      }
      return buf;
    }, [])
    ?.map((s: Schema) => {
      const collectionFields = s.reduceProperties((buf, s) => {
        if (isCollectionFieldComponent(s)) {
          return buf.concat([s]);
        }
      }, []);
      const dataIndex = collectionFields?.length > 0 ? collectionFields[0].name : s.name;
      return {
        title: <RecursionField name={s.name} schema={s} onlyRenderSelf />,
        dataIndex,
        key: s.name,
        sorter: s['x-component-props']?.['sorter'],
        width: 200,
        ...s['x-component-props'],
        render: (v, record) => {
          const index = field.value?.indexOf(record);
          return (
            <DeclareVariable
              name="$nPopupRecord"
              title={t('Current popup record')}
              value={record}
              collection={collection}
            >
              <SubFormProvider value={{ value: record, collection }}>
                <RecordIndexProvider index={record.__index || index}>
                  <RecordProvider isNew={isNewRecord(record)} record={record} parent={parentRecordData}>
                    <ColumnFieldProvider schema={s} basePath={field.address.concat(record.__index || index)}>
                      <span role="button" className={styles.toolbar}>
                        <RecursionField
                          basePath={field.address.concat(record.__index || index)}
                          schema={s}
                          onlyRenderProperties
                        />
                      </span>
                    </ColumnFieldProvider>
                  </RecordProvider>
                </RecordIndexProvider>
              </SubFormProvider>
            </DeclareVariable>
          );
        },
      } as TableColumnProps<any>;
    });
  if (!exists) {
    return columns;
  }

  const tableColumns = columns.concat({
    title: render(),
    fixed: 'right',
    dataIndex: 'TABLE_COLUMN_INITIALIZER',
    key: 'TABLE_COLUMN_INITIALIZER',
    render: designable ? () => <span /> : null,
  });

  if (props.showDel) {
    tableColumns.push({
      title: '',
      key: 'delete',
      width: 60,
      align: 'center',
      fixed: 'right',
      render: (v, record, index) => {
        return (
          <>
            <CopyOutlined
              style={{ cursor: 'pointer', marginRight: '10px' }}
              onClick={() => {
                action(() => {
                  if (!Array.isArray(field.value)) {
                    field.value = [];
                  }
                  spliceArrayState(field as any, {
                    startIndex: index + 1,
                    insertCount: 1,
                  });
                  field.value.splice(index + 1, 0, markRecordAsNew(_.cloneDeep(record)));
                  each(field.form.fields, (targetField, key) => {
                    if (!targetField) {
                      delete field.form.fields[key];
                    }
                  });
                  return field.onInput(field.value);
                });
              }}
            />
            <DeleteOutlined
              style={{ cursor: 'pointer' }}
              onClick={() => {
                action(() => {
                  const index = dataSource.indexOf(record);
                  spliceArrayState(field as any, {
                    startIndex: index,
                    deleteCount: 1,
                  });
                  field.value.splice(index, 1);
                  field.initialValue?.splice(index, 1);
                  props.setFieldValue([...field.value]);
                  return field.onInput(field.value);
                });
              }}
            />
          </>
        );
      },
    });
  }

  return [
    ...tableColumns.filter((column) => column.fixed === 'left'),
    ...tableColumns.filter((column) => !column.fixed || (column.fixed !== 'left' && column.fixed !== 'right')),
    ...tableColumns.filter((column) => column.fixed === 'right'),
  ];
};

const SortableRow = (props) => {
  const { styles } = useStyles();
  const id = props['data-row-key']?.toString();
  const { setNodeRef, isOver, active, over } = useSortable({
    id,
  });

  const className =
    (active?.data.current?.sortable.index ?? -1) > (over?.data.current?.sortable?.index ?? -1)
      ? styles.topActive
      : styles.bottomActive;

  return (
    <tr
      ref={active?.id !== id ? setNodeRef : null}
      {...props}
      className={classNames(props.className, { [className]: active && isOver })}
    />
  );
};

const SortHandle = (props) => {
  const { id, ...otherProps } = props;
  const { listeners } = useSortable({
    id,
  });
  return <MenuOutlined {...otherProps} {...listeners} style={{ cursor: 'grab' }} />;
};

const TableIndex = (props) => {
  const { index, ...otherProps } = props;
  return (
    <div className={classNames('tb-table-index')} style={{ padding: '0 8px 0 16px' }} {...otherProps}>
      {index}
    </div>
  );
};

const pageSizeOptions = [5, 10, 20, 50, 100, 200];
const usePaginationProps = (pagination1, pagination2) => {
  const { t } = useTranslation();
  const showTotal = useCallback((total) => t('Total {{count}} items', { count: total }), [t]);

  if (pagination2 === false) {
    return false;
  }
  if (!pagination2 && pagination1 === false) {
    return false;
  }
  const result = {
    showTotal,
    showSizeChanger: true,
    pageSizeOptions,
    ...pagination1,
    ...pagination2,
  };
  return result.total ? result : false;
};

export const Table: any = withDynamicSchemaProps(
  observer(
    (props: {
      useProps?: () => any;
      onChange?: (pagination, filters, sorter, extra) => void;
      onRowSelectionChange?: (selectedRowKeys: any[], selectedRows: any[]) => void;
      onRowDragEnd?: (e: { from: any; to: any }) => void;
      onClickRow?: (record: any, setSelectedRow: (selectedRow: any[]) => void, selectedRow: any[]) => void;
      pagination?: any;
      showIndex?: boolean;
      dragSort?: boolean;
      rowKey?: string | ((record: any) => string);
      rowSelection?: any;
      required?: boolean;
      onExpand?: (flag: boolean, record: any) => void;
      isSubTable?: boolean;
    }) => {
      const { token } = useToken();
      const { styles } = useStyles();
      const { pagination: pagination1, useProps, ...others1 } = props;

      // 新版 UISchema（1.0 之后）中已经废弃了 useProps，这里之所以继续保留是为了兼容旧版的 UISchema
      const { pagination: pagination2, ...others2 } = useProps?.() || {};

      const {
        dragSort = false,
        showIndex = true,
        onRowSelectionChange,
        onChange: onTableChange,
        rowSelection,
        rowKey,
        required,
        onExpand,
        onClickRow,
        ...others
      } = { ...others1, ...others2 } as any;
      const field = useArrayField(others);
      const columns = useTableColumns(others);
      const schema = useFieldSchema();
      const collection = useCollection_deprecated();
      const isTableSelector = schema?.parent?.['x-decorator'] === 'TableSelectorProvider';
      const ctx = isTableSelector ? useTableSelectorContext() : useTableBlockContext();
      const { expandFlag, allIncludesChildren } = ctx;
      const onRowDragEnd = useMemoizedFn(others.onRowDragEnd || (() => {}));
      const paginationProps = usePaginationProps(pagination1, pagination2);
      const [expandedKeys, setExpandesKeys] = useState([]);
      const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>(field?.data?.selectedRowKeys || []);
      const [selectedRow, setSelectedRow] = useState([]);
      const dataSource = field?.value?.slice?.()?.filter?.(Boolean) || [];
      const isRowSelect = rowSelection?.type !== 'none';
      const defaultRowKeyMap = useRef(new Map());
      let onRow = null,
        highlightRow = '';

      if (onClickRow) {
        onRow = (record) => {
          return {
            onClick: (e) => {
              if (isPortalInBody(e.target)) {
                return;
              }
              onClickRow(record, setSelectedRow, selectedRow);
            },
          };
        };
        highlightRow = styles.highlightRow;
      }

      useEffect(() => {
        if (expandFlag) {
          setExpandesKeys(allIncludesChildren);
        } else {
          setExpandesKeys([]);
        }
      }, [expandFlag, allIncludesChildren]);

      const components = useMemo(() => {
        return {
          header: {
            wrapper: (props) => {
              return (
                <DndContext>
                  <thead {...props} />
                </DndContext>
              );
            },
            cell: (props) => {
              return <th {...props} className={cls(props.className, styles.headerCellDesigner)} />;
            },
          },
          body: {
            wrapper: (props) => {
              return (
                <DndContext
                  onDragEnd={(e) => {
                    if (!e.active || !e.over) {
                      console.warn('move cancel');
                      return;
                    }
                    const fromIndex = e.active?.data.current?.sortable?.index;
                    const toIndex = e.over?.data.current?.sortable?.index;
                    const from = field.value[fromIndex] || e.active;
                    const to = field.value[toIndex] || e.over;
                    void field.move(fromIndex, toIndex);
                    onRowDragEnd({ from, to });
                  }}
                >
                  <tbody {...props} />
                </DndContext>
              );
            },
            row: (props) => {
              return <SortableRow {...props}></SortableRow>;
            },
            cell: (props) => <td {...props} className={classNames(props.className, styles.bodyCell)} />,
          },
        };
      }, [field, onRowDragEnd, dragSort]);

      /**
       * 为没有设置 key 属性的表格行生成一个唯一的 key
       * 1. rowKey 的默认值是 “key”，所以先判断有没有 record.key；
       * 2. 如果没有就生成一个唯一的 key，并以 record 的值作为索引；
       * 3. 这样下次就能取到对应的 key 的值；
       *
       * 这里有效的前提是：数组中对应的 record 的引用不会发生改变。
       *
       * @param record
       * @returns
       */
      const defaultRowKey = (record: any) => {
        if (record.key) {
          return record.key;
        }

        if (defaultRowKeyMap.current.has(record)) {
          return defaultRowKeyMap.current.get(record);
        }

        const key = uid();
        defaultRowKeyMap.current.set(record, key);
        return key;
      };

      const getRowKey = (record: any) => {
        if (typeof rowKey === 'string') {
          return record[rowKey]?.toString();
        } else {
          return (rowKey ?? defaultRowKey)(record)?.toString();
        }
      };

      const restProps = {
        rowSelection: rowSelection
          ? {
              type: 'checkbox',
              selectedRowKeys: selectedRowKeys,
              onChange(selectedRowKeys: any[], selectedRows: any[]) {
                field.data = field.data || {};
                field.data.selectedRowKeys = selectedRowKeys;
                setSelectedRowKeys(selectedRowKeys);
                onRowSelectionChange?.(selectedRowKeys, selectedRows);
              },
              getCheckboxProps(record) {
                return {
                  'aria-label': `checkbox`,
                };
              },
              renderCell: (checked, record, index, originNode) => {
                if (!dragSort && !showIndex) {
                  return originNode;
                }
                const current = props?.pagination?.current;
                const pageSize = props?.pagination?.pageSize || 20;
                if (current) {
                  index = index + (current - 1) * pageSize + 1;
                } else {
                  index = index + 1;
                }
                if (record.__index) {
                  index = extractIndex(record.__index);
                }
                return (
                  <div
                    role="button"
                    aria-label={`table-index-${index}`}
                    className={classNames(checked ? 'checked' : null, styles.rowSelect, {
                      [styles.rowSelectHover]: isRowSelect,
                    })}
                  >
                    <div className={classNames(checked ? 'checked' : null, styles.cellChecked)}>
                      {dragSort && <SortHandle id={getRowKey(record)} />}
                      {showIndex && <TableIndex index={index} />}
                    </div>
                    {isRowSelect && (
                      <div className={classNames('tb-origin-node', checked ? 'checked' : null, styles.cellCheckedNode)}>
                        {originNode}
                      </div>
                    )}
                  </div>
                );
              },
              ...rowSelection,
            }
          : undefined,
      };
      const SortableWrapper = useCallback(
        ({ children }) => {
          return dragSort
            ? React.createElement<Omit<SortableContextProps, 'children'>>(
                SortableContext,
                {
                  items: field.value?.map?.(getRowKey) || [],
                },
                children,
              )
            : React.createElement(React.Fragment, {}, children);
        },
        [field, dragSort],
      );
      const fieldSchema = useFieldSchema();
      const fixedBlock = fieldSchema?.parent?.['x-decorator-props']?.fixedBlock;

      const { height: tableHeight, tableSizeRefCallback } = useTableSize();
      const scroll = useMemo(() => {
        return fixedBlock
          ? {
              x: 'max-content',
              y: tableHeight,
            }
          : {
              x: 'max-content',
            };
      }, [fixedBlock, tableHeight]);
      return (
        <div className={styles.container}>
          <SortableWrapper>
            <AntdTable
              ref={tableSizeRefCallback}
              rowKey={rowKey ?? defaultRowKey}
              dataSource={dataSource}
              tableLayout="auto"
              {...others}
              {...restProps}
              pagination={paginationProps}
              components={components}
              onChange={(pagination, filters, sorter, extra) => {
                onTableChange?.(pagination, filters, sorter, extra);
              }}
              onRow={onRow}
              rowClassName={(record) => (selectedRow.includes(record[rowKey]) ? highlightRow : '')}
              scroll={scroll}
              columns={columns}
              expandable={{
                onExpand: (flag, record) => {
                  const newKeys = flag
                    ? [...expandedKeys, record[collection.getPrimaryKey()]]
                    : expandedKeys.filter((i) => record[collection.getPrimaryKey()] !== i);
                  setExpandesKeys(newKeys);
                  onExpand?.(flag, record);
                },
                expandedRowKeys: expandedKeys,
              }}
            />
          </SortableWrapper>
          {field.errors.length > 0 && (
            <div className="ant-formily-item-error-help ant-formily-item-help ant-formily-item-help-enter ant-formily-item-help-enter-active">
              {field.errors.map((error) => {
                return error.messages.map((message) => <div key={message}>{message}</div>);
              })}
            </div>
          )}
        </div>
      );
    },
  ),
  { displayName: 'Table' },
);
