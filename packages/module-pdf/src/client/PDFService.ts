import { Plugin } from '@tachybase/client';

import * as pdfReact from '@react-pdf/renderer';
import { Font } from '@react-pdf/renderer';

export class PDFService extends Plugin {
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
}
