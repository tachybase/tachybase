import { useContext } from 'react';
import { ActionContext } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { useContextResponseInfo } from '../../../contexts/ResponseInfo.context';

export const useCancelAction = () => {
  const form = useForm();
  const { setVisible } = useContext(ActionContext);
  const { setRawResponse, setDebugResponse } = useContextResponseInfo();
  return {
    run() {
      setVisible(false);
      form.reset();
      form.setValuesIn('responseTab', null);
      setRawResponse(null);
      setDebugResponse(null);
    },
  };
};
