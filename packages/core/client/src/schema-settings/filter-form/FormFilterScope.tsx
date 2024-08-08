import React, { useMemo } from 'react';
import { ArrayCollapse } from '@tachybase/components';
import { Form, observer, useField, useFieldSchema } from '@tachybase/schema';

import { css } from 'antd-style';

import { FormBlockContext } from '../../block-provider';
import { useCollectionManager_deprecated } from '../../collection-manager';
import { RecordProvider } from '../../record-provider';
import { SchemaComponent } from '../../schema-component';
import { DynamicComponentProps } from '../../schema-component/antd/filter/DynamicComponent';
import { VariableOption, VariablesContextType } from '../../variables/types';
import { getShouldChange, VariableInput } from '../VariableInput';
import { FilterContext } from './context';

interface usePropsReturn {
  options: any;
  defaultValues: any[];
  collectionName: string;
  form: Form;
  variables: VariablesContextType;
  localVariables: VariableOption | VariableOption[];
  record: Record<string, any>;
  /**
   * create 表示创建表单，update 表示更新表单
   */
  formBlockType: 'create' | 'update';
}

interface Props {
  useProps: () => usePropsReturn;
  dynamicComponent: any;
}

export const FormFilterScope = observer(
  (props: Props) => {
    const fieldSchema = useFieldSchema();
    const { useProps, dynamicComponent } = props;
    const { options, defaultValues, collectionName, form, formBlockType, variables, localVariables, record } =
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
              dynamicComponent: (props: DynamicComponentProps) => {
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
                  />
                );
              },
            },
          },
        },
      }),
      [collectionName, defaultValues, form, localVariables, options, props, record, variables],
    );
    const value = useMemo(
      () => ({
        field: options,
        fieldSchema,
        dynamicComponent,
        options: options || [],
      }),
      [dynamicComponent, fieldSchema, options],
    );

    return (
      <FormBlockContext.Provider value={{ form, type: formBlockType, collectionName: collectionName }}>
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
