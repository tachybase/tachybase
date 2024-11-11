import React, { createRef, forwardRef } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { Button } from 'antd';
import { createStyles } from 'antd-style';
import { composeRef } from 'rc-util/lib/ref';

import { useTableBlockContext, useTableSelectorContext } from '../../../block-provider';
import { Icon } from '../../../icon';
import { useCompile } from '../../hooks';

const useStyles = createStyles(({ css }) => {
  return {
    designer: css`
      position: relative;
      &:hover {
        .general-schema-designer {
          display: block;
        }
      }
      .general-schema-designer {
        position: absolute;
        z-index: 999;
        display: none;
        background: var(--colorBgSettingsHover);
        border: 0;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
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

const InternalExpandAction = (props, ref) => {
  const schema = useFieldSchema();
  const { styles } = useStyles();
  const ctxSelector = useTableSelectorContext();
  const ctxBlock = useTableBlockContext();
  const isTableSelector = schema.parent?.parent?.['x-decorator'] === 'TableSelectorProvider';
  const ctx = isTableSelector ? ctxSelector : ctxBlock;
  const { titleExpand, titleCollapse, iconExpand, iconCollapse } = schema['x-component-props'] || {};
  const compile = useCompile();
  const internalRef = createRef<HTMLButtonElement | HTMLAnchorElement>();
  const buttonRef = composeRef(ref, internalRef);
  return (
    //@ts-ignore
    <div className={styles.designer} ref={buttonRef as React.Ref<HTMLButtonElement>}>
      {ctx?.params['tree'] && (
        <Button
          onClick={() => {
            ctx?.setExpandFlag();
          }}
          icon={<Icon type={ctx?.expandFlag ? iconCollapse : iconExpand} />}
          type={props.type}
          style={props?.style}
        >
          {props.children?.[1]}
          <span style={{ marginLeft: 10 }}>{ctx?.expandFlag ? compile(titleCollapse) : compile(titleExpand)}</span>
        </Button>
      )}
    </div>
  );
};

export const ExpandAction = forwardRef<HTMLButtonElement | HTMLAnchorElement, any>(InternalExpandAction);
