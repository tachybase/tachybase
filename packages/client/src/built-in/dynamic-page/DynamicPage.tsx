import React from 'react';

import { PageHeader } from '@ant-design/pro-layout';
import { css } from '@emotion/css';
import { useNavigate, useParams } from 'react-router-dom';

import { DataBlockProvider } from '../../data-source';
import { RecordContext_deprecated } from '../../record-provider';
import { RemoteSchemaComponent } from '../../schema-component';
import { useHeadStyles } from './style';

/**
 * 将 URL 安全的 Base64 转换回标准 Base64 并解码
 * @param {string} input - URL 安全的 Base64 字符串
 * @returns {string} 原始字符串
 */
function fromBase64UrlSafe(input) {
  const base64String = input.replace(/-/g, '+').replace(/_/g, '/'); // 替换回标准 Base64

  // 补全 '=' 使长度为 4 的倍数
  const padding = base64String.length % 4 === 0 ? '' : '='.repeat(4 - (base64String.length % 4));
  const standardBase64 = base64String + padding;

  return atob(standardBase64); // 解码为原始字符串
}

export const DynamicPage = () => {
  const params = useParams<any>();
  const last = params['*'].split('/').pop();
  const { collection, filterByTk, uid } = JSON.parse(fromBase64UrlSafe(last));
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
        <PageHeader
          ghost={false}
          title={'Subpage(WIP)'}
          onBack={() => {
            navigate(-1);
          }}
        />
      </div>
      <DataBlockProvider params={{ filterByTk }} action="get" collection={collection}>
        <RecordContext_deprecated.Provider value={{ id: filterByTk }}>
          <RemoteSchemaComponent uid={uid} onlyRenderProperties />
        </RecordContext_deprecated.Provider>
      </DataBlockProvider>
    </div>
  );
};
