import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Spin, Tag } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import { saveAs } from 'file-saver';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { uid } from '@tachybase/schema';
import { css, useRequest } from '@tachybase/client';
import { useTranslation } from '../locale';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const options = {
  cMapUrl: '/cmaps/',
  standardFontDataUrl: '/standard_fonts/',
};
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cat.net/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

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
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number>(0);
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
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    iframe.onload = () => {
      setContentWindow(iframe.contentWindow);
    };
    document.body.appendChild(iframe);
    return () => {
      // 需要释放资源
      URL.revokeObjectURL(url);
      document.body.removeChild(iframe);
    };
  }, [data, loading]);

  return (
    <LoadingSpin spinning={loading}>
      <TransformWrapper
        wheel={{ disabled: true }}
        doubleClick={{ disabled: true }}
        panning={{ allowLeftClickPan: false }}
      >
        <TransformComponent>
          <Document
            options={options}
            file={data as ArrayBuffer}
            loading={() => (
              <LoadingSpin spinning={true}>
                <div style={{ height: '100vh' }}></div>
              </LoadingSpin>
            )}
            onLoadSuccess={async (doc) => {
              setNumPages(doc.numPages);
            }}
            noData={<div style={{ height: '100vh' }}></div>}
            error={<div>{t('error')}</div>}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width}>
                <div
                  className={css`
                    text-align: center;
                    border-bottom: 1px dashed;
                  `}
                >
                  <Tag
                    className={css`
                      margin-bottom: 2px;
                    `}
                    bordered={false}
                  >
                    第 {index + 1}/{numPages} 页
                  </Tag>
                </div>
              </Page>
            ))}
          </Document>
        </TransformComponent>
      </TransformWrapper>
    </LoadingSpin>
  );
});
