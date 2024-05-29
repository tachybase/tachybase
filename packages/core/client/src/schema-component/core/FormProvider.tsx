import React, { useContext, useMemo } from 'react';
import {
  createForm,
  FormProvider as FormilyFormProvider,
  SchemaExpressionScopeContext,
  SchemaOptionsContext,
} from '@tachybase/schema';

import { SchemaComponentOptions } from './SchemaComponentOptions';

const WithForm = (props: any) => {
  const { children, form, ...others } = props;
  const options = useContext(SchemaOptionsContext);
  const expressionScope = useContext(SchemaExpressionScopeContext);
  const scope = { ...options?.scope, ...expressionScope };
  const components = { ...options?.components };
  return (
    <FormilyFormProvider {...others} form={form}>
      <SchemaComponentOptions components={components} scope={scope}>
        {children}
      </SchemaComponentOptions>
    </FormilyFormProvider>
  );
};

const WithoutForm = (props: any) => {
  const { children, ...others } = props;
  const options = useContext(SchemaOptionsContext);
  const expressionScope = useContext(SchemaExpressionScopeContext);
  const scope = { ...options?.scope, ...expressionScope };
  const components = { ...options?.components };
  const form = useMemo(() => createForm(), []);
  return (
    <FormilyFormProvider {...others} form={form}>
      <SchemaComponentOptions components={components} scope={scope}>
        {children}
      </SchemaComponentOptions>
    </FormilyFormProvider>
  );
};

export const FormProvider = (props: any) => {
  return props.form ? <WithForm {...props} /> : <WithoutForm {...props} />;
};
