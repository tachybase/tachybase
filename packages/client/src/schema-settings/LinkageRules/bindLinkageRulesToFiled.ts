import { evaluators } from '@tachybase/evaluators/client';
import { Field, reaction } from '@tachybase/schema';
import { getValuesByPath, uid } from '@tachybase/utils/client';

import _ from 'lodash';

import { conditionAnalyses, getInnermostKeyAndValue, getTargetField } from '../../schema-component/common/utils/uitls';
import { VariableOption, VariablesContextType } from '../../variables/types';
import { getPath } from '../../variables/utils/getPath';
import { getVariableName } from '../../variables/utils/getVariableName';
import {
  getVariablesFromExpression,
  isVariable,
  REGEX_OF_VARIABLE_IN_EXPRESSION,
} from '../../variables/utils/isVariable';
import { ActionType } from './type';

interface Props {
  operator;
  value;
  field: Field & {
    [key: string]: any;
  };
  condition;
  variables: VariablesContextType;
  localVariables: VariableOption[];
  /**
   * used to parse the variable name of the left condition value
   * @default '$nForm'
   */
  variableNameOfLeftCondition?: string;
}

export function bindLinkageRulesToFiled({
  field,
  linkageRules,
  formValues,
  localVariables,
  action,
  rule,
  variables,
  variableNameOfLeftCondition,
}: {
  field: any;
  linkageRules: any[];
  formValues: any;
  localVariables: VariableOption[];
  action: any;
  rule: any;
  variables: VariablesContextType;
  /**
   * used to parse the variable name of the left condition value
   * @default '$nForm'
   */
  variableNameOfLeftCondition?: string;
}) {
  field['initStateOfLinkageRules'] = {
    display: field.initStateOfLinkageRules?.display || getTempFieldState(true, field.display),
    required: field.initStateOfLinkageRules?.required || getTempFieldState(true, field.required || false),
    pattern: field.initStateOfLinkageRules?.pattern || getTempFieldState(true, field.pattern),
    value: field.initStateOfLinkageRules?.value || getTempFieldState(true, field.value || field.initialValue),
  };

  return reaction(
    // 这里共依赖 3 部分，当这 3 部分中的任意一部分发生变更后，需要触发联动规则：
    // 1. 条件中的字段值；
    // 2. 条件中的变量值；
    // 3. value 表达式中的变量值；
    () => {
      // 获取条件中的字段值
      const fieldValuesInCondition = getFieldValuesInCondition({ linkageRules, formValues });

      // 获取条件中的变量值
      const variableValuesInCondition = getVariableValuesInCondition({ linkageRules, localVariables });

      // 获取 value 表达式中的变量值
      const variableValuesInExpression = getVariableValuesInExpression({ action, localVariables });

      const result = [fieldValuesInCondition, variableValuesInCondition, variableValuesInExpression]
        .map((item) => JSON.stringify(item))
        .join(',');
      return result;
    },
    getSubscriber({ action, field, rule, variables, localVariables, variableNameOfLeftCondition }),
    { fireImmediately: true, equals: _.isEqual },
  );
}

function getFieldValuesInCondition({ linkageRules, formValues }) {
  return linkageRules.map((rule) => {
    const run = (condition) => {
      const type = Object.keys(condition)[0] || '$and';
      const conditions = condition[type];

      return conditions
        .map((condition) => {
          if ('$and' in condition || '$or' in condition) {
            return run(condition);
          }

          const path = getTargetField(condition).join('.');
          return getValuesByPath(formValues, path);
        })
        .filter(Boolean);
    };

    return run(rule.condition);
  });
}

function getVariableValuesInCondition({
  linkageRules,
  localVariables,
}: {
  linkageRules: any[];
  localVariables: VariableOption[];
}) {
  return linkageRules.map((rule) => {
    const type = Object.keys(rule.condition)[0] || '$and';
    const conditions = rule.condition[type];

    return conditions
      .map((condition) => {
        const jsonlogic = getInnermostKeyAndValue(condition);
        if (!jsonlogic) {
          return null;
        }
        if (isVariable(jsonlogic.value)) {
          return getVariableValue(jsonlogic.value, localVariables);
        }

        return jsonlogic.value;
      })
      .filter(Boolean);
  });
}

