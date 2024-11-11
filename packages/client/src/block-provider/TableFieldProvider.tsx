import React, { createContext, useContext, useEffect } from 'react';
import { ArrayField, Field, useField, useFieldSchema } from '@tachybase/schema';

import { APIClient } from '../api-client';
import { BlockProvider, useBlockRequestContext } from './BlockProvider';
import { useFormBlockContext } from './FormBlockProvider';
import { useFormFieldContext } from './FormFieldProvider';

export const TableFieldContext = createContext<any>({});
TableFieldContext.displayName = 'TableFieldContext';

const InternalTableFieldProvider = (props) => {
  const { params = {}, showIndex, dragSort, fieldName } = props;
  const field = useField();
  const fieldSchema = useFieldSchema();
  const { resource, service } = useBlockRequestContext();

  const formBlockCtx = useFormBlockContext();
  const formFieldCtx = useFormFieldContext();

  const fullFieldName = formFieldCtx && formFieldCtx.fieldName ? `${formFieldCtx.fieldName}.${fieldName}` : fieldName;

  if (!formBlockCtx?.updateAssociationValues?.includes(fullFieldName)) {
    formBlockCtx?.updateAssociationValues?.push(fullFieldName);
  }
  return (
    <TableFieldContext.Provider
      value={{
        field,
        fieldSchema,
        service,
        resource,
        params,
        showIndex,
        dragSort,
      }}
    >
      {props.children}
    </TableFieldContext.Provider>
  );
};

export class TableFieldResource {
  field: Field;
  api: APIClient;
  sourceId: any;
  resource?: any;

  constructor(options) {
    this.field = options.field;
    this.api = options.api;
    this.sourceId = options.sourceId;
    this.resource = this.api.resource(options.resource, this.sourceId);
  }

  async list(options) {
    this.field.data = this.field.data || {};
    if (this.field.data.changed) {
      return {
        data: {
          data: this.field.data.dataSource,
        },
      };
    }
    if (!this.sourceId) {
      this.field.data.dataSource = [];
      return {
        data: {
          data: [],
        },
      };
    }
    const response = await this.resource.list(options);
    this.field.data.dataSource = response.data.data;
    return {
      data: {
        data: response.data.data,
      },
    };
  }

  async get(options) {
    const { filterByTk } = options;
    return {
      data: {
        data: this.field.data.dataSource[filterByTk],
      },
    };
  }

  async create(options) {
    const { values } = options;
    this.field.data.dataSource.push(values);
    this.field.data.changed = true;
  }

  async update(options) {
    const { filterByTk, values } = options;
    this.field.data.dataSource[filterByTk] = values;
    this.field.data.changed = true;
  }

  async destroy(options) {
    let { filterByTk } = options;
    if (!Array.isArray(filterByTk)) {
      filterByTk = [filterByTk];
    }
    this.field.data.dataSource = this.field.data.dataSource.filter((item, index) => {
      return !filterByTk.includes(index);
    });
    this.field.data.changed = true;
  }
}

export const WithoutTableFieldResource = createContext(null);
WithoutTableFieldResource.displayName = 'WithoutTableFieldResource';

export const TableFieldProvider = (props) => {
  return (
    <WithoutTableFieldResource.Provider value={false}>
      <BlockProvider name="table-field" block={'TableField'} {...props}>
        <InternalTableFieldProvider {...props} />
      </BlockProvider>
    </WithoutTableFieldResource.Provider>
  );
};

export const useTableFieldContext = () => {
  return useContext(TableFieldContext);
};

export const useTableFieldProps = () => {
  const field = useField<ArrayField>();
  const ctx = useTableFieldContext();
  useEffect(() => {
    if (!ctx?.service?.loading) {
      field.value = ctx?.service?.data?.data;
      field.data = field.data || {};
      field.data.selectedRowKeys = ctx?.field?.data?.selectedRowKeys;
    }
  }, [ctx?.field?.data?.selectedRowKeys, ctx?.service?.data?.data, ctx?.service?.loading, field]);
  return {
    size: 'middle',
    loading: ctx?.service?.loading,
    showIndex: ctx.showIndex,
    dragSort: ctx.dragSort,
    pagination: false,
    required: ctx?.fieldSchema?.parent?.required,
    rowKey: (record: any) => {
      return field.value?.indexOf?.(record);
    },
    onRowSelectionChange(selectedRowKeys) {
      ctx.field.data = ctx?.field?.data || {};
      ctx.field.data.selectedRowKeys = selectedRowKeys;
    },
    onChange({ current, pageSize }) {
      ctx.service.run({ page: current, pageSize });
    },
  };
};
