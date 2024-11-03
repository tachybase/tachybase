import React from 'react';
import { useFieldSchema } from '@tachybase/schema';

import { Card } from 'antd';

import { useSchemaTemplate } from '../../../schema-templates';
import { BlockItem } from '../block-item';
import useStyles from './style';

interface Props {
  children?: React.ReactNode;
  /** 卡片标识 */
  name?: string;
  [key: string]: unknown;
}

export const CardItem = (props: Props) => {
  const { children, name, ...restProps } = props;
  const template = useSchemaTemplate();
  const fieldSchema = useFieldSchema();
  const templateKey = fieldSchema?.['x-template-key'];
  const { styles } = useStyles();
  return templateKey && !template ? null : (
    <BlockItem name={name} className={`${styles} tb-card-item`}>
      <Card className="card" bordered={false} {...restProps}>
        {props.children}
      </Card>
    </BlockItem>
  );
};
