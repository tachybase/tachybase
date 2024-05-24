import React, { useCallback, useContext, useMemo } from 'react';
import {
  __UNSAFE__,
  __UNSAFE__VariableInputOption,
  __UNSAFE__VariableOption,
  __UNSAFE__VariablesContextType,
  CollectionFieldOptions,
  isVariable,
  useCollectionManager_deprecated,
  useCompile,
  useDateVariable,
  useUserVariable,
  useVariableScope,
  Variable,
} from '@tachybase/client';
// @ts-ignore
import { Form, Schema, SchemaOptionsContext, useField, useFieldSchema } from '@tachybase/schema';

import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { FilterContext } from './context';

const { useBlockCollection, useValues, useVariableOptions, useContextAssociationFields, useRecordVariable } =
  __UNSAFE__;

interface GetShouldChangeProps {
  collectionField: CollectionFieldOptions;
  variables: __UNSAFE__VariablesContextType;
  localVariables: __UNSAFE__VariableOption | __UNSAFE__VariableOption[];
  /** `useCollectionManager` 返回的 */
  getAllCollectionsInheritChain: (collectionName: string) => string[];
}

interface RenderSchemaComponentProps {
  value: any;
  onChange: (value: any) => void;
}

type Props = {
  value: any;
  onChange: (value: any, optionPath?: any[]) => void;
  renderSchemaComponent: (props: RenderSchemaComponentProps) => any;
  schema?: any;
  /** 消费变量值的字段 */
  targetFieldSchema?: Schema;
  children?: any;
  className?: string;
  style?: React.CSSProperties;
  collectionField: CollectionFieldOptions;
  contextCollectionName?: string;
  /**指定当前表单数据表 */
  currentFormCollectionName?: string;
  /**指定当前对象数据表 */
  currentIterationCollectionName?: string;
  /**
   * 根据 `onChange` 的第一个参数，判断是否需要触发 `onChange`
   * @param value `onChange` 的第一个参数
   * @returns 返回为 `true` 时，才会触发 `onChange`
   */
  shouldChange?: (value: any, optionPath?: any[]) => Promise<boolean>;
  form?: Form;
  /**
   * 当前表单的记录，数据来自数据库
   */
  record?: Record<string, any>;
  /**
   * 可以用该方法对内部的 scope 进行筛选和修改
   * @param scope
   * @returns
   */
  returnScope?: (scope: __UNSAFE__VariableInputOption[]) => any[];
  fields: any;
};

/**
 * 注意：该组件存在以下问题：
 * - 在选中选项的时候该组件不能触发重渲染
 * - 如果触发重渲染可能会导致无法展开子选项列表
 * @param props
 * @returns
 */
export const VariableInput = (props: Props) => {
  const {
    value,
    onChange,
    renderSchemaComponent: RenderSchemaComponent,
    style,
    schema,
    className,
    contextCollectionName,
    collectionField,
    shouldChange,
    form,
    record,
    returnScope = _.identity,
    targetFieldSchema,
    currentFormCollectionName,
    currentIterationCollectionName,
    fields,
  } = props;
  const { name: blockCollectionName } = useBlockCollection();
  const scope = useVariableScope();
  const { operator, schema: uiSchema = collectionField?.uiSchema } = useValues();

  const variableOptions = useVariableOptions({
    collectionField,
    form,
    record,
    operator,
    uiSchema,
    targetFieldSchema,
  });
  const contextVariable = useContextAssociationFields({ schema, maxDepth: 2, contextCollectionName, collectionField });
  const { compatOldVariables } = useCompatOldVariables({
    collectionField,
    uiSchema,
    targetFieldSchema,
    blockCollectionName,
  });

  if (contextCollectionName && variableOptions.every((item) => item.value !== contextVariable.value)) {
    variableOptions.push(contextVariable);
  }

  const handleChange = useCallback(
    (value: any, optionPath: any[]) => {
      if (!shouldChange) {
        return onChange(value);
      }

      // `shouldChange` 这个函数的运算量比较大，会导致展开变量列表时有明显的卡顿感，在这里加个延迟能有效解决这个问题
      setTimeout(async () => {
        if (await shouldChange(value, optionPath)) {
          onChange(value);
        }
      });
    },
    [onChange, shouldChange],
  );
  const options = useVariableCustomOptions(fields);
  return (
    <Variable.Input
      className={className}
      value={value}
      onChange={handleChange}
      scope={options}
      style={style}
      changeOnSelect
    >
      <RenderSchemaComponent value={value} onChange={onChange} />
    </Variable.Input>
  );
};

/**
 * 通过限制用户的选择，来防止用户选择错误的变量
 */