function getVariableValuesInExpression({ action, localVariables }) {
  const actionValue = action.value;
  const mode = actionValue?.mode;
  const value = actionValue?.value || actionValue?.result;

  if (mode !== 'express') {
    return;
  }

  if (value == null) {
    return;
  }

  return getVariablesFromExpression(value)
    ?.map((variableString: string) => {
      return getVariableValue(variableString, localVariables);
    })
    .filter(Boolean);
}

function getVariableValue(variableString: string, localVariables: VariableOption[]) {
  if (!isVariable(variableString)) {
    return;
  }

  const variableName = getVariableName(variableString);
  const ctx = {
    [variableName]: localVariables.find((item) => item.name === variableName)?.ctx,
  };

  return getValuesByPath(ctx, getPath(variableString));
}

function getSubscriber({
  action,
  field,
  rule,
  variables,
  localVariables,
  variableNameOfLeftCondition,
}: {
  action: any;
  field: any;
  rule: any;
  variables: VariablesContextType;
  localVariables: VariableOption[];
  /**
   * used to parse the variable name of the left condition value
   * @default '$nForm'
   */
  variableNameOfLeftCondition?: string;
}): (value: string, oldValue: string) => void {
  return () => {
    // 当条件改变触发 reaction 时，会同步收集字段状态，并保存到 field.stateOfLinkageRules 中
    collectFieldStateOfLinkageRules({
      operator: action.operator,
      value: action.value,
      field,
      condition: rule.condition,
      variables,
      localVariables,
      variableNameOfLeftCondition,
    });

    // 当条件改变时，有可能会触发多个 reaction，所以这里需要延迟一下，确保所有的 reaction 都执行完毕后，
    // 再从 field.stateOfLinkageRules 中取值，因为此时 field.stateOfLinkageRules 中的值才是全的。
    setTimeout(async () => {
      const fieldName = getFieldNameByOperator(action.operator);

      // 防止重复赋值
      if (!field.stateOfLinkageRules?.[fieldName]) {
        return;
      }

      let stateList = field.stateOfLinkageRules[fieldName];

      stateList = await Promise.all(stateList);
      stateList = stateList.filter((v) => v.condition);

      const lastState = stateList[stateList.length - 1];

      if (fieldName === 'value') {
        // value 比较特殊，它只有在匹配条件时才需要赋值，当条件不匹配时，维持现在的值；
        // stateList 中肯定会有一个初始值，所以当 stateList.length > 1 时，就说明有匹配条件的情况；
        if (stateList.length > 1) {
          field.value = lastState.value;
        }
      } else {
        field[fieldName] = lastState?.value;
        requestAnimationFrame(() => {
          field.setState((state) => {
            state[fieldName] = lastState?.value;
          });
        });
        //字段隐藏时清空数据
        if (fieldName === 'display' && lastState?.value === 'none') {
          field.value = null;
        }
      }
      // 在这里清空 field.stateOfLinkageRules，就可以保证：当条件再次改变时，如果该字段没有和任何条件匹配，则需要把对应的值恢复到初始值；
      field.stateOfLinkageRules[fieldName] = null;
    });
  };
}

function getFieldNameByOperator(operator: ActionType) {
  switch (operator) {
    case ActionType.Required:
    case ActionType.InRequired:
      return 'required';
    case ActionType.Visible:
    case ActionType.None:
    case ActionType.Hidden:
      return 'display';
    case ActionType.Editable:
    case ActionType.ReadOnly:
    case ActionType.ReadPretty:
      return 'pattern';
    case ActionType.Value:
      return 'value';
    default:
      return null;
  }
}

