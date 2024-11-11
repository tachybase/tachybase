import React, { useContext, useEffect, useState } from 'react';
import {
  CollectionProvider,
  CollectionProvider_deprecated,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useAPIClient,
  useFormBlockContext,
  usePlugin,
} from '@tachybase/client';
import { DetailsBlockProvider, FlowContext, linkNodes } from '@tachybase/plugin-workflow/client';

import { Result } from 'antd';
import { NavBar, Skeleton } from 'antd-mobile';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from '../../locale';

import '../../style/style.css';

import { MobileProvider } from '@tachybase/plugin-mobile-client/client';
import { observer } from '@tachybase/schema';

import { COLLECTION_NAME_APPROVAL_CARBON_COPY } from '../../constants';
import { ContextApprovalExecution } from '../../context/ApprovalExecution';
import { useWorkflowNoticeFormBlockProps } from '../hook/useFormBlockProps';
import { usePropsNoticeDetail } from '../hook/usePropsNoticeDetail';

// 审批-抄送-查看: 内容
export const ViewTodosWorkflowNoticeContent = observer((props) => {
  const { id } = props as any;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const api = useAPIClient();
  const [noDate, setNoDate] = useState(false);
  const [noticeData, setNoticeData] = useState({});
  const [schemaId, setSchemaId] = useState('');
  const [flowContext, setFlowContext] = useState<any>(null);
  useEffect(() => {
    api
      .request({
        url: `${COLLECTION_NAME_APPROVAL_CARBON_COPY}:get`,
        params: {
          filterByTk: id,
          appends: ['node', 'job', 'workflow', 'workflow.nodes', 'execution', 'execution.jobs', 'user'],
          except: ['workflow.config', 'workflow.options', 'nodes.config'],
          sort: ['-createdAt'],
        },
      })
      .then(({ data }) => {
        if (!data.data) setNoDate(true);
        const { node, workflow: { nodes = [], ...workflow } = {}, execution, ...userJob } = data?.data ?? {};
        linkNodes(nodes);
        setFlowContext({
          userJob,
          workflow,
          nodes,
          execution,
        });
        setSchemaId(node?.config.showCarbonCopyDetail);
        setNoticeData(data.data);
        return;
      })
      .catch(() => {
        console.error;
      });
  }, []);

  if (noDate) {
    return <Result status="error" title={t('Submission may be withdrawn, please try refresh the list.')} />;
  }
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f3f3', overflow: 'auto' }}>
      <NavBar
        onBack={() => {
          navigate(-1);
        }}
        className="navBarStyle"
      >
        {'抄送'}
      </NavBar>
      <div className="approvalContext">
        {noticeData && schemaId ? (
          <FlowContext.Provider value={flowContext}>
            <CollectionProvider name={noticeData['collectionName']}>
              <ContextApprovalExecution.Provider value={noticeData}>
                <SchemaComponent
                  components={{
                    RemoteSchemaComponent,
                    SchemaComponentProvider,
                    DetailsBlockProvider,
                    MobileProvider,
                  }}
                  scope={{
                    usePropsNoticeDetail,
                    useDetailsBlockProps: useWorkflowNoticeFormBlockProps,
                  }}
                  schema={{
                    type: 'void',
                    'x-component': 'MobileProvider',
                    properties: {
                      page: {
                        type: 'void',
                        'x-component': 'MPage',
                        'x-designer': 'MPage.Designer',
                        'x-component-props': {},
                        properties: {
                          detail: {
                            type: 'void',
                            'x-decorator': 'NoticeDetailProvider',
                            'x-decorator-props': {
                              designable: false,
                            },
                            'x-component': 'RemoteSchemaComponent',
                            'x-component-props': {
                              uid: schemaId,
                              noForm: true,
                            },
                          },
                        },
                      },
                    },
                  }}
                />
              </ContextApprovalExecution.Provider>
            </CollectionProvider>
          </FlowContext.Provider>
        ) : (
          <div>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={5} animated />
          </div>
        )}
      </div>
    </div>
  );
});
