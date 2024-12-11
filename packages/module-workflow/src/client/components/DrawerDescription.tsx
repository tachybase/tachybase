import React from 'react';
import { createStyles, cx } from '@tachybase/client';
import { convertUTCToLocal } from '@tachybase/utils/client';

import { Tag } from 'antd';

import { useTranslation } from '../locale';

const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      margin-bottom: 1.5em;
      padding: 1em;
      background-color: ${token.colorFillAlter};

      > *:last-child {
        margin-bottom: 0;
      }

      dl {
        display: flex;
        align-items: baseline;

        dt {
          color: ${token.colorText};
          &:after {
            content: ':';
            margin-right: 0.5em;
          }
        }
      }

      p {
        color: ${token.colorTextDescription};
      }
    `,
  };
});

export function DrawerDescription(props) {
  const { label, title, description, workflowKey, createdAt, createdBy } = props;
  const { styles } = useStyles();
  const { t } = useTranslation();
  return (
    <>
      <div className={cx(styles.container, props.className)}>
        <dl>
          <dt>{label}</dt>
          <dd>
            <Tag style={{ background: 'none' }}>{title}</Tag>
          </dd>
        </dl>
        {description ? <p>{description}</p> : null}
      </div>
      {workflowKey || createdAt || createdBy ? (
        <div className={cx(styles.container, props.className)}>
          {workflowKey ? <p>{`${t('Key')}: ${workflowKey}`}</p> : null}
          {createdAt ? <p>{`${t('Created at')}: ${convertUTCToLocal(createdAt)}`}</p> : null}
          {createdBy ? <p>{`${t('Created by')}: ${createdBy}`}</p> : null}
        </div>
      ) : null}
    </>
  );
}
