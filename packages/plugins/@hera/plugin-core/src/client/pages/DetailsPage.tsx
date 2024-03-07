import React from 'react';
import { CollectionRecordProvider, DataBlockProvider, RemoteSchemaComponent, css } from '@nocobase/client';
import { useNavigate, useParams } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { useHeadStyles } from '../pages/style';
import { PageHeader as AntdPageHeader } from '@ant-design/pro-layout';

export const DetailsPage: React.FC = () => {
  const params = useParams<any>();
  const regexp = pathToRegexp(':collection/:cid?/:association?/:aid?');
  const match = regexp.exec(params['*']);
  const [_, collection, cid] = match;
  const { styles } = useHeadStyles();
  const navigate = useNavigate();
  return (
    <div
      className={css`
        .ant-tabs-nav {
          background: #fff;
          padding: 0 24px;
          margin-bottom: 0;
        }
        .ant-tabs-content-holder {
          padding: 24px;
        }
      `}
    >
      <div className={`${styles['.pageHeaderCss']}`}>
        <AntdPageHeader
          ghost={false}
          title={'详情页面'}
          onBack={() => {
            navigate(-1);
          }}
        />
      </div>
      <DataBlockProvider collection={collection}>
        <CollectionRecordProvider record={{ id: cid }} parentRecord={null}>
          <RemoteSchemaComponent uid={params.pageId} onlyRenderProperties />
        </CollectionRecordProvider>
      </DataBlockProvider>
    </div>
  );
};
