import React, { useContext, useEffect, useId, useState } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { createStyles } from 'antd-style';
import cx from 'classnames';

import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import { SortableItem } from '../../common';
import { useDesigner, useProps } from '../../hooks';
import { useGetAriaLabelOfBlockItem } from './hooks/useGetAriaLabelOfBlockItem';
import { ToolbarProvider, useBlockToolbar, useToolbar } from './useBlockToolbar';

const useStyles = createStyles(({ css }) => {
  return css`
    position: relative;
    &:hover {
      > .general-schema-designer {
        display: block;
      }
    }
    &.tb-form-item:hover {
      > .general-schema-designer {
        background: var(--colorBgSettingsHover) !important;
        border: 0 !important;
        top: -5px !important;
        bottom: -5px !important;
        left: -5px !important;
        right: -5px !important;
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
      border: 2px solid var(--colorBorderSettingsHover);
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
});

export const BlockItem = withDynamicSchemaProps((props: unknown & { name: string }) => {
  // TODO: remove useProps
  const { className, children } = useProps(props);
  const { styles } = useStyles();
  // const [visible, setVisible] = useState(true);

  // const { open, ref, toolbar } = useBlockToolbar();
  // const id = useId();
  // const { registerChild } = useToolbar();

  // useEffect(() => {
  //   if (!registerChild) return;
  //   const unregister = registerChild(id, open);
  //   return () => unregister();
  // }, [registerChild, open]);

  const Designer = useDesigner();
  const fieldSchema = useFieldSchema();
  const { getAriaLabel } = useGetAriaLabelOfBlockItem(props.name);

  return (
    // <ToolbarProvider onVisibilityChange={setVisible}>
    <SortableItem
      // ref={ref}
      role="button"
      aria-label={getAriaLabel()}
      className={cx('tb-block-item', className, styles)}
    >
      <Designer {...fieldSchema['x-toolbar-props']} />
      {children}
      {/* {visible && toolbar} */}
    </SortableItem>
    // </ToolbarProvider>
  );
});
