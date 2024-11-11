import React from 'react';
import { DataBlockProvider } from '@tachybase/client';

export const TabSearchProvider = (props) => {
  return <DataBlockProvider collection={props.collection}>{props.children}</DataBlockProvider>;
};
