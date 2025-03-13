import React, { Fragment } from 'react';

import { observer } from '../../reactive-react';
import { isFn } from '../../shared';
import { useForm } from '../hooks';
import { IFormSpyProps, ReactFC } from '../types';

export const FormConsumer: ReactFC<IFormSpyProps> = observer((props) => {
  const children = isFn(props.children) ? props.children(useForm()) : null;
  return <Fragment>{children}</Fragment>;
});

FormConsumer.displayName = 'FormConsumer';
