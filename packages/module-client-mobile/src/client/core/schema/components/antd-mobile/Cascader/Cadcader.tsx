import React from 'react';
import { AssociationField, useCollectionManager } from '@tachybase/client';
import { connect, mapProps, mapReadPretty, useFieldSchema } from '@tachybase/schema';

import { InternalCascader } from './AntdCadcader';
import { ReadPretty } from './ReadPretty';

export const MCascader = connect(
  InternalCascader,
  mapProps((props) => {
    return { ...props };
  }),
  mapReadPretty((props) => {
    const fieldSchema = useFieldSchema();
    const cm = useCollectionManager();
    const collectionField = cm.getCollectionField(fieldSchema['x-collection-field']);
    const isChinaRegion = collectionField.interface === 'chinaRegion';
    return isChinaRegion ? <ReadPretty {...props} /> : <AssociationField.ReadPretty {...props} />;
  }),
);
