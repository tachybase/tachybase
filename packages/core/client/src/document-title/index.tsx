import React, { createContext, useContext, useEffect, useState } from 'react';

import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

import { Plugin } from '../application/Plugin';
import { useSystemSettings } from '../system-settings';

interface DocumentTitleContextProps {
  title?: any;
  setTitle?: (title?: any) => void;
}

export const DocumentTitleContext = createContext<DocumentTitleContextProps>({
  title: null,
  setTitle() {},
});
DocumentTitleContext.displayName = 'DocumentTitleContext';

export const DocumentTitleProvider = (props: {
  addonBefore?: string;
  addonAfter?: string;
  children: React.ReactNode;
}) => {
  const { addonBefore, addonAfter } = props;
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const documentTitle = `${addonBefore ? ` - ${t(addonBefore)}` : ''}${t(title || '')}${
    addonAfter ? ` - ${t(addonAfter)}` : ''
  }`;
  return (
    <DocumentTitleContext.Provider
      value={{
        title,
        setTitle,
      }}
    >
      <Helmet>
        <title>{documentTitle}</title>
      </Helmet>
      {props.children}
    </DocumentTitleContext.Provider>
  );
};

export const RemoteDocumentTitleProvider = (props) => {
  const ctx = useSystemSettings();
  return <DocumentTitleProvider addonAfter={ctx?.data?.data?.title}>{props.children}</DocumentTitleProvider>;
};

export const useDocumentTitle = () => {
  return useContext(DocumentTitleContext);
};

export const useCurrentDocumentTitle = (title: string) => {
  const { setTitle } = useDocumentTitle();
  useEffect(() => {
    setTitle(title);
  }, []);
};

export class RemoteDocumentTitlePlugin extends Plugin {
  async load() {
    this.app.use(RemoteDocumentTitleProvider, this.options);
  }
}
