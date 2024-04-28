import { onFormValuesChange } from '@nocobase/schema';
import { useField, useFieldSchema, useForm, useFormEffects } from '@nocobase/schema';
import { Input } from '@nocobase/client';
import { Descriptions, DescriptionsProps } from 'antd';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { evaluators } from '@nocobase/evaluators/client';
const transformFormula = (formula: string) => {
  if (!formula) return [];
  const formulaArray = formula.split(/([+\-*/?:()%])/).filter((item) => item);
  return formulaArray;
};

export const CalcResult = (props) => {
  // 公式，单位，前缀，后缀，小数点位数，面板逻辑代码
  const { formula, prefix, suffix, decimal, panel } = props;
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const engine = evaluators.get('math.js');
  const evaluate = engine.evaluate.bind(engine);
  const defaultValue = fieldSchema.name === 'subtotal' ? '￥0.00' : [];
  const [value, setValue] = useState<string | DescriptionsProps['items'] | React.ReactNode>(defaultValue);
  const transformFormulaArray = transformFormula(formula);

  let calculateData = [];

  const newFormulaArray = (data): [string, object] => {
    calculateData = [];
    let count = 0;
    const scopes = {};
    if (transformFormulaArray.length === 0) return;
    for (let i = 0; i < transformFormulaArray.length; i++) {
      const item = transformFormulaArray[i];
      if (!item) continue;
      const isNumber = !isNaN(Number(item));
      const symbol = ['+', '-', '*', '/', '?', ':', '(', ')', '%'].includes(item);
      if (!isNumber && !symbol) {
        let value;
        // 举例： ${fieldObj}.fieldName
        const pattern = /\${(.*?)}/g;
        if (item.match(pattern)?.length) {
          const target = item.match(pattern)[0].replace(/\${|}/g, '');
          // 以.分割字符串
          const targetField = item.split('.')[1];

          if (path === fieldPath) {
            // @ts-ignore
            value = _.chain(data).get(target).get(targetField, 0).value();
          } else {
            // @ts-ignore
            value = _.chain(data).get(fieldPath).get(target).get(targetField, 0).value();
          }
        } else {
          if (path === fieldPath) {
            // @ts-ignore
            value = _.chain(data).get(item, 0).value();
          } else {
            // @ts-ignore
            value = _.chain(data).get(fieldPath).get(item, 0).value();
          }
        }
        if (!value) {
          value = 0;
        }
        count += 1;
        const varName = 'var' + count;
        const varValue = value;
        scopes[varName] = varValue;
        calculateData.push('{{' + varName + '}}');
      } else {
        calculateData.push(item);
      }
    }
    return [calculateData.join(''), scopes];
  };
  const fun = async () => {
    if (!panel && transformFormulaArray.length) {
      const [code, scopes] = newFormulaArray(form.values);
      let result;
      try {
        const pre = prefix || '';
        const suf = suffix || '';
        const res = evaluate(code, scopes);
        const main = isNaN(res) ? res : Number(res).toFixed(decimal || 0);
        result = pre + main + suf;
      } catch (error) {
        result = `${code}`;
        console.warn('code: ', code, ' scopes: ', scopes, 'error: ', result, ' error message ', error.message);
      }
      setValue(result.toString());
    } else if (panel) {
      let items = [];
      const childrenType = 'normal';
      // ==========动态导入可能需要的包============
      // jsx

      const { jsx } = (await import('react/jsx-runtime')).default;
      const keepJSX = () => jsx;
      keepJSX();
      // dayjs
      const dayjs = (await import('dayjs')).default;
      const keepDayjs = () => dayjs;
      keepDayjs();
      // ==========动态导入结束=====================

      // ====================字段配置举例==================
      const exampleTemplate = `
      let total = 0;
      let allWeight = 0;
      const products = {};
      for (let i = 0; i < form.values.items.length; i++) {
        const item = form.values.items[i];
        // 计算 合计金额
        const count = item?.count || 0;
        const unitPrice = item?.unit_price || 0;
        // 换算数量
        let scale = 1;
        if (item && item.product && item.product?.ratio) {
          scale = item.product?.ratio;
        }
        total += count * scale * unitPrice;
        // 计算 理论重量
        let weight = 1;
        if (item && item.product && item.product?.weight) {
          weight = item.product.weight || 1;
        }

        allWeight += weight * count;
        // 计算 产品分类
        if (item && item.product) {
          if (products[item.product.name]) {
            products[item.product.name].count += count * scale;
          } else {
            products[item.product.name] = {
              count: count * scale,
              unit: item.product?.category?.conversion_unit || item.product?.category?.unit || '',
            };
          }
        }
      }
      // 生成产品分类的数据
      const weight = {
        key: '1',
        label: '理论重量',
        children: (allWeight / 1000).toFixed(3) + '吨',
      };
      // const totalPrice = {
      //   key: '2',
      //   label: '合计',
      //   children: '￥' + total.toFixed(2),
      // }
      // ,, totalPrice
      items.push(weight);

      if (Object.keys(products).length > 0) {
        for (const key in products) {
          if (Object.prototype.hasOwnProperty.call(products, key)) {
            const value = products[key];
            items.push({
              key: key,
              label: key,
              children: value.count.toFixed(3) + value.unit,
            });
          }
        }
      }
      `;
      try {
        eval(panel);
      } catch (error) {
        items = [];
        items.push({
          key: '1',
          label: '数据异常',
          children: '请检查字段配置内容，error：' + error,
        });
      }
      const showItems = items.map((item) => {
        return {
          label: item.label,
          children: <p>{item.children}</p>,
        };
      });

      if (childrenType === 'normal') {
        const component = <Descriptions items={showItems as DescriptionsProps['items']} />;
        setValue(component);
      } else if (childrenType === 'jsx' && Array.isArray(items)) {
        const component = <>{items.map((item) => item.children)}</>;
        setValue(component);
      }
    }
  };

  useEffect(() => {
    fun();
  }, []);

  useFormEffects(() => {
    onFormValuesChange((form) => {
      fun();
    });
  });
  if (typeof value === 'string') {
    return <Input.ReadPretty value={value as string} />;
  } else {
    return <>{value}</>;
  }
};
