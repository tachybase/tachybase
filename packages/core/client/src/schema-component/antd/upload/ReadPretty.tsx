import React, { useEffect, useState } from 'react';
import { Lightbox } from '@tachybase/components';
import { Field, useField } from '@tachybase/schema';
import { isString } from '@tachybase/utils/client';

import { DownloadOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from 'antd';
import useUploadStyle from 'antd/es/upload/style';
import cls from 'classnames';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

import { SchemaComponent } from '../..';
import { useApp } from '../../../application/hooks';
import { useRecord } from '../../../record-provider';
import { isImage, isPdf, toArr, toFileList, toImages } from './shared';
import { useStyles } from './style';
import type { UploadProps } from './type';

type Composed = React.FC<UploadProps> & {
  Upload?: React.FC<UploadProps>;
  File?: React.FC<UploadProps>;
};

export const ReadPretty: Composed = () => null;

ReadPretty.File = function File(props: UploadProps) {
  const { size, showCount = 0 } = props;
  const record = useRecord();
  const field = useField<Field>();
  const images = isString(field.value) ? record : toFileList(field.value);
  const app = useApp();
  const [fileIndex, setFileIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const { wrapSSR, hashId, componentCls: prefixCls } = useStyles();
  const useUploadStyleVal = (useUploadStyle as any).default ? (useUploadStyle as any).default : useUploadStyle;
  const previewList = app.AttachmentPreviewManager.get();
  // 加载 antd 的样式
  useUploadStyleVal(prefixCls);
  return wrapSSR(
    <div>
      <div
        className={cls(
          `${prefixCls}-wrapper`,
          `${prefixCls}-picture-card-wrapper`,
          `tb-upload`,
          size ? `tb-upload-${size}` : null,
          hashId,
        )}
      >
        <div className={cls(`${prefixCls}-list`, `${prefixCls}-list-picture-card`)}>
          {images.map((file, index) => {
            if (size === 'small') {
              return (
                index === 0 && (
                  <ReadFile
                    file={file}
                    prefixCls={prefixCls}
                    // handleClick={handleClick}
                    size={size}
                    images={images}
                    setFileIndex={setFileIndex}
                    setVisible={setVisible}
                    preview={previewList[file?.mimetype] || previewList['default']}
                    key={index}
                  />
                )
              );
            }
            return (
              <ReadFile
                file={file}
                prefixCls={prefixCls}
                size={size}
                images={images}
                setFileIndex={setFileIndex}
                setVisible={setVisible}
                preview={previewList['image/jpeg']}
                key={index}
              />
            );
          })}
        </div>
      </div>
      {visible && (
        <Lightbox
          // discourageDownloads={true}
          mainSrc={images[fileIndex]?.imageUrl}
          nextSrc={images[(fileIndex + 1) % images.length]?.imageUrl}
          prevSrc={images[(fileIndex + images.length - 1) % images.length]?.imageUrl}
          mainFile={images[fileIndex]}
          nextFile={images[(fileIndex + 1) % images.length]}
          prevFile={images[(fileIndex + images.length - 1) % images.length]}
          previewList={previewList}
          // @ts-ignore
          onCloseRequest={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setVisible(false);
          }}
          onMovePrevRequest={() => setFileIndex((fileIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setFileIndex((fileIndex + 1) % images.length)}
          imageTitle={images[fileIndex]?.title}
          toolbarButtons={[
            <button
              key={'download'}
              style={{ fontSize: 22, background: 'none', lineHeight: 1 }}
              type="button"
              aria-label="Zoom in"
              title="Zoom in"
              className="ril-zoom-in ril__toolbarItemChild ril__builtinButton"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const file = images[fileIndex];
                saveAs(file.url, `${file.title}${file.extname}`);
              }}
            >
              <DownloadOutlined />
            </button>,
          ]}
        />
      )}
    </div>,
  );
};

ReadPretty.Upload = function Upload() {
  const field = useField<Field>();
  return (field.value || []).map((item) => (
    <div key={item.name}>
      {item.url ? (
        <a target={'_blank'} href={item.url} rel="noreferrer">
          {item.name}
        </a>
      ) : (
        <span>{item.name}</span>
      )}
    </div>
  ));
};

export const ReadFile = ({ file, prefixCls, size, images, setFileIndex, setVisible, preview }) => {
  const { viewComponet } = preview;
  const handleClick = (e) => {
    const index = images.indexOf(file);
    e.preventDefault();
    e.stopPropagation();
    setVisible(true);
    setFileIndex(index);
  };
  return (
    <div
      key={file.name}
      className={cls(`${prefixCls}-list-picture-card-container`, `${prefixCls}-list-item-container`)}
      style={{ position: 'relative' }}
    >
      <div
        className={cls(
          `${prefixCls}-list-item`,
          `${prefixCls}-list-item-done`,
          `${prefixCls}-list-item-list-type-picture-card`,
        )}
      >
        <div className={`${prefixCls}-list-item-info`}>
          <span className={`${prefixCls}-span`}>
            <a
              className={`${prefixCls}-list-item-thumbnail`}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              style={{ lineHeight: '100%' }}
            >
              {viewComponet({ images, size, prefixCls, file, setFileIndex, setVisible })}
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={`${prefixCls}-list-item-name`}
              title={file.title}
              href={file.url}
              onClick={handleClick}
            >
              {file.title}
            </a>
          </span>
        </div>
        {size !== 'small' && (
          <span className={`${prefixCls}-list-item-actions`}>
            <Space size={3}>
              <Button
                size={'small'}
                type={'text'}
                icon={<DownloadOutlined />}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  saveAs(file.url, `${file.title}${file.extname}`);
                }}
              />
            </Space>
          </span>
        )}
      </div>
      {images.length > 1 && size === 'small' && (
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            backgroundColor: '#9b999992',
            width: '50%',
            height: '30%',
            lineHeight: '30%',
            borderRadius: '40%',
            textAlign: 'center',
          }}
        >
          ...
        </div>
      )}
    </div>
  );
};
