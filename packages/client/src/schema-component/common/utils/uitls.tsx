import { dayjs, getPickerFormat } from '@tachybase/utils/client';

import _, { every, findIndex, some } from 'lodash';

import { VariableOption, VariablesContextType } from '../../../variables/types';
import { isVariable } from '../../../variables/utils/isVariable';
import { transformVariableValue } from '../../../variables/utils/transformVariableValue';
import { inferPickerType } from '../../antd/date-picker/util';
import { getJsonLogic } from '../../common/utils/logic';

type VariablesCtx = {
  /** 当前登录的用户 */
  $user?: Record<string, any>;
  $date?: Record<string, any>;
  $form?: Record<string, any>;
};

export const parseVariables = (str: string, ctx: VariablesCtx | any) => {
  const regex = /{{(.*?)}}/;
  const matches = str?.match?.(regex);
  if (matches) {
    const result = _.get(ctx, matches[1]);
    return _.isFunction(result) ? result() : result;
  } else {
    return str;
  }
};

export function getInnermostKeyAndValue(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return null;
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (Object.prototype.toString.call(obj[key]) === '[object Object]' && obj[key] !== null) {
        return getInnermostKeyAndValue(obj[key]);
      } else {
        return { key, value: obj[key] };
      }
    }
  }
  return null;
}

export const getTargetField = (obj) => {
  const keys = getAllKeys(obj);
  const index = findIndex(keys, (key, index, keys) => {
    if (key.includes('$') && index > 0) {
      return true;
    }
  });
  const result = keys.slice(0, index);
  return result;
};

function getAllKeys(obj) {
  const keys = [];
  function traverse(o) {
    Object.keys(o)
      .sort()
      .forEach(function (key) {
        keys.push(key);
        if (o[key] && typeof o[key] === 'object') {
          traverse(o[key]);
        }
      });
  }
  traverse(obj);
  return keys;
}

export const conditionAnalyses = async ({
  ruleGroup,
  variables,
  localVariables,
  variableNameOfLeftCondition,
}: {
  ruleGroup;
  variables: VariablesContextType;
  localVariables: VariableOption[];
  /**
   * used to parse the variable name of the left condition value
   * @default '$nForm'
   */
  variableNameOfLeftCondition?: string;
}) => {
  const type = Object.keys(ruleGroup)[0] || '$and';
  const conditions = ruleGroup[type];

  let results = [];

  for (const condition of conditions) {
    if ('$and' in condition || '$or' in condition) {
      return await conditionAnalyses({ ruleGroup: condition, variables, localVariables });
    }

    const jsonlogic = getInnermostKeyAndValue(condition);
    const operator = jsonlogic?.key;

    if (!operator) {
      return true;
    }

    const targetFieldArr = getTargetField(condition);
    const targetVariableName = targetFieldToVariableString(targetFieldArr, variableNameOfLeftCondition);

    /**
     * NOTE: 因为联动规则, 添加的时候, 请求数据已经加入了相应的关联字段,
     * 因此直接查看当前是否能访问到当前记录, 如果能访问到, 无需再次专门去请求关联字段
     */
    const localFormRecord = localVariables.find((v) => v.name === '$nForm');
    if (localFormRecord?.ctx) {
      const targetValue = _.get(localFormRecord.ctx, targetFieldArr);

      const targetCollectionField = await variables.getCollectionField(targetVariableName, localVariables);

      let currentInputValue = transformVariableValue(targetValue, { targetCollectionField });
      const comparisonValue = transformVariableValue(jsonlogic.value, { targetCollectionField });
      if (
        targetCollectionField?.type &&
        ['datetime', 'date', 'dateOnly', 'datetimeNoTz', 'dateOnly', 'unixTimestamp'].includes(
          targetCollectionField.type,
        ) &&
        currentInputValue
      ) {
        const picker = inferPickerType(comparisonValue);
        const format = getPickerFormat(picker);
        currentInputValue = dayjs(currentInputValue).format(format);
      }

      const result = getJsonLogic().apply({
        [operator]: [currentInputValue, comparisonValue],
      });

      results.push(result);
      continue;
    }

    // NOTE: 走保底逻辑, 独立查询
    const targetValue = variables.parseVariable(targetVariableName, localVariables);

    const parsingResult = isVariable(jsonlogic?.value)
      ? [variables.parseVariable(jsonlogic?.value, localVariables), targetValue]
      : [jsonlogic?.value, targetValue];

    try {
      const jsonLogic = getJsonLogic();
      const [value, targetValue] = await Promise.all(parsingResult);
      const targetCollectionField = await variables.getCollectionField(targetVariableName, localVariables);

      // XXX: 这里还需要理清下, 包内自己定义的 jsonLogic 的 API 是什么? 用法是什么?, 和通用逻辑是否一致
      const result = jsonLogic.apply({
        [operator]: [
          transformVariableValue(targetValue, { targetCollectionField }),
          transformVariableValue(value, { targetCollectionField }),
        ],
      });

      results.push(result);
    } catch (error) {
      throw error;
    }
  }

  if (type === '$and') {
    return every(results, (v) => v);
  } else {
    return some(results, (v) => v);
  }
};

/**
 * 转化成变量字符串，方便解析出值
 * @param targetField
 * @returns
 */
function targetFieldToVariableString(targetField: string[], variableName = '$nForm') {
  // Action 中的联动规则虽然没有 form 上下文但是在这里也使用的是 `$nForm` 变量，这样实现更简单
  return `{{ ${variableName}.${targetField.join('.')} }}`;
}
