import React, { createContext, useContext, useEffect, useMemo, useRef } from 'react';
import { createForm, Form, Schema, useField } from '@tachybase/schema';

import { Spin } from 'antd';

import { withDynamicSchemaProps } from '../application/hoc/withDynamicSchemaProps';
import {
  CollectionRecord,
  useCollectionManager,
  useCollectionParentRecordData,
  useCollectionRecord,
} from '../data-source';
import { RecordProvider, useRecord } from '../record-provider';
import { useActionContext } from '../schema-component';
import { BlockProvider, useBlockRequestContext } from './BlockProvider';
import { FormActiveFieldsProvider } from './hooks/useFormActiveFields';

export const FormBlockContext = createContext<{
  form?: any;
  type?: 'update' | 'create';
  action?: string;
  field?: any;
  service?: any;
  resource?: any;
  updateAssociationValues?: any;
  formBlockRef?: any;
  collectionName?: string;
  params?: any;
  formRecord?: CollectionRecord;
  [key: string]: any;
}>({});
FormBlockContext.displayName = 'FormBlockContext';

const InternalFormBlockProvider = (props) => {
  const cm = useCollectionManager();
  const ctx = useFormBlockContext();
  const { action, readPretty, params, collection, association } = props;
  const field = useField();
  const form = useMemo(
    () =>
      createForm({
        readPretty,
      }),
    [readPretty],
  );
  const { resource, service, updateAssociationValues } = useBlockRequestContext();
  const formBlockRef = useRef();
  const record = useCollectionRecord();
  const formBlockValue: any = useMemo(() => {
    return {
      ...ctx,
      params,
      action,
      form,
      // update 表示是表单编辑区块，create 表示是表单新增区块
      type: action === 'get' ? 'update' : 'create',
      field,
      service,
      resource,
      updateAssociationValues,
      formBlockRef,
      collectionName: collection || cm.getCollectionField(association)?.target,
      formRecord: record,
    };
  }, [
    action,
    association,
    cm,
    collection,
    ctx,
    field,
    form,
    params,
    record,
    resource,
    service,
    updateAssociationValues,
  ]);

  if (service.loading && Object.keys(form?.initialValues)?.length === 0 && action) {
    return <Spin />;
  }

  return (
    <FormBlockContext.Provider value={formBlockValue}>
      <RecordProvider isNew={record?.isNew} parent={record?.parentRecord?.data} record={record?.data}>
        <div ref={formBlockRef}>{props.children}</div>
      </RecordProvider>
    </FormBlockContext.Provider>
  );
};

/**
 * @internal
 * 获取表单区块的类型：update 表示是表单编辑区块，create 表示是表单新增区块
 * @returns
 */
export const useFormBlockType = () => {
  const ctx = useFormBlockContext() || {};
  const res = useMemo(() => {
    return { type: ctx.type } as { type: 'update' | 'create' };
  }, [ctx.type]);

  return res;
};

export const useIsDetailBlock = () => {
  const ctx = useFormBlockContext();
  const { fieldSchema } = useActionContext();
  return ctx.type !== 'create' && fieldSchema?.['x-acl-action'] !== 'create' && fieldSchema?.['x-action'] !== 'create';
};

export const FormBlockProvider = withDynamicSchemaProps((props) => {
  const parentRecordData = useCollectionParentRecordData();
  const { parentRecord } = props;

  return (
    <BlockProvider
      name={props.name || 'form'}
      {...props}
      block={'form'}
      parentRecord={parentRecord || parentRecordData}
    >
      <FormActiveFieldsProvider name="form">
        <InternalFormBlockProvider {...props} />
      </FormActiveFieldsProvider>
    </BlockProvider>
  );
});

/**
 * @internal
 * @returns
 */
export const useFormBlockContext = () => {
  return useContext(FormBlockContext);
};

/**
 * @internal
 */
export const useFormBlockProps = (shouldClearInitialValues = false) => {
  const ctx = useFormBlockContext();
  const record = useRecord();
  const { fieldSchema } = useActionContext();
  const addChild = fieldSchema?.['x-component-props']?.addChild;
  useEffect(() => {
    if (addChild) {
      ctx.form?.query('parent').take((field) => {
        field.disabled = true;
        field.value = new Proxy({ ...record?.__parent }, {});
      });
    }
  });

  useEffect(() => {
    if (!ctx?.service?.loading) {
      ctx.form?.setInitialValues(ctx.service?.data?.data);
    }
  }, [ctx?.service?.loading]);
  return {
    form: ctx.form,
  };
};

/**
 * @internal
 */
export const findFormBlock = (schema: Schema) => {
  while (schema) {
    if (schema['x-decorator'] === 'FormBlockProvider') {
      return schema;
    }
    schema = schema.parent;
  }
  return null;
};
