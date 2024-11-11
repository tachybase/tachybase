import React, { useContext } from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { Avatar } from 'antd';
import { createStyles } from 'antd-style';

import { withDynamicSchemaProps } from '../../application';
import { Icon } from '../../icon';
import { Action, useComponent } from '../../schema-component';
import { QuickAccessBlockContext } from './Block';
import { QuickAccessLayout } from './blockSettings';

const useStyles = createStyles(({ token, css }) => ({
  action: css`
    background-color: transparent;
    border: 0;
    height: auto;
    box-shadow: none;
  `,
  title: css`
    margin-top: ${token.marginSM}px;
    text-overflow: ellipsis;
    overflow: hidden;
  `,
}));

function Button() {
  const fieldSchema = useFieldSchema();
  const icon = fieldSchema['x-component-props']?.['icon'];
  const backgroundColor = fieldSchema['x-component-props']?.['iconColor'];
  const { layout } = useContext(QuickAccessBlockContext);
  const { styles, cx } = useStyles();
  return layout === QuickAccessLayout.Grid ? (
    <div title={fieldSchema.title} style={{ width: '70px', overflow: 'hidden' }}>
      <Avatar style={{ backgroundColor }} size={54} icon={<Icon type={icon} />} />
      <div className={cx(styles.title)}>{fieldSchema.title}</div>
    </div>
  ) : (
    <a>{fieldSchema.title}</a>
  );
}

export const QuickAccessAction = withDynamicSchemaProps((props) => {
  const { className, ...others } = props;
  const { styles, cx } = useStyles();
  const fieldSchema = useFieldSchema();
  const Component = useComponent(props?.targetComponent) || Action;
  return (
    <Component
      className={cx(className, styles.action)}
      {...others}
      icon={null}
      title={<Button />}
      confirmTitle={fieldSchema.title}
    />
  );
});