export const getShouldChange = ({
  collectionField,
  variables,
  localVariables,
  getAllCollectionsInheritChain,
}: GetShouldChangeProps) => {
  const collectionsInheritChain = collectionField ? getAllCollectionsInheritChain(collectionField.target) : [];

  return async (value: any, optionPath: any[]) => {
    if (_.isString(value) && value.includes('$nRole')) {
      return true;
    }

    if (!isVariable(value) || !variables || !collectionField) {
      return true;
    }

    // `json` 可以选择任意类型的变量，详见：https://tachybase.feishu.cn/docx/EmNEdEBOnoQohUx2UmBcqIQ5nyh#FPLfdSRDEoXR65xW0mBcdfL5n0c
    if (collectionField.interface === 'json') {
      return true;
    }

    const lastOption = optionPath[optionPath.length - 1];

    // 点击叶子节点时，必须更新 value
    if (lastOption && _.isEmpty(lastOption.children) && !lastOption.loadChildren) {
      return true;
    }

    const collectionFieldOfVariable = await variables.getCollectionField(value, localVariables);

    if (!collectionField) {
      return false;
    }

    // `一对一` 和 `一对多` 的不能用于设置默认值，因为其具有唯一性
    if (['o2o', 'o2m', 'oho'].includes(collectionFieldOfVariable?.interface)) {
      return false;
    }
    if (!collectionField.target && collectionFieldOfVariable?.target) {
      return false;
    }
    if (collectionField.target && !collectionFieldOfVariable?.target) {
      return false;
    }
    if (
      collectionField.target &&
      collectionFieldOfVariable?.target &&
      !collectionsInheritChain.includes(collectionFieldOfVariable?.target)
    ) {
      return false;
    }

    return true;
  };
};

export interface FormatVariableScopeParam {
  children: any[];
  disabled: boolean;
  name: string;
  title: string;
}

export interface FormatVariableScopeReturn {
  value: string;
  key: string;
  label: string;
  disabled: boolean;
  children?: any[];
}

/**
 * 兼容老版本的变量
 * @param variables
 */
export function useCompatOldVariables(props: {
  uiSchema: any;
  collectionField: CollectionFieldOptions;
  blockCollectionName: string;
  noDisabled?: boolean;
  targetFieldSchema?: Schema;
}) {
  const { uiSchema, collectionField, noDisabled, targetFieldSchema, blockCollectionName } = props;
  const { t } = useTranslation();
  const lowLevelUserVariable = useUserVariable({
    maxDepth: 1,
    uiSchema: uiSchema,
    collectionField,
    noDisabled,
    targetFieldSchema,
  });
  const currentRecordVariable = useRecordVariable({
    schema: uiSchema,
    collectionName: blockCollectionName,
    collectionField,
    noDisabled,
    targetFieldSchema,
  });

  const compatOldVariables = useCallback(
    (variables: __UNSAFE__VariableInputOption[], { value }) => {
      if (!isVariable(value)) {
        return variables;
      }

      variables = _.cloneDeep(variables);

      const systemVariable: __UNSAFE__VariableInputOption = {
        value: '$system',
        key: '$system',
        label: t('System variables'),
        isLeaf: false,
        children: [
          {
            value: 'now',
            key: 'now',
            label: t('Current time'),
            isLeaf: true,
            depth: 1,
          },
        ],
        depth: 0,
      };
      const currentTime = {
        value: 'currentTime',
        label: t('Current time'),
        children: null,
      };

      if (value.includes('$system')) {
        variables.push(systemVariable);
      }

      if (value.includes(`${blockCollectionName}.`)) {
        const variable = variables.find((item) => item.value === '$nForm' || item.value === '$nRecord');
        if (variable) {
          variable.value = blockCollectionName;
        }
      }

      if (value.includes('$form')) {
        const variable = variables.find((item) => item.value === '$nForm');
        if (variable) {
          variable.value = '$form';
        }
      }

      if (value.includes('currentUser')) {
        const userVariable = variables.find((item) => item.value === '$user');
        if (userVariable) {
          userVariable.value = 'currentUser';
        } else {
          variables.unshift({ ...lowLevelUserVariable, value: 'currentUser' });
        }
      }

      if (value.includes('currentRecord')) {
        const formVariable = variables.find((item) => item.value === '$nRecord');
        if (formVariable) {
          formVariable.value = 'currentRecord';
        } else {
          variables.unshift({ ...currentRecordVariable, value: 'currentRecord' });
        }
      }

      if (value.includes('currentTime')) {
        variables.push(currentTime);
      }

      if (value.includes('$date')) {
        const formVariable = variables.find((item) => item.value === '$nDate');
        if (formVariable) {
          formVariable.value = '$date';
        }
      }

      return variables;
    },
    [blockCollectionName],
  );

  return { compatOldVariables };
}

export const useVariableCustomOptions = (fields) => {
  const field = useField<any>();
  const { operator, schema } = field.data || {};
  const userVariable = useUserVariable({
    collectionField: { uiSchema: schema },
    uiSchema: schema,
  });
  const dateVariable = useDateVariable({ operator, schema });
  const filterVariable = useFilterVariable(fields);

  const result = useMemo(
    () => [userVariable, dateVariable, filterVariable].filter(Boolean),
    [dateVariable, userVariable, filterVariable],
  );

  if (!operator || !schema) return [];

  return result;
};

export const useFilterVariable = (fields) => {
  const { t } = useTranslation();
  const compile = useCompile();
  const { collections } = useCollectionManager_deprecated();
  const customFields = [];
  for (const field in fields) {
    customFields.push({
      key: field,
      ...fields[field],
    });
  }

  const options = customFields
    .filter((value) => value?.props?.name.includes('custom.'))
    .map((custom) => {
      const value = custom?.props?.name.replace(/^custom\./, '');
      return {
        key: custom?.props?.name,
        value,
        label: custom.title,
      };
    });
  const result = useMemo(
    () => ({
      label: t('Current filter'),
      value: '$nFilter',
      key: '$nFilter',
      children: options,
    }),
    [options, t],
  );

  if (!options.length) return null;

  return result;
};
