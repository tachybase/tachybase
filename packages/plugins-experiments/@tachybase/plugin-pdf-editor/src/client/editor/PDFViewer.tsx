import React, { useEffect } from 'react';
import { useApp } from '@tachybase/client';

import { pdf } from '@react-pdf/renderer';
import { useAsync } from 'react-use';

const PDFViewer = ({ value, onUrlChange, onRenderError }) => {
  const app = useApp();
  const previewList = app.AttachmentPreviewManager.get();
  const { checkedComponent } = previewList['application/pdf'];

  const render = useAsync(async () => {
    if (!value) return null;

    const blob = await pdf(value).toBlob();
    const url = URL.createObjectURL(blob);

    return url;
  }, [value]);

  useEffect(() => onUrlChange(render.value), [render.value]);

  useEffect(() => onRenderError(render.error), [render.error]);

  return checkedComponent({
    file: {
      url: render.value,
    },
    noTransformWrapper: true,
  });
};

export default PDFViewer;
