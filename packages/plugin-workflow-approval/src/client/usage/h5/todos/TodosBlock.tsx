import { useState } from 'react';
import { BlockItem, ExtendCollectionsProvider, SchemaComponent } from '@tachybase/client';
import { observer, useFieldSchema } from '@tachybase/schema';

import { SearchBar, Tabs } from 'antd-mobile';

import { collectionApprovalTodos } from '../../../common/collections/approvalRecords';
import { collectionApprovals } from '../../../common/collections/approvals';
import { collectionFlowNodes } from '../../../common/collections/flowNodes';
import { collectionWorkflows } from '../../../common/collections/workflows';
import { CollectionWorkflowNotice } from '../collection/notice.collection';
import { todoCollection } from '../collection/UserJobs.collection';
import { useTranslation } from '../locale';
import { TabDuplicateItem } from './component/TabDuplicateItem';
import { TabPendingItem } from './component/TabPendingItem';
import { TabProcessedItem } from './component/TabProcessedItem';
import { tabDuplicateSchema, tabPendingSchema, tabProcessedSchema } from './componentSchema';
import { todosContext } from './provider/todosContext';

import '../style/style.css';

export const TodosBlock = observer((props) => {
  const [changeInputValue, setChangeInputValue] = useState('');
  const fieldSchema = useFieldSchema();
  const [contextFilter, setContextFilter] = useState({ key: 'pending', inputFilter: '' });
  const { t } = useTranslation();
  return (
    <ExtendCollectionsProvider
      collections={[
        collectionWorkflows,
        collectionFlowNodes,
        collectionApprovals,
        collectionApprovalTodos,
        todoCollection,
        CollectionWorkflowNotice,
      ]}
    >
      <BlockItem>
        <todosContext.Provider value={contextFilter}>
          <SearchBar
            placeholder="搜索人名，标题、内容"
            clearable
            style={{ '--background': '#ffffff', padding: '10px' }}
            onChange={(value) => {
              const filter = { ...contextFilter };
              if (!value) {
                filter.inputFilter = value;
                setContextFilter(filter);
              }
              setChangeInputValue(value);
            }}
            value={changeInputValue}
            onSearch={(value) => {
              const filter = { ...contextFilter };
              filter.inputFilter = value;
              setContextFilter(filter);
            }}
          />
          <Tabs
            onChange={(key) => {
              const tabFilter = { ...contextFilter };
              tabFilter.key = key;
              tabFilter.inputFilter = '';
              setContextFilter(tabFilter);
              setChangeInputValue('');
            }}
            style={{ '--title-font-size': '12px', backgroundColor: '#ffffff', marginTop: '10px' }}
          >
            <Tabs.Tab title={t('Pending')} key="pending">
              <SchemaComponent
                components={{
                  TabPendingItem,
                }}
                schema={tabPendingSchema(t, props, fieldSchema['x-uid'])}
              />
            </Tabs.Tab>
            <Tabs.Tab title={t('Processed')} key="processed">
              <SchemaComponent
                components={{
                  TabProcessedItem,
                }}
                schema={tabProcessedSchema(t, props, fieldSchema['x-uid'])}
              />
            </Tabs.Tab>
            <Tabs.Tab title={t('Carbon Copy to me')} key="duplicate">
              <SchemaComponent
                components={{
                  TabDuplicateItem,
                }}
                schema={tabDuplicateSchema(t, props, fieldSchema['x-uid'])}
              />
            </Tabs.Tab>
            {/* <Tabs.Tab title={t('Executed')} key="executed">
              <SchemaComponent
                components={{
                  TabExecutedItem,
                }}
                schema={tabExecutedSchema(t, props, fieldSchema['x-uid'])}
              />
            </Tabs.Tab> */}
          </Tabs>
        </todosContext.Provider>
      </BlockItem>
    </ExtendCollectionsProvider>
  );
});
