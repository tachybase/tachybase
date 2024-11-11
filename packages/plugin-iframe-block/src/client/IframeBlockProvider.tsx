import React from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import { Iframe } from './Iframe';
import { IframeBlockInitializer } from './IframeBlockInitializer';

export const IframeBlockProvider = (props: any) => {
  return (
    <SchemaComponentOptions components={{ Iframe, IframeBlockInitializer }}>{props.children}</SchemaComponentOptions>
  );
};
