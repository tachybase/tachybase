import React, { useContext, useEffect, useState } from 'react';
import { MobileProvider, SchemaComponent, useAPIClient, useFormBlockContext, usePlugin } from '@tachybase/client';
import PluginWorkflowClient, {
  DetailsBlockProvider,
  FlowContext,
  linkNodes,
  useAvailableUpstreams,
} from '@tachybase/plugin-workflow/client';

import { Result } from 'antd';
import { NavBar, Skeleton } from 'antd-mobile';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';

import { ContextWithActionEnabled } from '../../context/WithActionEnabled';
import { useTranslation } from '../../locale';

import '../../style/style.css';

import { observer } from '@tachybase/schema';
import { Registry } from '@tachybase/utils/client';

import { ManualFormType } from '../../constants';
import { ContextApprovalExecution } from '../../context/ApprovalExecution';
import { useUserJobsFormBlockProps } from '../hook/useFormBlockProps';
import { useUserJobsSubmit } from '../hook/useSubmit';
import { ActionBarUserJobsProvider } from '../provider/ActionBarProvider';
import { FormBlockProvider } from '../provider/FormBlockProvider';
import { ManualActionStatusProvider } from '../provider/ManualActionStatusProvider';

// 审批-执行处理-查看: 内容
export const ViewTodosUserJobsContent = observer((props) => {
  const { id } = props as any;
  const { t } = useTranslation();
  const { actionEnabled } = useContext(ContextWithActionEnabled);
  const navigate = useNavigate();
  const api = useAPIClient();
  const [noDate, setNoDate] = useState(false);
  const workflowPlugin = usePlugin(PluginWorkflowClient);
  const [flowContext, setFlowContext] = useState<any>(null);
  const [jobsData, setJobsData] = useState({});
  const [node, setNode] = useState<any>(null);
  useEffect(() => {
    api
      .resource('users_jobs')
      .get?.({
        filterByTk: id,
        appends: ['node', 'job', 'workflow', 'workflow.nodes', 'execution', 'execution.jobs'],
      })
      .then(({ data }) => {
        if (!data.data) setNoDate(true);
        const { node, workflow: { nodes = [], ...workflow } = {}, execution, ...userJob } = data?.data ?? {};
        linkNodes(nodes);
        setNode(node);
        setFlowContext({
          userJob,
          workflow,
          nodes,
          execution,
        });
        setJobsData(data.data);
        return;
      })
      .catch(() => {
        console.error;
      });
  }, []);
  const upstreams = useAvailableUpstreams(flowContext?.nodes.find((item) => item.id === node.id));
  const nodeComponents = upstreams.reduce(
    (components, { type }) => Object.assign(components, workflowPlugin.instructions.get(type).components),
    {},
  );

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
        {'执行处理'}
      </NavBar>
      <div className="approvalContext">
        {node && flowContext ? (
          <FlowContext.Provider value={flowContext}>
            <ContextApprovalExecution.Provider value={jobsData}>
              <SchemaComponent
                components={{
                  FormBlockProvider,
                  DetailsBlockProvider,
                  ActionBarProvider: ActionBarUserJobsProvider,
                  ManualActionStatusProvider,
                  // @ts-ignore
                  ...Array.from(manualFormTypes.getValues()).reduce(
                    (result, item: ManualFormType) => Object.assign(result, item.block.components),
                    {},
                  ),
                  ...nodeComponents,
                  MobileProvider,
                }}
                scope={{
                  useSubmit: useUserJobsSubmit,
                  useFormBlockProps: useUserJobsFormBlockProps,
                  useDetailsBlockProps,
                  // @ts-ignore
                  ...Array.from(manualFormTypes.getValues()).reduce(
                    (result, item: ManualFormType) => Object.assign(result, item.block.scope),
                    {},
                  ),
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
                      properties: Object.values(node.config?.schema)[0]['properties'],
                    },
                  },
                }}
              />
            </ContextApprovalExecution.Provider>
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

function useDetailsBlockProps() {
  const { form } = useFormBlockContext();
  return { form };
}

export const manualFormTypes = new Registry<ManualFormType>();
