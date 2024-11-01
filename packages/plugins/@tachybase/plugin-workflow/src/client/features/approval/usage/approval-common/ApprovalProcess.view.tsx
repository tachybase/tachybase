import React, { useMemo } from 'react';
import { CardItem, createStyles, useCurrentUserContext } from '@tachybase/client';

import { Space, Table } from 'antd';
import _ from 'lodash';

import { usePluginTranslation } from '../../locale';
import { useApproval } from './ApprovalData.provider';
import { getAntdTableColumns } from './process-columns';
import { getResults } from './tools';
import { ContextWithActionEnabled } from './WithActionEnabled.provider';

const getStyles = createStyles(({ css, token }) => ({
  layout: css`
    display: flex;
  `,
  columnDetail: css`
    .ant-description-textarea {
      margin-bottom: 0.5em;
    }
    time {
      display: block;
      color: ${token.colorTextTertiary};
    }
  `,
}));

// 审批(发起/待办)区块-查看-审批处理
export const ApprovalProcess = (props) => {
  const { t } = usePluginTranslation();
  const approvalContext = useApproval();
  const { styles } = getStyles();
  const { data } = useCurrentUserContext();

  const results = useMemo(() => getResults({ approval: approvalContext, currentUser: data }), [approvalContext, data]);

  const columns = useMemo(() => getAntdTableColumns({ t, styles }), [t, styles]);

  return (
    <ContextWithActionEnabled.Provider value={{ actionEnabled: props.actionEnabled }}>
      <CardItem title={t('Current record')}>
        <Table dataSource={results.at(-1)?.records} rowKey={'id'} pagination={false} columns={columns} />
      </CardItem>

      {results.length > 1 && (
        <CardItem title={t('Historical records')}>
          <Space direction="vertical" size="middle" className={styles.layout}>
            {results.map((item) => (
              <Table key={item.id} dataSource={item.records} rowKey={'id'} pagination={false} columns={columns} />
            ))}
          </Space>
        </CardItem>
      )}
    </ContextWithActionEnabled.Provider>
  );
};
