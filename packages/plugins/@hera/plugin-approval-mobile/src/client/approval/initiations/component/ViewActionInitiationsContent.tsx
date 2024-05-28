import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CollectionProvider_deprecated,
  parseCollectionName,
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentContext,
  useAPIClient,
} from '@tachybase/client';

import { NavBar } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from '../../locale';

import '../../style/style.css';

import { MobileProvider } from '@tachybase/plugin-mobile-client/client';

import { APPROVAL_ACTION_STATUS } from '../../constants';
import { useCreateSubmit } from '../hook/useCreateSubmit';

export const ViewActionInitiationsContent = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { name, id } = params;
  const { t } = useTranslation();
  const context = useContext(SchemaComponentContext);
  const api = useAPIClient();
  const [schema, setSchema] = useState({});
  useEffect(() => {
    api
      .request({
        url: 'workflows:list',
        params: {
          pageSize: 9999,
          filter: {
            type: { $eq: 'approval' },
            enabled: { $eq: true },
            id: { $eq: id },
          },
        },
      })
      .then((res) => {
        const formConfig = res.data.data[0];
        const [dataSource, name] = parseCollectionName(formConfig.config.collection);
        const resSchema = {
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
                  'x-decorator': 'CollectionProvider_deprecated',
                  'x-decorator-props': {
                    name,
                    dataSource,
                  },
                  'x-component': 'RemoteSchemaComponent',
                  'x-component-props': {
                    uid: formConfig.config.applyForm,
                    noForm: true,
                  },
                },
              },
            },
          },
        };
        setSchema(resSchema);
      })
      .catch(() => {
        console.error;
      });
  }, []);
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f3f3', overflow: 'auto' }}>
      <NavBar
        onBack={() => {
          navigate(-1);
        }}
        className="navBarStyle"
      >
        {name}
      </NavBar>
      <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
        <div className="approvalContext">
          <SchemaComponent
            schema={schema}
            components={{
              RemoteSchemaComponent: RemoteSchemaComponent,
              CollectionProvider_deprecated: CollectionProvider_deprecated,
              ApplyActionStatusProvider: ContextInitiationsApprovalStatusProvider,
              ActionBarProvider,
              WithdrawActionProvider: WithdrawActionProvider,
              MobileProvider,
            }}
            scope={{
              useSubmit: useCreateSubmit,
              useWithdrawAction,
            }}
          />
        </div>
      </SchemaComponentContext.Provider>
    </div>
  );
};

export function WithdrawActionProvider() {
  return null;
}

export function useWithdrawAction() {
  return { run() {} };
}

export function ActionBarProvider(props) {
  return props.children;
}

const ContextInitiationsApprovalStatus = createContext(APPROVAL_ACTION_STATUS.SUBMITTED);

export function useContextApprovalStatus() {
  return useContext(ContextInitiationsApprovalStatus);
}

export function ContextInitiationsApprovalStatusProvider(props) {
  return (
    <ContextInitiationsApprovalStatus.Provider value={props.value}>
      {props.children}
    </ContextInitiationsApprovalStatus.Provider>
  );
}
