import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useAPIClient,
  useFormBlockContext,
  useRecord,
  useRequest,
} from '@tachybase/client';
import { Result } from 'antd';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from '../../locale';
import { DetailsBlockProvider } from '@tachybase/plugin-workflow/client';
import { ContextWithActionEnabled } from '../../context/WithActionEnabled';
import { ContextApprovalExecution } from '../../context/ApprovalExecution';
import { NavBar, Skeleton, TabBar } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { SchemaComponentContextProvider } from '../../context/SchemaComponent';
import { ApprovalActionProvider } from '../provider/ApprovalAction';
import { ApprovalFormBlockDecorator } from '../provider/ApprovalFormBlock';
import { useApprovalDetailBlockProps } from '../hook/useApprovalDetailBlockProps';
import { useApprovalFormBlockProps } from '../hook/useApprovalFormBlockProps';
import { useSubmit } from '../hook/useSubmit';
import { CouponOutline, FileOutline, ScanCodeOutline, UserContactOutline } from 'antd-mobile-icons';
import { ActionBarProvider } from '../provider/ActionBarProvider';
import { FormBlockProvider } from '../../context/FormBlock';
import '../../style/style.css';

// 审批-待办-查看: 内容
export const ViewActionTodosContent = () => {
  const { t } = useTranslation();
  const { actionEnabled } = useContext(ContextWithActionEnabled);
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const api = useAPIClient();
  const [noDate, setNoDate] = useState(false);
  const [recordData, setRecordDate] = useState({});
  const [currContext, setCurrContext] = useState('formContext');
  useEffect(() => {
    api
      .request({
        url: 'approvalRecords:get',
        params: {
          filter: { id },
          appends: [
            'approvalExecution',
            'node',
            'job',
            'workflow',
            'workflow.nodes',
            'execution',
            'execution.jobs',
            'user',
            'approval',
            'approval.createdBy',
            'approval.approvalExecutions',
            'approval.createdBy.nickname',
            'approval.records',
            'approval.records.node.title',
            'approval.records.node.config',
            'approval.records.job',
            'approval.records.user.nickname',
          ],
          except: [
            'approval.data',
            'approval.approvalExecutions.snapshot',
            'approval.records.snapshot',
            'workflow.config',
            'workflow.options',
            'nodes.config',
          ],
          sort: ['-createdAt'],
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

  if (noDate) {
    return <Result status="error" title={t('Submission may be withdrawn, please try refresh the list.')} />;
  }

  const { node } = recordData as any;

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
      <div className="approvalContext">
        {Object.keys(recordData).length && !noDate ? (
          <ContextApprovalExecution.Provider value={recordData}>
            {todosComponent(node?.config.applyDetail, t, currContext)}
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
    </div>
  );
};

const todosComponent = (applyDetail, t, currContext) => {
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
    type: 'void',
    'x-component': 'MPage',
    'x-designer': 'MPage.Designer',
    'x-component-props': {},
    properties: {
      process: {
        type: 'void',
        'x-decorator': 'CardItem',
        'x-component': 'ApprovalCommon.ViewComponent.MApprovalProcess',
      },
    },
  };

  return (
    <SchemaComponent
      components={{
        SchemaComponentProvider,
        RemoteSchemaComponent,
        SchemaComponentContextProvider,
        FormBlockProvider,
        ActionBarProvider,
        ApprovalActionProvider,
        ApprovalFormBlockProvider: ApprovalFormBlockDecorator,
        DetailsBlockProvider,
        TabBar,
      }}
      scope={{
        useApprovalDetailBlockProps,
        useApprovalFormBlockProps,
        useDetailsBlockProps: useFormBlockContext,
        useSubmit,
      }}
      schema={currContext === 'formContext' ? formContextSchema : approvalSchema}
    />
  );
};
