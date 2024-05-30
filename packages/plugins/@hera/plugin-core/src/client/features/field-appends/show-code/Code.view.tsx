import React, { useEffect, useState } from 'react';
import { Input } from '@tachybase/client';
import { useField, useFieldSchema, useForm } from '@tachybase/schema';

import { Descriptions } from 'antd';
import _ from 'lodash';

import { CodeFieldProps } from './Code.interface';

export const ViewCode = (props: CodeFieldProps) => {
  const resultShowValue = useAction(props);
  if (typeof resultShowValue === 'string') {
    return <ShowValue value={resultShowValue} />;
  } else {
    return <>{resultShowValue}</>;
  }
};

const ShowValue = React.memo((props: { value: string }) => {
  const { value } = props;
  return <Input.ReadPretty value={value} />;
});

function useAction(props: CodeFieldProps): string | React.ReactNode {
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { jsCode, prefix, suffix, decimal } = props;

  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const recordData = _.chain(form.values).get(fieldPath).value();

  const [result, setResult] = useState<any>({
    items: [],
    childrenType: '',
  });

  const formatFunc = (value: string | number): string => {
    let main = value;
    if (typeof value === 'number') {
      main = isNaN(value) ? value : Number(value).toFixed(+decimal || 0);
    }
    return `${prefix}${main}${suffix}`;
  };
  useEffect(() => {
    dynamicCode({ jsCode, form, path, recordData, result }, { setResult, formatFunc });
  }, []);

  const showItems = result.items.map((item) => {
    return {
      label: item.label,
      children: <p>{item.children}</p>,
    };
  });

  if (result.childrenType === 'normal') {
    return <Descriptions items={showItems} />;
  } else if (result.childrenType === 'jsx') {
    return <>{result?.items?.map((item) => item.children)}</>;
  } else {
    return result.items?.[0]?.children;
  }
}
// 动态执行 jsCode 代码
async function dynamicCode({ jsCode, form, path, recordData, result }, { setResult, formatFunc }) {
  try {
    // NOTE: 示例代码, 仿照此例配置即可; 也可放开注释进行调试
    // jsCode = `{
    //   const { form, path } = scopes;
    //   const { setResult } = handlers;
    //   const { dayjs } = modules;
    //   const date_pay = form.getValuesIn(path.replace('.date_fix', '.date_pay'));
    //   const date_receive = form.getValuesIn(path.replace('.date_fix', '.date_receive'));
    //   const date_show = date_pay || date_receive;
    //   const formartedDate = dayjs(date_show ?? '-').format('YYYY-MM-DD');
    //   setResult({
    //     childrenType: 'jsx',
    //     items: [
    //       {
    //         children: formartedDate,
    //       },
    //     ],
    //   });
    // }`;
    /** 动态导入开始, 与 jsCode 配置相关的包 */
    const dayjs = (await import('dayjs')).default;
    const localeSetting = { invalidDate: '-' };
    dayjs.updateLocale('en', localeSetting);
    /** 动态导入结束 */

    evalSimulate(jsCode, {
      scopes: { form, path, recordData, result },
      handlers: {
        setResult,
        formatFunc,
      },
      modules: { dayjs },
    });
  } catch (error) {
    setResult({
      childrenType: '',
      items: [
        {
          key: '1',
          label: '数据异常',
          children: '请检查字段配置内容，error：' + error,
        },
      ],
    });
  }
}

// 模拟 eval 实现, 相对更安全的实现和更好的性能, 以及限制作用域范围,
function evalSimulate(jsCode, { scopes, handlers, modules }) {
  try {
    return new Function('$root', `with($root) { ${jsCode}; }`)({ scopes, handlers, modules });
  } catch (err) {
    console.log('err', err);
  }
}
