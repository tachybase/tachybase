import React from 'react';
import { observer } from '@tachybase/schema';

import { createStyles } from 'antd-style';

import { SortableItem, useDesigner } from '../..';
import { useFlag } from '../../../flag-provider/hooks/useFlag';

export const useStyles = createStyles(({ css }, { margin = '-18px -16px', padding = '18px 16px' }) => {
  return {
    designer: css`
      position: relative;
      margin: ${margin};
      padding: ${padding};

      &:hover {
        > .general-schema-designer {
          display: block;
        }
      }
      > .general-schema-designer {
        position: absolute;
        z-index: 999;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        display: none;
        background: var(--colorBgSettingsHover) !important;
        border: 0 !important;
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
    const Designer = useDesigner();
    const { isInSubTable } = useFlag() || {};
    const { styles } = useStyles({
      margin: isInSubTable ? '-12px -8px' : '-18px -16px',
      padding: isInSubTable ? '12px 8px' : '18px 16px',
    });
    return (
      <SortableItem className={styles.designer}>
        <Designer />
        {props.children}
      </SortableItem>
    );
  },
  { displayName: 'TableColumnActionBar' },
);
