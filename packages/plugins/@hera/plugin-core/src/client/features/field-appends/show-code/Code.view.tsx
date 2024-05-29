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

async function dynamicCode({ jsCode, form, path, recordData, result }, { setResult, formatFunc }) {
  try {
    eval(jsCode);
    // NOTE: 示例代码, 仿照此例配置即可
    // {
    //   import('dayjs')
    //     .then((module) => {
    //       // 使用加载的模块
    //       const dayjs = module.default; // 假设模块默认导出了一个函数
    //       const localeSetting = { invalidDate: '-' };
    //       dayjs.updateLocale('en', localeSetting);
    //       const date_pay = form.getValuesIn(path.replace('.date_fix', '.date_pay'));

    //       const date_receive = form.getValuesIn(path.replace('.date_fix', '.date_receive'));
    //       const date_show = date_pay || date_receive;

    //       const formartedDate = dayjs(date_show ?? '-').format('YYYY-MM-DD');
    //       setResult({
    //         childrenType: 'jsx',
    //         items: [
    //           {
    //             children: formartedDate,
    //           },
    //         ],
    //       });
    //     })
    //     .catch((error) => {
    //       // 处理加载模块时的错误
    //       console.error('Failed to load module:', error);
    //     });
    // }
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
