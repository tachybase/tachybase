import React from 'react';
import { connect, mapProps, mapReadPretty, useFieldSchema } from '@tachybase/schema';
import { isArray } from '@tachybase/utils/client';

import { InternalCascader } from './AntdCadcader';
import { ReadPretty } from './ReadPretty';

export const MCascader = connect(
  InternalCascader,
  mapProps((props) => {
    return { ...props };
  }),
  mapReadPretty(ReadPretty),
);
