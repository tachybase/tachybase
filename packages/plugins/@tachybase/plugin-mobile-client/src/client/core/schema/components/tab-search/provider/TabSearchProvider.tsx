import { DataBlockProvider } from '@nocobase/client';
import React from 'react';

export const TabSearchProvider = (props) => {
  return <DataBlockProvider collection={props.collection}>{props.children}</DataBlockProvider>;
};
