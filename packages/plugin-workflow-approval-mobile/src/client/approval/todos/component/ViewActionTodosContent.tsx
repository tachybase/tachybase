import React, { useEffect, useState } from 'react';
import {
  MobileProvider,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useAPIClient,
  useFormBlockContext,
} from '@tachybase/client';
import { DetailsBlockProvider } from '@tachybase/plugin-workflow/client';

import { Result } from 'antd';
import { NavBar, Skeleton, TabBar } from 'antd-mobile';
import _ from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';

import { ContextApprovalExecution } from '../../context/ApprovalExecution';
import { FormBlockProvider } from '../../context/FormBlock';
import { SchemaComponentContextProvider } from '../../context/SchemaComponent';
import { useTranslation } from '../../locale';
import { useApprovalDetailBlockProps } from '../hook/useApprovalDetailBlockProps';
import { useApprovalFormBlockProps } from '../hook/useApprovalFormBlockProps';
import { useSubmit } from '../hook/useSubmit';
import { ActionBarProvider } from '../provider/ActionBarProvider';
import { ApprovalActionProvider } from '../provider/ApprovalAction';
import { ApprovalFormBlockDecorator } from '../provider/ApprovalFormBlock';

import '../../style/style.css';

import { observer } from '@tachybase/schema';

// 审批-待办-查看: 内容
export const ViewActionTodosContent = observer((props) => {
  const { id } = props as any;
  const { t } = useTranslation();
  const navigate = useNavigate();

  const api = useAPIClient();
  const [noDate, setNoDate] = useState(false);
  const [recordData, setRecordDate] = useState({});
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
            {todosComponent(node?.config.applyDetail)}
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
});

const todosComponent = (applyDetail) => {
  const formContextSchema = {
    type: 'void',
    'x-component': 'MobileProvider',
    properties: {
      page: {
        type: 'void',
        'x-component': 'MPage',
        'x-designer': 'MPage.Designer',
        'x-decorator': 'MobileProvider',
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
          process: {
            type: 'void',
            'x-decorator': 'CardItem',
            'x-component': 'ApprovalCommon.ViewComponent.MApprovalProcess',
          },
        },
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
        MobileProvider,
      }}
      scope={{
        useApprovalDetailBlockProps,
        useApprovalFormBlockProps,
        useDetailsBlockProps: useFormBlockContext,
        useSubmit,
      }}
      schema={formContextSchema}
    />
  );
};
