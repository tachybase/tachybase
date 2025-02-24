import React from 'react';

import { useField, useForm } from '../hooks';
import { useAttach } from '../hooks/useAttach';
import { FieldContext } from '../shared';
import { IVoidFieldProps, JSXComponent } from '../types';
import { ReactiveField } from './ReactiveField';

export const VoidField = <D extends JSXComponent, C extends JSXComponent>(props: IVoidFieldProps<D, C>) => {
  const form = useForm();
  const parent = useField();
  const field = useAttach(form.createVoidField({ basePath: parent?.address, ...props }));
  return (
    <FieldContext.Provider value={field}>
      <ReactiveField field={field}>{props.children}</ReactiveField>
    </FieldContext.Provider>
  );
};

VoidField.displayName = 'VoidField';
