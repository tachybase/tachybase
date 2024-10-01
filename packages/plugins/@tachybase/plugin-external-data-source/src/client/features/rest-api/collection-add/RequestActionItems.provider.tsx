import React from 'react';
import { createForm, useForm } from '@tachybase/schema';

import { ProviderContextRequestInfo } from '../contexts/RequestForm.context';

export const ProviderRequestActionItems = (props) => {
  const form = useForm();
  const { actionKey } = props;

  const requestActionForm = React.useMemo(() => createForm({}), []);
  const [responseTransformer, setResponseTransformer] = React.useState(null);

  return (
    <ProviderContextRequestInfo
      value={{
        form: {
          ...form,
          [actionKey]: requestActionForm,
        },
        actionKey,
        requestActionForm,
        responseTransformer,
        setResponseTransformer,
      }}
    >
      {props.children}
    </ProviderContextRequestInfo>
  );
};
