import React from 'react';
import { Input } from '@tachybase/client';
import { evaluators } from '@tachybase/evaluators/client';
import { useField, useFieldSchema, useForm } from '@tachybase/schema';

import { FormulaProps } from './Formula.interface';

export const ViewFormula = (props: FormulaProps) => {
  const { resultShowValue } = useAction(props);
  return <Input.ReadPretty value={resultShowValue} />;
};

function useAction(props: FormulaProps) {
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const field = useField();
  const { formulaString, prefix, suffix, decimal } = props;

  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const engine = evaluators.get('math.js');
  const evaluate = engine.evaluate.bind(engine);
  const transformFormulaArray = transformFormula(formulaString);

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

  const formulaArray = newFormulaArray(form.values);

  if (!formulaArray) {
    return {};
  }
  const [code, scopes] = formulaArray;
  let resultShowValue;
  try {
    const pre = prefix || '';
    const suf = suffix || '';
    const res = evaluate(code, scopes);
    const main = isNaN(res) ? res : Number(res).toFixed(+decimal || 0);
    resultShowValue = pre + main + suf;
  } catch (error) {
    resultShowValue = `${code}`;
    console.warn('code: ', code, ' scopes: ', scopes, 'error: ', resultShowValue, ' error message ', error.message);
  }

  return { resultShowValue };
}

function transformFormula(formula: string) {
  if (!formula) return [];
  const formulaArray = formula.split(/([+\-*/?:()%])/).filter((item) => item);
  return formulaArray;
}
