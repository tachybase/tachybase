import React from 'react';

// NOTE: 请求信息参数
interface IContextRequestInfo {
  actionKey?: string;
  form?: any;
  requestActionForm?: any;
  responseTransformer?: any;
  setResponseTransformer?: any;
}

// TODO: 删除全部导出, 改为 provider 和 context 形式
export const ContextRequestInfo: any = React.createContext<IContextRequestInfo>({});

export const ProviderContextRequestInfo = ContextRequestInfo.Provider;

export function useContextRequestInfo(): IContextRequestInfo {
  return React.useContext(ContextRequestInfo);
}
