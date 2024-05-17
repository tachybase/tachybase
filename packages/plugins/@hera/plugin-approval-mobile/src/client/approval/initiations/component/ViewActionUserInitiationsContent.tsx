import React, { useEffect, useState } from 'react';
import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useAPIClient,
  useDestroyAction,
  useFormBlockContext,
  useRecord,
  useRequest,
} from '@tachybase/client';
import { DetailsBlockProvider, FlowContext } from '@tachybase/plugin-workflow/client';
import { useForm } from '@tachybase/schema';
import { Result, Spin } from 'antd';
import { useContext } from 'react';
import { ContextWithActionEnabled } from '../../context/WithActionEnabled';
import { SchemaComponentContextProvider } from '../../context/SchemaComponent';
import { NavBar, Skeleton, TabBar } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { FormBlockProvider } from '../../context/FormBlock';
import { ActionBarProvider } from '../provider/ActionBar';
import { ApplyActionStatusProvider } from '../provider/ApplyActionStatus';
import { WithdrawActionProvider } from '../provider/WithdrawAction';
import { ContextApprovalExecution } from '../../context/ApprovalExecution';
import { useSubmit } from '../hook/useSubmit';
import { useFormBlockProps } from '../hook/useFormBlockProps';
import { useWithdrawAction } from '../hook/useWithdrawAction';
import { FileOutline, UserContactOutline } from 'antd-mobile-icons';
import { useTranslation } from '../../locale';
import '../../style/style.css';

export const ViewActionUserInitiationsContent = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const { actionEnabled } = useContext(ContextWithActionEnabled);
  const [noDate, setNoDate] = useState(false);
  const [recordData, setRecordDate] = useState({});
  const [currContext, setCurrContext] = useState('formContext');
  const { t } = useTranslation();
  const api = useAPIClient();
  useEffect(() => {
    api
      .request({
        url: 'approvalExecutions:get',
        params: {
          filter: { approvalId: id },
          appends: [
            'execution',
            'execution.jobs',
            'approval',
            'approval.workflow',
            'approval.workflow.nodes',
            'approval.approvalExecutions',
            'approval.createdBy.id',
            'approval.createdBy.nickname',
            'approval.records',
            'approval.records.node.title',
            'approval.records.node.config',
            'approval.records.job',
            'approval.records.user.nickname',
          ],
          except: ['approval.approvalExecutions.snapshot', 'approval.records.snapshot'],
        },
      })
      .then((res) => {
        if (res.data?.data) {
          setRecordDate(res.data.data);
        } else {
          setNoDate(true);
        }
      })
      .catch(() => {
        console.error;
      });
  }, []);
  // @ts-ignore
  const { approval, execution, ...approvalValue } = recordData || {};
  const { workflow } = approval || {};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f3f3', overflow: 'auto' }}>
      <NavBar
        onBack={() => {
          navigate(-1);
        }}
        className="navBarStyle"
      >
        {'审批'}
      </NavBar>
      <ContextApprovalExecution.Provider value={recordData}>
        <div className="approvalContext">
          {Object.keys(recordData).length && !noDate ? (
            <ContextApprovalExecution.Provider value={recordData}>
              {UserInitiationsComponent(workflow?.config.applyForm, t, currContext)}
              <TabBar
                onChange={(item) => {
                  setCurrContext(item);
                }}
                className="tabsBarStyle"
              >
                <TabBar.Item key="formContext" icon={<FileOutline />} title="申请内容" />
                {actionEnabled ? null : <TabBar.Item key="approval" icon={<UserContactOutline />} title="审批处理" />}
              </TabBar>
            </ContextApprovalExecution.Provider>
          ) : (
            <div>
              <Skeleton.Title animated />
              <Skeleton.Paragraph lineCount={5} animated />
            </div>
          )}
        </div>
      </ContextApprovalExecution.Provider>
    </div>
  );
};

const UserInitiationsComponent = (applyDetail, t, currContext) => {
  const formContextSchema = {
    type: 'void',
    'x-component': 'MPage',
    'x-designer': 'MPage.Designer',
    'x-component-props': {},
    properties: {
      Approval: {
        type: 'void',
        'x-decorator': 'SchemaComponentContextProvider',
        'x-decorator-props': { designable: false },
        'x-component': 'RemoteSchemaComponent',
        'x-component-props': {
          uid: applyDetail,
          noForm: true,
        },
      },
    },
  };

  const approvalSchema = {
    // type: 'void',
    // 'x-component': 'MPage',
    // 'x-designer': 'MPage.Designer',
    // 'x-component-props': {},
    // properties: {
    //   process: {
    //     type: 'void',
    //     'x-decorator': 'CardItem',
    //     'x-component': 'ApprovalCommon.ViewComponent.ApprovalProcess',
    //   },
    // },
  };

  return (
    <SchemaComponent
      components={{
        SchemaComponentProvider: SchemaComponentProvider,
        RemoteSchemaComponent: RemoteSchemaComponent,
        SchemaComponentContextProvider,
        FormBlockProvider,
        ActionBarProvider,
        ApplyActionStatusProvider,
        WithdrawActionProvider,
        DetailsBlockProvider,
      }}
      scope={{
        useForm,
        useSubmit: useSubmit,
        useFormBlockProps,
        useDetailsBlockProps: useFormBlockContext,
        useWithdrawAction,
        useDestroyAction,
      }}
      schema={currContext === 'formContext' ? formContextSchema : approvalSchema}
    />
  );
};
