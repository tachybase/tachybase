import { useApp } from '@tachybase/client';

import { pdf } from '@react-pdf/renderer';
import { useAsync } from 'react-use';

export const PDFPreview = ({ children }) => {
  const app = useApp();
  const previewList = app.AttachmentPreviewManager.get();
  const { checkedComponent } = previewList['application/pdf'];

  const render = useAsync(async () => {
    const blob = await pdf(children).toBlob();
    const url = URL.createObjectURL(blob);

    return url;
  }, []);

  return checkedComponent({
    file: {
      url: render.value,
    },
    noTransformWrapper: true,
  });
};
