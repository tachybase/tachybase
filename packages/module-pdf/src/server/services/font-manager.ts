import path from 'node:path';
import { Logger } from '@tachybase/logger';
import { InjectLog, Service } from '@tachybase/utils';

import { Font } from '@react-pdf/renderer';
import axios from 'axios';
import fs from 'fs-extra';

@Service()
export class FontManager {
  @InjectLog()
  private logger: Logger;
  constructor() {}

  async load() {
    // 中文换行问题
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

    await this.loadFonts();
  }

  async loadFonts(flag = true) {
    this.logger.info('load fonts.');
    const fonts = [
      {
        family: 'source-han-sans',
        weight: 200,
        url: 'https://alist.daoyoucloud.com/d/space/fonts/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93-%E4%B8%AD%E6%96%87/SourceHanSansCN-ExtraLight.otf',
      },
      {
        family: 'source-han-sans',
        weight: 300,
        url: 'https://alist.daoyoucloud.com/d/space/fonts/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93-%E4%B8%AD%E6%96%87/SourceHanSansCN-Light.otf',
      },
      {
        family: 'source-han-sans',
        weight: 400,
        url: 'https://alist.daoyoucloud.com/d/space/fonts/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93-%E4%B8%AD%E6%96%87/SourceHanSansCN-Regular.otf',
      },
      {
        family: 'source-han-sans',
        weight: 500,
        url: 'https://alist.daoyoucloud.com/d/space/fonts/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93-%E4%B8%AD%E6%96%87/SourceHanSansCN-Normal.otf',
      },
      {
        family: 'source-han-sans',
        weight: 600,
        url: 'https://alist.daoyoucloud.com/d/space/fonts/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93-%E4%B8%AD%E6%96%87/SourceHanSansCN-Medium.otf',
      },
      {
        family: 'source-han-sans',
        weight: 700,
        url: 'https://alist.daoyoucloud.com/d/space/fonts/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93-%E4%B8%AD%E6%96%87/SourceHanSansCN-Bold.otf',
      },
      {
        family: 'source-han-sans',
        weight: 900,
        url: 'https://alist.daoyoucloud.com/d/space/fonts/%E6%80%9D%E6%BA%90%E9%BB%91%E4%BD%93-%E4%B8%AD%E6%96%87/SourceHanSansCN-Heavy.otf',
      },
    ];
    const fontsDir = path.join(process.cwd(), 'storage', 'fonts');
    const isExists = await fs.exists(fontsDir);
    if (!isExists) {
      fs.mkdir(fontsDir);
    }
    if (flag) {
      // omit for now
      await Promise.all(
        fonts.map((font) => {
          const doAsync = async () => {
            const filename = font.url.split('/').slice(-1)[0];
            const filepath = path.join(fontsDir, filename);
            const isExists = await fs.exists(filepath);
            if (!isExists) {
              this.logger.info('download ' + filepath);
              const response = await axios({
                method: 'GET',
                url: font.url,
                responseType: 'stream',
              });
              try {
                const writer = fs.createWriteStream(filepath);
                await new Promise((resolve, reject) => {
                  response.data.pipe(writer);
                  writer.on('finish', () => {
                    this.logger.info('download ' + filepath + ' done.');
                    resolve('done');
                  });
                  writer.on('error', () => {
                    reject();
                  });
                });
              } catch (err) {
                this.logger.error('download error.', { err });
                // TODO 这里有问题，没有办法实际删除错误的文件，有可能文件不是这里产生的
                await fs.remove(filepath);
              }
            }
          };
          return doAsync();
        }),
      );
    }
    fonts.forEach((font) => {
      const filename = font.url.split('/').slice(-1)[0];
      const filepath = path.join(fontsDir, filename);
      Font.register({
        family: font.family,
        fontWeight: font.weight,
        src: filepath,
      });
    });
  }
}
