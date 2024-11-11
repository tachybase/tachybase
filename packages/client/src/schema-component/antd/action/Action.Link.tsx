import React from 'react';
import { observer } from '@tachybase/schema';

import classnames from 'classnames';

import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import Action from './Action';
import { ComposedAction } from './types';

export const ActionLink: ComposedAction = withDynamicSchemaProps(
  observer((props: any) => {
    return (
      <Action {...props} component={props.component || 'a'} className={classnames('tb-action-link', props.className)} />
    );
  }),
  { displayName: 'ActionLink' },
);
