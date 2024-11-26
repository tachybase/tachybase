import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import * as Babel from '@babel/standalone';
import { useDebounceFn, useKeyPress } from 'ahooks';
import { Spin, Splitter } from 'antd';
import parserJavaScript from 'prettier/plugins/babel';
import * as prettierPluginEstree from 'prettier/plugins/estree';
import * as prettier from 'prettier/standalone';

import ComPreview from './ComPreview';

import './index.less';

import { CodeEditor } from '@tachybase/components';

/**
 * 组件代码编辑
 */
export default forwardRef((_: any, ref: any) => {
  const [code, setCode] = useState('');
  const [compileCode, setCompileCode] = useState('');
  const [refreshTag, setRefreshTag] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const editorRef = useRef<any>(null);

  // 初始化代码
  async function initCode() {
    try {
      setLoading(true);
      const reactCode = localStorage.getItem('react-code');
      setCode(reactCode || '');
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    initCode();
  }, []);

  // 对外提供控制方法
  useImperativeHandle(ref, () => {
    return {
      // 源码
      getCode() {
        return code;
      },
      // 编译后代码
      getCompileCode() {
        return compileCode;
      },
      refresh() {
        setRefreshTag(refreshTag + 1);
      },
      // 打印流写入代码
      async writeCode(newCode: string): Promise<boolean> {
        return new Promise((resolve) => {
          let index = 0;
          const codeInterval = setInterval(() => {
            setCode((prev) => prev + newCode[index++]);
            if (index > newCode.length - 2) {
              clearInterval(codeInterval);
              setRefreshTag(refreshTag + 1);
              resolve(true);
            }
          }, 30);
        });
      },
      // 清空代码
      async clearCode() {
        setCode('');
        setRefreshTag(refreshTag + 1);
      },
      // 取消加载
      async cancelLoading() {
        setLoading(false);
      },
    };
  });

  // 保存后，格式化代码
  useKeyPress(['meta.s', 'ctrl.s'], async (event) => {
    try {
      event.stopPropagation();
      event.preventDefault();
      const formatted = await prettier.format(code, {
        parser: 'babel',
        plugins: [parserJavaScript, prettierPluginEstree],
        useTabs: false,
        tabWidth: 2, // tab对应空格数
        printWidth: 80,
        semi: true,
        singleQuote: true,
        trailingComma: 'es5', // 尾随逗号
        bracketSpacing: true, // 在对象文字中的括号之间打印空格，如{ foo: bar }
        bracketSameLine: false, // 多行 HTML 标签开头的 > 放在最后一行的末尾而不是单独放在下一行
        arrowParens: 'always', // 在唯一的箭头函数参数周围包含括号
        endOfLine: 'auto', // 行尾风格
      });
      setCode(formatted);
      setError('');
    } catch (error: any) {
      setError(error.message);
      console.error(error);
    }
  });

  // 实时保存代码
  const onChange = (value: string = '') => {
    setCode(value);
  };

  // 编译代码
  const handleCompile = async () => {
    if (!code) return;
    try {
      localStorage.setItem('react-code', code);
      const result = Babel.transform(code, {
        filename: 'file.tsx',
        presets: [['env', { modules: 'amd' }], 'react', 'typescript'],
      }).code;
      setLoading(false);
      setCompileCode(result);
      setError('');
      localStorage.setItem('react-compile', result);
      setRefreshTag(refreshTag + 1);
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    handleCompile();
  }, [code]);

  const { run } = useDebounceFn(onChange, { wait: 500 });

  return (
    <div className="code-editor">
      <Splitter>
        <Splitter.Panel defaultSize="50%">
          <CodeEditor
            defaultLanguage="typescript"
            value={code}
            onChange={(value) => {
              setLoading(true);
              run(value);
            }}
            options={{
              lineNumbers: 'on',
              minimap: {
                enabled: false,
              },
            }}
            height="100%"
            onMount={(editor) => (editorRef.current = editor)}
          />
        </Splitter.Panel>
        <Splitter.Panel defaultSize="50%">
          <Spin spinning={loading} tip="正在编译中...">
            <ComPreview refreshTag={refreshTag} />
            {error && <p style={{ color: 'red', lineHeight: '30px', padding: 30 }}>{error}</p>}
          </Spin>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
});
