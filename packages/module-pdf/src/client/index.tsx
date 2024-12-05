import { Plugin, useApp } from '@tachybase/client';
import PluginWorkflow from '@tachybase/module-workflow/client';

import * as pdfReact from '@react-pdf/renderer';
import { Font, pdf } from '@react-pdf/renderer';
import { useAsync } from 'react-use';

import { PdfInstruction } from './PdfInstruction';

export class ModulePdfClient extends Plugin {
  async afterAdd() {
    this.app.requirejs.define('@react-pdf/renderer', () => pdfReact);
    const fonts = [
      {
        family: 'source-han-sans',
        weight: 200,
        url: 'https://assets.tachybase.com/fonts/SourceHanSansCN-ExtraLight.otf',
      },
      {
        family: 'source-han-sans',
        weight: 300,
        url: 'https://assets.tachybase.com/fonts/SourceHanSansCN-Light.otf',
      },
      {
        family: 'source-han-sans',
        weight: 400,
        url: 'https://assets.tachybase.com/fonts/SourceHanSansCN-Regular.otf',
      },
      {
        family: 'source-han-sans',
        weight: 500,
        url: 'https://assets.tachybase.com/fonts/SourceHanSansCN-Normal.otf',
      },
      {
        family: 'source-han-sans',
        weight: 600,
        url: 'https://assets.tachybase.com/fonts/SourceHanSansCN-Medium.otf',
      },
      {
        family: 'source-han-sans',
        weight: 700,
        url: 'https://assets.tachybase.com/fonts/SourceHanSansCN-Bold.otf',
      },
      {
        family: 'source-han-sans',
        weight: 900,
        url: 'https://assets.tachybase.com/fonts/SourceHanSansCN-Heavy.otf',
      },
    ];

    fonts.forEach((font) => {
      Font.register({
        family: font.family,
        fontWeight: font.weight,
        src: font.url,
      });
    });

    Font.registerHyphenationCallback((word) => {
      if (word.length === 1) {
        return [word];
      }
      return Array.from(word)
        .map((char) => [char, ''])
        .reduce((arr, current) => {
          arr.push(...current);
          return arr;
        }, []);
    });
  }

  async beforeLoad() {}

  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction('pdf', PdfInstruction);
  }
}

export default ModulePdfClient;

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
