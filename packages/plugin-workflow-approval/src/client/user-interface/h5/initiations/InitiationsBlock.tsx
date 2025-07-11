import { createContext, useState } from 'react';
import { BlockItem, css, ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';
import { observer, useFieldSchema } from '@tachybase/schema';

import { SearchBar, Tabs } from 'antd-mobile';

import { collectionApprovalTodos } from '../../../common/collections/approvalRecords';
import { collectionApprovals } from '../../../common/collections/approvals';
import { collectionFlowNodes } from '../../../common/collections/flowNodes';
import { collectionWorkflows } from '../../../common/collections/workflows';
import { useTranslation } from '../../../locale';
import { InitiationsItem } from './component/InitiationsItem';
import { UserInitiationsItem } from './component/UserInitiationsItem';

import '../style/style.css';

export const InitiationsBlockContext = createContext({});

export const InitiationsBlock = observer((props) => {
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const [contextFilter, setContextFilter] = useState({ key: 'userInitiations', inputFilter: '' });
  const [changeValue, setChangeValue] = useState('');
  return (
    <ExtendCollectionsProvider
      collections={[collectionWorkflows, collectionFlowNodes, collectionApprovals, collectionApprovalTodos]}
    >
      <BlockItem>
        <InitiationsBlockContext.Provider value={contextFilter}>
          <SearchBar
            placeholder="搜索内容"
            clearable
            style={{ '--background': '#ffffff', padding: '10px', marginBottom: '10px  ' }}
            onChange={(value) => {
              if (!value) {
                const filter = { ...contextFilter };
                filter.inputFilter = '';
                setContextFilter(filter);
              }
              setChangeValue(value);
            }}
            value={changeValue}
            onSearch={(value) => {
              const filter = { ...contextFilter };
              filter.inputFilter = value;
              setContextFilter(filter);
            }}
          />
          <Tabs
            className={css`
              .adm-tabs-tab {
                font-size: 12px;
              }
              .adm-tabs-content {
                padding: 0;
              }
            `}
            onChange={(key) => {
              const filter = { ...contextFilter };
              filter['key'] = key;
              filter['inputFilter'] = '';
              setChangeValue('');
              setContextFilter(filter);
            }}
          >
            <Tabs.Tab title="我的发起" key="userInitiations">
              <SchemaComponent
                components={{
                  UserInitiationsItem,
                }}
                schema={{
                  type: 'void',
                  name: 'userInitiations',
                  title: t('UserInitiations'),
                  'x-settings': 'ApprovalSettings',
                  'x-component': 'UserInitiationsItem',
                  'x-component-props': {
                    ...props,
                    collectionName: 'approvals',
                    settingBlock: true,
                    tabKey: 'userInitiations',
                    parantUid: fieldSchema['x-uid'],
                    parantParams: props['params'],
                  },
                }}
              />
            </Tabs.Tab>
            <Tabs.Tab title="发起申请" key="initiations">
              <SchemaComponent
                components={{
                  InitiationsItem,
                }}
                schema={{
                  type: 'void',
                  name: 'initiations',
                  title: t('Initiations'),
                  'x-settings': 'ApprovalSettings',
                  'x-component': 'InitiationsItem',
                  'x-component-props': {
                    ...props,
                    collectionName: 'workflows',
                    settingBlock: true,
                    tabKey: 'initiations',
                    parantUid: fieldSchema['x-uid'],
                    parantParams: props['params'],
                  },
                }}
              />
            </Tabs.Tab>
          </Tabs>
        </InitiationsBlockContext.Provider>
      </BlockItem>
    </ExtendCollectionsProvider>
  );
});
