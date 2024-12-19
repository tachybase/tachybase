import React, { useEffect, useState } from 'react';
import { FormLayout } from '@tachybase/components';
import { Field, observer, RecursionField, Schema, useField, useForm } from '@tachybase/schema';

import providerTypes, { SMS_PROVIDER_ALIYUN } from './providerTypes';

const DEFAULT_PROVIDER_TYPE = SMS_PROVIDER_ALIYUN;

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
          key={form.values.type || DEFAULT_PROVIDER_TYPE}
          basePath={field.address}
          onlyRenderProperties
          schema={s}
        />
      </FormLayout>
    );
  },
  { displayName: 'ProviderOptions' },
);
