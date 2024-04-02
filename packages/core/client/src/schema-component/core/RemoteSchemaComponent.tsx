import { createForm } from '@nocobase/schema';
import { Schema } from '@nocobase/schema';
import { Spin } from 'antd';
import React, { useMemo } from 'react';
import { useRequest } from '../../api-client';
import { useSchemaComponentContext } from '../hooks';
import { FormProvider } from './FormProvider';
import { SchemaComponent } from './SchemaComponent';

export interface RemoteSchemaComponentProps {
  scope?: any;
  uid?: string;
  onSuccess?: any;
  components?: any;
  schemaTransform?: (schema: Schema) => Schema;
  render?: any;
  hidden?: any;
  onlyRenderProperties?: boolean;
  noForm?: boolean;
}

const defaultTransform = (s: Schema) => s;

const RequestSchemaComponent: React.FC<RemoteSchemaComponentProps> = (props) => {
  const {
    noForm,
    onlyRenderProperties,
    hidden,
    scope,
    uid,
    components,
    onSuccess,
    schemaTransform = defaultTransform,
  } = props;
  const { reset } = useSchemaComponentContext();
  const conf = {
    url: `/uiSchemas:${onlyRenderProperties ? 'getProperties' : 'getJsonSchema'}/${uid}`,
  };
  const form = useMemo(() => createForm(), [uid]);
  const { data, loading } = useRequest<{
    data: any;
  }>(conf, {
    refreshDeps: [uid],
    onSuccess(data) {
      onSuccess && onSuccess(data);
      reset && reset();
    },
  });
  if (loading || hidden) {
    return;
  }
  return noForm ? (
    <SchemaComponent memoized components={components} scope={scope} schema={schemaTransform(data?.data || {})} />
  ) : (
    <FormProvider form={form}>
      <SchemaComponent memoized components={components} scope={scope} schema={schemaTransform(data?.data || {})} />
    </FormProvider>
  );
};

export const RemoteSchemaComponent: React.FC<RemoteSchemaComponentProps> = (props) => {
  return props.uid ? <RequestSchemaComponent {...props} /> : null;
};
