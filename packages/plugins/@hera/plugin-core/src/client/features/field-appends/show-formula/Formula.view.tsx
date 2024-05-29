import React from 'react';
import { Input } from '@tachybase/client';
import { evaluators } from '@tachybase/evaluators/client';
import { useField, useFieldSchema, useForm } from '@tachybase/schema';

import _ from 'lodash';

import { FormulaProps } from './Formula.interface';

export const ViewFormula = (props: FormulaProps) => {
  const { resultShowValue } = useAction(props);
  return <ShowValue value={resultShowValue} />;
};

const ShowValue = React.memo((props: { value: string }) => {
  const { value } = props;
  return <Input.ReadPretty value={value} />;
});

function useAction(props: FormulaProps) {
  const form = useForm();
  const fieldSchema = useFieldSchema();
  const field = useField();

  const { formulaString, prefix, suffix, decimal } = props;

  const path: any = field.path.entire;
  const fieldPath = path?.replace(`.${fieldSchema.name}`, '');
  const recordData = _.chain(form.values).get(fieldPath).value();

  const formulaArry = transformFormula(formulaString);

  const evaluateArray = getEvaluateArray(formulaArry, recordData);
  if (!evaluateArray) {
    return { resultShowValue: '' };
  } else {
    const resultShowValue = getResultShowValue(evaluateArray, { prefix, suffix, decimal });
    return { resultShowValue };
  }
}

function transformFormula(formula: string) {
  if (!formula) {
    return [];
  }
  const formulaArray = formula.split(/([+\-*/?:()%])/).filter((item) => item);
  return formulaArray;
}

function getEvaluateArray(formulaArry, recordData): [string, object] {
  if (formulaArry.length < 1) {
    return;
  }

  let varIndex = 0;
  const calculateData = [];
  const scopes = {};

  for (let i = 0; i < formulaArry.length; i++) {
    const item = formulaArry[i];

    if (!item) continue;

    const isNumber = isNumberFunc(item);
    const isSymbol = isSymbolFunc(item);

    if (!isNumber && !isSymbol) {
      // NOTE: item 是字段的情况
      let value;
      // 举例： ${fieldObj}.fieldName
      const pattern = /\${(.*?)}/g;
      if (item.match(pattern)?.length) {
        // NOTE: 关系字段
        const target = item.match(pattern)[0].replace(/\${|}/g, '');
        // 以.分割字符串
        const targetField = item.split('.')[1];
        const targetObj = _.chain(recordData).get(target).value();
        value = _.chain(targetObj).get(targetField, 0).value();
      } else {
        // NOTE: 普通字段
        value = _.chain(recordData).get(item, 0).value();
      }

      const varName = `var${varIndex++}`;
      const varValue = value ?? 0;

      calculateData.push(`{{${varName}}}`);
      scopes[varName] = varValue;
    } else {
      // NOTE: item 是数字或者符号的情况
      calculateData.push(item);
    }
  }

  return [calculateData.join(''), scopes];
}

function getResultShowValue(formulaArray, { prefix, suffix, decimal }): string {
  const engine = evaluators.get('math.js');
  const evaluate = engine.evaluate.bind(engine);
  const [code, scopes] = formulaArray;

  let resultShowValue;

  try {
    const res = evaluate(code, scopes);
    const mainRes = isNaN(res) ? res : Number(res).toFixed(+decimal || 0);
    resultShowValue = `${prefix}${mainRes}${suffix}`;
  } catch (error) {
    resultShowValue = `${code}`;
    console.warn('code: ', code, ' scopes: ', scopes, 'error: ', resultShowValue, ' error message ', error.message);
  }

  return resultShowValue;
}

// utils
function isNumberFunc(value) {
  return typeof value === 'number' && !isNaN(value);
}

function isSymbolFunc(value) {
  return ['+', '-', '*', '/', '?', ':', '(', ')', '%'].includes(value);
}
