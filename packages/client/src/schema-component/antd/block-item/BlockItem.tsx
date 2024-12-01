import React, { useState } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import {
  autoUpdate,
  flip,
  offset,
  safePolygon,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useHover,
  useInteractions,
  useMergeRefs,
} from '@floating-ui/react';
import { createStyles } from 'antd-style';
import cx from 'classnames';

import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import { SortableItem } from '../../common';
import { useDesigner, useProps } from '../../hooks';
import BlockToolbar from './BlockToolbar';
import { useGetAriaLabelOfBlockItem } from './hooks/useGetAriaLabelOfBlockItem';

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
  // 新版 UISchema（1.0 之后）中已经废弃了 useProps，这里之所以继续保留是为了兼容旧版的 UISchema
  const { className, children } = useProps(props);
  const { styles } = useStyles();

  // floating ui
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const {
    refs: tooltipRefs,
    floatingStyles: tooltipFloatingStyles,
    context: tooltipContext,
  } = useFloating({
    placement: 'top',
    middleware: [
      offset(10), // TODO: constant value
      shift({
        crossAxis: true,
      }),
    ],
    open: tooltipOpen,
    onOpenChange: setTooltipOpen,
    whileElementsMounted: autoUpdate,
  });

  const {
    getReferenceProps: getTooltipReferenceProps, // TODO
    getFloatingProps: getTooltipFloatingProps, // TODO
  } = useInteractions([
    useHover(tooltipContext, {
      handleClose: safePolygon(),
      delay: {
        open: 0,
        close: 500,
      },
    }),
    useDismiss(tooltipContext),
  ]);

  console.log('🚀 ~ file: BlockItem.tsx:136 ~ BlockItem ~ tooltipRefs:', tooltipRefs);

  const Designer = useDesigner();
  const fieldSchema = useFieldSchema();
  const { getAriaLabel } = useGetAriaLabelOfBlockItem(props.name);

  return (
    <SortableItem
      ref={tooltipRefs.setReference}
      role="button"
      aria-label={getAriaLabel()}
      className={cx('tb-block-item', className, styles)}
    >
      <Designer {...fieldSchema['x-toolbar-props']} />
      {children}
      {tooltipOpen && (
        <BlockToolbar
          ref={tooltipRefs.setFloating}
          style={{
            ...tooltipFloatingStyles,
            zIndex: 9999,
          }}
          {...getTooltipFloatingProps()}
        />
      )}
    </SortableItem>
  );
});
