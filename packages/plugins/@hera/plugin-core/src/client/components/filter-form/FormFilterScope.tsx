import { css } from '@emotion/css';
import { ArrayCollapse } from '@formily/antd-v5';
import { Form } from '@nocobase/schema';
import { observer, useField, useFieldSchema } from '@nocobase/schema';
import {
  FormBlockContext,
  RecordProvider,
  SchemaComponent,
  getShouldChange,
  useCollectionManager_deprecated,
  __UNSAFE__VariablesContextType,
  __UNSAFE__DynamicComponentProps,
  __UNSAFE__VariableOption,
} from '@nocobase/client';
import React, { useMemo } from 'react';
import { FilterContext } from './context';
import { VariableInput } from './VariableInput';

interface usePropsReturn {
  options: any;
  defaultValues: any[];
  collectionName: string;
  form: Form;
  variables: __UNSAFE__VariablesContextType;
  localVariables: __UNSAFE__VariableOption | __UNSAFE__VariableOption[];
  record: Record<string, any>;
  /**
   * create 表示创建表单，update 表示更新表单
   */
  formBlockType: 'create' | 'update';
  fields: any;
}

interface Props {
  useProps: () => usePropsReturn;
  dynamicComponent: any;
}

export const FormFilterScope = observer(
  (props: Props) => {
    const fieldSchema = useFieldSchema();
    const { useProps, dynamicComponent } = props;
    const { options, defaultValues, collectionName, form, formBlockType, variables, localVariables, record, fields } =
      useProps();
    const { getAllCollectionsInheritChain } = useCollectionManager_deprecated();
    const components = useMemo(() => ({ ArrayCollapse }), []);
    const schema = useMemo(
      () => ({
        type: 'object',
        properties: {
          condition: {
            'x-component': 'Filter',
            default: defaultValues,
            'x-component-props': {
              collectionName,
              useProps() {
                return {
                  options,
                  className: css`
                    position: relative;
                    width: 100%;
                    margin-left: 10px;
                  `,
                };
              },
              dynamicComponent: (props: __UNSAFE__DynamicComponentProps) => {
                const { collectionField } = props;
                return (
                  <VariableInput
                    {...props}
                    form={form}
                    record={record}
                    collectionField={props.collectionField}
                    shouldChange={getShouldChange({
                      collectionField,
                      variables,
                      localVariables,
                      getAllCollectionsInheritChain,
                    })}
                    fields={fields}
                  />
                );
              },
            },
          },
        },
      }),
      [collectionName, defaultValues, form, localVariables, options, props, record, variables, fields],
    );
    const value = useMemo(
      () => ({ field: options, fieldSchema, dynamicComponent, options: options || [] }),
      [dynamicComponent, fieldSchema, options],
    );

    return (
      <FormBlockContext.Provider value={{ form, type: formBlockType }}>
        <RecordProvider record={record}>
          <FilterContext.Provider value={value}>
            <SchemaComponent components={components} schema={schema} />
          </FilterContext.Provider>
        </RecordProvider>
      </FormBlockContext.Provider>
    );
  },
  { displayName: 'FormFilterScope' },
);
