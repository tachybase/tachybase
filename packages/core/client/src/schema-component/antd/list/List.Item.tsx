import React from 'react';
import { ObjectField, useField } from '@tachybase/schema';

import { createStyles } from 'antd-style';
import classnames from 'classnames';

import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import { useCollectionParentRecordData } from '../../../data-source/collection-record/CollectionRecordProvider';
import { RecordProvider } from '../../../record-provider';
import { useDesignable } from '../../hooks';

const useStyles = createStyles(({ css }, props: { designable: boolean }) => {
  return {
    item: css`
      .tb-action-bar {
        gap: 20px !important;
        margin-top: ${props.designable ? '20px' : '0px'};
      }
    `,
  };
});

export const ListItem = withDynamicSchemaProps((props) => {
  const field = useField<ObjectField>();
  const { designable } = useDesignable();
  const { styles } = useStyles({ designable });
  const parentRecordData = useCollectionParentRecordData();
  return (
    <div className={classnames(props.className, ['itemCss', styles.item])}>
      <RecordProvider record={field.value} parent={parentRecordData}>
        {props.children}
      </RecordProvider>
    </div>
  );
});
