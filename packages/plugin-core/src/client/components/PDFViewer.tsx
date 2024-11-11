import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useApp, useRequest } from '@tachybase/client';
import { uid } from '@tachybase/schema';

import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { saveAs } from 'file-saver';

import { useTranslation } from '../locale';

interface PDFViewerProps {
  file: string;
  width: number;
}

interface PDFViewerRef {
  download: () => void;
  print: () => void;
}

const LoadingSpin = ({ children, spinning }) => {
  const { t } = useTranslation();
  return (
    <Spin tip={t('loading...')} indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} spinning={spinning}>
      {children}
    </Spin>
  );
};

export const PDFViewer = forwardRef<PDFViewerRef, PDFViewerProps>((props, ref) => {
  const app = useApp();
  const previewList = app.AttachmentPreviewManager.get();
  const { checkedComponent } = previewList['application/pdf'];

  const [pdfUrl, setPdfUrl] = useState('');
  const [contentWindow, setContentWindow] = useState<Window>(null);
  const { file, width = 960 } = props;
  const { loading, data } = useRequest(
    {
      url: file,
      responseType: 'arraybuffer',
    },
    {
      refreshDeps: [file],
    },
  );
  useImperativeHandle(ref, () => ({
    download() {
      const blob = new Blob([data as ArrayBuffer], { type: 'application/pdf' });
      saveAs(blob, uid() + '.pdf');
    },
    print() {
      contentWindow.print();
    },
  }));

  useEffect(() => {
    if (loading || !data) {
      return;
    }
    const blob = new Blob([data as ArrayBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  }, [data, loading]);

  useEffect(() => {
    if (!pdfUrl) {
      return;
    }
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;
    iframe.onload = () => {
      setContentWindow(iframe.contentWindow);
    };
    document.body.appendChild(iframe);

    return () => {
      // 需要释放资源
      URL.revokeObjectURL(pdfUrl);
      document.body.removeChild(iframe);
    };
  }, [pdfUrl]);

  return (
    <LoadingSpin spinning={loading}>
      {checkedComponent({
        file: {
          url: pdfUrl,
        },
        width,
      })}
    </LoadingSpin>
  );
});
