import { useContext } from 'react';

import { Form } from '../../core';
import { FormContext } from '../shared';

export const useForm = <T extends object = any>(): Form<T> => {
  return useContext(FormContext);
};
