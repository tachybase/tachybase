import React, { useEffect, useState } from 'react';
import { FormLayout } from '@tachybase/components';
import { Field, observer, RecursionField, Schema, useField, useForm } from '@tachybase/schema';

import providerTypes from './providerTypes';

export const ProviderOptions = observer(
  (props) => {
    const form = useForm();
    const field = useField<Field>();
    const [s, setSchema] = useState(new Schema({}));
    useEffect(() => {
      form.clearFormGraph('options.*');
      setSchema(new Schema(providerTypes.get(form.values.type) || {}));
    }, [form.values.type]);
    return (
      <FormLayout layout={'vertical'}>
        <RecursionField
          key={form.values.type || 'sms-aliyun'}
          basePath={field.address}
          onlyRenderProperties
          schema={s}
        />
      </FormLayout>
    );
  },
  { displayName: 'ProviderOptions' },
);
