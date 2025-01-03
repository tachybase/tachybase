import {
  RemoteSchemaComponent,
  SchemaComponent,
  SchemaComponentProvider,
  useFormBlockContext,
} from '@tachybase/client';
import { DetailsBlockProvider } from '@tachybase/module-workflow/client';

import { tval } from '../../../../locale';
import { useContextMyComponent } from './contexts/MyComponent.context';
import { usePropsNoticeDetail } from './hooks/usePropsNoticeDetail';
import { NoticeDetailProvider } from './NoticeDetail.provider';

export const NoticeDetailContent = () => {
  return (
    <NoticeDetailProvider>
      <NoticeDetail />
    </NoticeDetailProvider>
  );
};

const NoticeDetail = (props) => {
  const { id, schemaId } = useContextMyComponent();

  return (
    <SchemaComponent
      components={{
        NoticeDetailProvider,
        RemoteSchemaComponent,
        SchemaComponentProvider,
        DetailsBlockProvider,
      }}
      scope={{
        usePropsNoticeDetail,
        useDetailsBlockProps: useFormBlockContext,
      }}
      schema={{
        name: `content-${id}`,
        type: 'void',
        'x-component': 'Tabs',
        properties: {
          detail: {
            type: 'void',
            title: tval('Content Detail'),
            'x-component': 'Tabs.TabPane',
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
  );
};
