import { useMemo } from 'react';
import { CardItem, createStyles, useCompile, useCurrentUserContext } from '@tachybase/client';
import { dayjs } from '@tachybase/utils/client';

import { Space, Table, Tag, Timeline } from 'antd';
import _ from 'lodash';

import { usePluginTranslation } from '../../../locale';
import { APPROVAL_STATUS, approvalStatusConfigObj, ApprovalStatusEnumDict } from '../constants';
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

// 审批(发起/待办)卡片-查看-审批流程
export const ApprovalProcessTimeLine = (props) => {
  const { t } = usePluginTranslation();
  const approvalContext = useApproval();
  const { styles } = getStyles();
  const { data } = useCurrentUserContext();

  const results = useMemo(() => getResults({ approval: approvalContext, currentUser: data }), [approvalContext, data]);

  const columns = useMemo(() => getAntdTableColumns({ t, styles }), [t, styles]);

  return (
    <ContextWithActionEnabled.Provider value={{ actionEnabled: props.actionEnabled }}>
      <CardItem title={t('Current record')}>
        <Process dataSource={results.at(-1)?.records} />
      </CardItem>

      {results.length > 1 && (
        <CardItem title={t('Historical records')}>
          <Space direction="vertical" size="middle" className={styles.layout}>
            {results.map((item) => (
              <Process key={item.id} dataSource={item.records} />
            ))}
          </Space>
        </CardItem>
      )}
    </ContextWithActionEnabled.Provider>
  );
};

export const Process = ({ dataSource }) => {
  const compile = useCompile();
  const items = dataSource.map((dataItem, index) => {
    let status = { color: '', label: '' };
    if (!index) {
      // 第一个必定为发起项
      status =
        ApprovalStatusEnumDict[
          dataItem.status === APPROVAL_STATUS.DRAFT ? APPROVAL_STATUS.DRAFT : APPROVAL_STATUS.SUBMITTED
        ];
    } else {
      status = approvalStatusConfigObj[dataItem.status];
    }

    return {
      children: (
        <div>
          <div>{dataItem.node?.title}</div>
          <div style={{ fontSize: '12px', color: '#969696' }}>
            {dataItem.user.nickname}
            <Tag color={status.color} style={{ marginLeft: '5px', fontSize: '12px' }}>
              {compile(status.label)}
            </Tag>
            {`${dataItem.status === 0 ? '' : dayjs(dataItem.updatedAt).format('YYYY-MM-DD HH:mm:ss')}`}
          </div>
        </div>
      ),
    };
  });
  return <Timeline items={items} />;
};
