import React from 'react';
import { observer } from '@tachybase/schema';

import { createStyles } from 'antd-style';

import { SortableItem, useDesigner } from '../..';

export const useStyles = createStyles(({ css }) => {
  return {
    designer: css`
      position: relative;
      &:hover {
        > .general-schema-designer {
          display: block;
        }
      }
      > .general-schema-designer {
        position: absolute;
        z-index: 999;
        display: none;
        background: var(--colorBgSettingsHover) !important;
        border: 0 !important;
        top: -16px !important;
        bottom: -16px !important;
        left: -16px !important;
        right: -16px !important;
        pointer-events: none;
        > .general-schema-designer-icons {
          position: absolute;
          right: 2px;
          top: 2px;
          line-height: 16px;
          pointer-events: all;
          .ant-space-item {
            background-color: var(--colorSettings);
            color: #fff;
            line-height: 16px;
            width: 16px;
            padding-left: 1px;
            align-self: stretch;
          }
        }
      }
    `,
  };
});

export const TableColumnActionBar = observer(
  (props) => {
    const { styles } = useStyles();
    const Designer = useDesigner();
    return (
      <SortableItem className={styles.designer}>
        <Designer />
        {props.children}
      </SortableItem>
    );
  },
  { displayName: 'TableColumnActionBar' },
);
