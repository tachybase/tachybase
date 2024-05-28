import React, { useEffect, useState } from 'react';
import { useAPIClient } from '@tachybase/client';
import { connect, mapProps, mapReadPretty, useForm } from '@tachybase/schema';

import { ImageUploader, ImageUploadItem } from 'antd-mobile';

export const MImageUploader = connect(
  (props) => {
    const [fileList, setFileList] = useState<ImageUploadItem[]>([]);
    const [change, setChange] = useState(false);
    const field = props.value || [];
    useEffect(() => {
      if (!change && props.value) {
        const data = props.value.map((item) => {
          return { url: item.url, key: item.id, thumbnailUrl: item.url };
        });
        setFileList(data);
      }
    }, [props.value]);
    const api = useAPIClient();
    return (
      <ImageUploader
        value={fileList}
        upload={async (file) => {
          const { name } = file;
          const imageField = isImage(name);
          if (imageField) {
            const formData = new FormData();
            formData.append('file', file);
            let result;
            await api
              .request({ url: props.action, method: 'post', data: formData })
              .then((res) => {
                result = res?.data?.data;
                field.push(result);
              })
              .catch(() => {});
            return {
              url: result?.url,
              key: result?.id,
              thumbnailUrl: result?.url,
            };
          }
        }}
        onChange={(file) => {
          setFileList(file);
          setChange(true);
          props.onChange(field);
        }}
      />
    );
  },
  mapProps((props) => {
    return { ...props };
  }),
  mapReadPretty((props) => {
    return (
      <ImageUploader
        {...props}
        disableUpload
        showUpload={false}
        upload={async () => {
          return { url: '' };
        }}
      />
    );
  }),
);
export default MImageUploader;

export const isImage = (extName: string) => {
  const reg = /\.(png|jpg|jpeg|gif|webp)$/i;
  return reg.test(extName);
};

export const isPdf = (extName: string) => {
  return extName.toLowerCase().endsWith('.pdf');
};
