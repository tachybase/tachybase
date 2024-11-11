import React from 'react';
import {
  SchemaComponentContext,
  useCollectionRecordData,
  useRequest,
  useSchemaComponentContext,
} from '@tachybase/client';

import { Result, Spin } from 'antd';

import { ExecutionContextProvider } from '../../../../ExecutionContextProvider';
import { COLLECTION_NOTICE_NAME } from '../../../common/constants';
import { useTranslation } from '../../locale';
import { ProviderContextMyComponent } from './contexts/MyComponent.context';
import { ProviderContextWorkflowNotice } from './contexts/WorkflowNotice.context';

export const NoticeDetailProvider = ({ children, ...props }) => {
  // THINK: 顺序问题, 工具优先, 数据之后, 外部优先, 本地滞后
  const schemaComponentContext = useSchemaComponentContext();
  const { t } = useTranslation();
  const { id } = useCollectionRecordData();
  //   const { actionEnabled } = useContext(ContextWithActionEnabled);
  const { loading, data } = useRequestData(id);

  if (loading) {
    return <Spin />;
  }

  if (!data?.data) {
    return <Result status="error" title={t('Submission may be withdrawn, please try refresh the list.')} />;
  }

  const itemsData = data.data;
  const { node, workflow, execution } = itemsData;
  const schemaId = node?.config.showNoticeDetail;
  const { designable } = props;

  // THINK: Provider 的顺序, 数据放在外面, 配置放在内层
  return (
    <ExecutionContextProvider workflow={workflow} nodes={workflow.nodes} execution={execution}>
      <ProviderContextWorkflowNotice value={itemsData}>
        <ProviderContextMyComponent
          value={{
            id,
            schemaId,
          }}
        >
          <SchemaComponentContext.Provider value={{ ...schemaComponentContext, designable }}>
            {children}
          </SchemaComponentContext.Provider>
        </ProviderContextMyComponent>
      </ProviderContextWorkflowNotice>
    </ExecutionContextProvider>
  );
};

function useRequestData(id) {
  const { loading, data }: any = useRequest(
    {
      resource: COLLECTION_NOTICE_NAME,
      action: 'get',
      params: {
        filterByTk: id,
        appends: ['node', 'job', 'workflow', 'workflow.nodes', 'execution', 'execution.jobs', 'user'],
        except: ['workflow.config', 'workflow.options', 'nodes.config'],
        sort: ['-createdAt'],
      },
    },
    {
      refreshDeps: [id],
    },
  );

  return {
    loading,
    data,
  };
}
