import React, { useState } from 'react';

import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';

import { useStyles } from './file-pdf.style';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cat.net/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const CheckedComponent = (props) => {
  const { file, fileInfo, width } = props;
  // NOTE: 有 url 就使用 url 形式, 没有就取 fileInfo, 默认为数据流
  const pdfInfo = file?.url || fileInfo;
  // @ts-ignore
  const { t } = useTranslation();
  const { styles } = useStyles();
  const [numPages, setNumPages] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <Document
      className={styles.container}
      file={pdfInfo}
      onLoadSuccess={onDocumentLoadSuccess}
      noData={<div style={{ height: '100vh' }}></div>}
      error={<div>{t('error')}</div>}
      loading=""
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width}>
          <div className={styles.footer}>
            <Tag className={styles.footerText} bordered={false}>
              {index + 1}/{numPages}
            </Tag>
          </div>
        </Page>
      ))}
    </Document>
  );
};

const ViewComponent = (props) => {
  const { file, prefixCls } = props;
  return (
    file.imageUrl && (
      <img
        src={`${file.imageUrl}${file.thumbnailRule || ''}`}
        style={{ width: '100%', height: '100%' }}
        alt={file.title}
        className={`${prefixCls}-list-item-image`}
      />
    )
  );
};

export const filePdf = {
  key: 'application/pdf',
  type: 'application/pdf',
  viewComponet: (props) => <ViewComponent {...props} />,
  checkedComponent: (props) => <CheckedComponent {...props} />,
};
