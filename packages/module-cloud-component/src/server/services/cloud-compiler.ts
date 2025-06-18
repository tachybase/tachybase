import { Service, uid } from '@tachybase/utils';

import { transform } from '@babel/core';

/**
 * TODO 支持混淆
 * @description CloudCompiler
 */
@Service()
export class CloudCompiler {
  toAmd(code: string) {
    const compiledCode = transform(code, {
      filename: `cloud-library-${uid()}.tsx`,
      presets: [
        [
          require('@babel/preset-env'),
          {
            modules: 'amd',
          },
        ],
        require('@babel/preset-react'),
        require('@babel/preset-typescript'),
      ],
    }).code;
    return compiledCode;
  }

  toCjs(code: string) {
    const compiledCode = transform(code, {
      sourceType: 'module',
      filename: `cloud-component-${uid()}.tsx`,
      presets: [
        [
          require('@babel/preset-env'),
          {
            modules: 'commonjs',
            targets: {
              node: 'current',
            },
          },
        ],
        require('@babel/preset-react'),
        require('@babel/preset-typescript'),
      ],
    }).code;
    return compiledCode;
  }
}