export const collectFieldStateOfLinkageRules = ({
  operator,
  value,
  field,
  condition,
  variables,
  localVariables,
  variableNameOfLeftCondition,
}: Props) => {
  const requiredResult = field?.stateOfLinkageRules?.required || [field?.initStateOfLinkageRules?.required];
  const displayResult = field?.stateOfLinkageRules?.display || [field?.initStateOfLinkageRules?.display];
  const patternResult = field?.stateOfLinkageRules?.pattern || [field?.initStateOfLinkageRules?.pattern];
  const valueResult = field?.stateOfLinkageRules?.value || [field?.initStateOfLinkageRules?.value];
  const { evaluate } = evaluators.get('formula.js');
  const paramsToGetConditionResult = { ruleGroup: condition, variables, localVariables, variableNameOfLeftCondition };

  switch (operator) {
    case ActionType.Required:
      requiredResult.push(getTempFieldState(conditionAnalyses(paramsToGetConditionResult), true));
      field.stateOfLinkageRules = {
        ...field.stateOfLinkageRules,
        required: requiredResult,
      };
      break;
    case ActionType.InRequired:
      requiredResult.push(getTempFieldState(conditionAnalyses(paramsToGetConditionResult), false));
      field.stateOfLinkageRules = {
        ...field.stateOfLinkageRules,
        required: requiredResult,
      };
      break;
    case ActionType.Visible:
    case ActionType.None:
    case ActionType.Hidden:
      displayResult.push(getTempFieldState(conditionAnalyses(paramsToGetConditionResult), operator));
      field.stateOfLinkageRules = {
        ...field.stateOfLinkageRules,
        display: displayResult,
      };
      break;
    case ActionType.Editable:
    case ActionType.ReadOnly:
    case ActionType.ReadPretty:
      patternResult.push(getTempFieldState(conditionAnalyses(paramsToGetConditionResult), operator));
      field.stateOfLinkageRules = {
        ...field.stateOfLinkageRules,
        pattern: patternResult,
      };
      break;
    case ActionType.Value:
      {
        const getValue = async () => {
          if (value?.mode === 'express') {
            if ((value.value || value.result) == null) {
              return;
            }

            // 解析如 `{{$user.name}}` 之类的变量
            const { exp, scope: expScope } = await replaceVariables(value.value || value.result, {
              variables,
              localVariables,
            });

            try {
              const result = evaluate(exp, { now: () => new Date().toString(), ...expScope });
              return result;
            } catch (error) {
              console.error(error);
            }
          } else if (value?.mode === 'constant') {
            return value?.value ?? value;
          } else {
            return null;
          }
        };
        if (isConditionEmpty(condition)) {
          valueResult.push(getTempFieldState(true, getValue()));
        } else {
          valueResult.push(getTempFieldState(conditionAnalyses(paramsToGetConditionResult), getValue()));
        }
        field.stateOfLinkageRules = {
          ...field.stateOfLinkageRules,
          value: valueResult,
        };
      }
      break;
    default:
      return null;
  }
}; /**
 * 获取字段临时状态对象
 */

export async function getTempFieldState(condition: boolean | Promise<boolean>, value: any) {
  [condition, value] = await Promise.all([condition, value]);

  return {
    condition,
    value,
  };
}

function isConditionEmpty(rules: { $and?: any; $or?: any }) {
  const type = Object.keys(rules)[0] || '$and';
  const conditions = rules[type];

  return _.isEmpty(conditions);
}
export async function replaceVariables(
  value: string,
  {
    variables,
    localVariables,
  }: {
    variables: VariablesContextType;
    localVariables: VariableOption[];
  },
) {
  const store = {};
  const scope = {};

  if (value == null) {
    return;
  }

  const waitForParsing = value.match(REGEX_OF_VARIABLE_IN_EXPRESSION)?.map(async (item) => {
    const { value: parsedValue } = await variables.parseVariable(item, localVariables);

    // 在开头加 `_` 是为了保证 id 不能以数字开头，否则在解析表达式的时候（不是解析变量）会报错
    const id = `_${uid()}`;

    scope[id] = parsedValue;
    store[item] = id;
    return parsedValue;
  });

  if (waitForParsing) {
    await Promise.all(waitForParsing);
  }
  return {
    exp: value.replace(REGEX_OF_VARIABLE_IN_EXPRESSION, (match) => {
      return `{{${store[match] || match}}}`;
    }),
    scope,
  };
}
