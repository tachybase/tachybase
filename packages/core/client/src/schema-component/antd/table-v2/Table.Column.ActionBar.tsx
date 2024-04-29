import { css } from '@emotion/css';
import { observer } from '@tachybase/schema';
import React from 'react';
import { SortableItem, useDesigner } from '../..';
import { useFlag } from '../../../flag-provider/hooks/useFlag';

export const designerCss = ({ margin = '-18px -16px', padding = '18px 16px' } = {}) => css`
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
`;

export const TableColumnActionBar = observer(
  (props) => {
    const Designer = useDesigner();
    const { isInSubTable } = useFlag() || {};
    return (
      <SortableItem
        className={designerCss({
          margin: isInSubTable ? '-12px -8px' : '-18px -16px',
          padding: isInSubTable ? '12px 8px' : '18px 16px',
        })}
      >
        <Designer />
        {props.children}
      </SortableItem>
    );
  },
  { displayName: 'TableColumnActionBar' },
);
