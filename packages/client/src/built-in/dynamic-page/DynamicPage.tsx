import { Card } from 'antd';
import { useParams } from 'react-router-dom';

import { AppNotFound } from '..';
import { DataBlockProvider } from '../../data-source';
import { RecordContext_deprecated } from '../../record-provider';
import { RemoteSchemaComponent } from '../../schema-component';
import { useStyles } from './DynamicPage.style';
import { PageNavBar } from './PageNavBar';
import { PathHandler, type ParsedPath } from './utils';

export const DynamicPage = () => {
  const { styles } = useStyles();
  const params = useParams<{ '*': string; name: string }>();

  if (params['*']) {
    const pathParams: ParsedPath | false = PathHandler.getInstance().parse(params['*'], params.name);
    if (!pathParams) {
      return <AppNotFound />;
    }
    return (
      // FIXME 这里是通过 DataBlock + RecordContext 来让它工作，实际上需要重构一个新的上下文，原来的卡片上下文用在这里无助于内部卡片判断
      <div className={styles['dynamic-page']}>
        <DataBlockProvider
          params={{
            filterByTk: pathParams.filterByTk,
          }}
          action="get"
          collection={pathParams.collection}
        >
          <RecordContext_deprecated.Provider
            value={{
              id: pathParams.filterByTk,
            }}
          >
            <PageNavBar uid={pathParams.sub} />
            <Card className="page-content">
              <RemoteSchemaComponent uid={pathParams.sub} onlyRenderProperties />
            </Card>
          </RecordContext_deprecated.Provider>
        </DataBlockProvider>
      </div>
    );
  } else {
    return <RemoteSchemaComponent uid={params.name} onlyRenderProperties />;
  }
};
