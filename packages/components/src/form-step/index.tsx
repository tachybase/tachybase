import React, { Fragment } from 'react';
import {
  action,
  connect,
  define,
  Form,
  markRaw,
  model,
  observable,
  observer,
  RecursionField,
  Schema,
  SchemaKey,
  useField,
  useFieldSchema,
  VoidField,
} from '@tachybase/schema';

import { Steps } from 'antd';
import { StepProps, StepsProps } from 'antd/lib/steps';
import cls from 'classnames';

import { usePrefixCls } from '../__builtins__';

export interface IFormStep {
  connect: (steps: SchemaStep[], field: VoidField) => void;
  current: number;
  allowNext: boolean;
  allowBack: boolean;
  setCurrent(key: number): void;
  submit: Form['submit'];
  next(): void;
  back(): void;
}

export interface IFormStepProps extends StepsProps {
  formStep?: IFormStep;
}

type ComposedFormStep = React.FC<React.PropsWithChildren<IFormStepProps>> & {
  StepPane: React.FC<React.PropsWithChildren<StepProps>>;
  createFormStep: (defaultCurrent?: number) => IFormStep;
};

type SchemaStep = {
  name: SchemaKey;
  props: any;
  schema: Schema;
};

type FormStepEnv = {
  form: Form | null;
  field: VoidField | null;
  steps: SchemaStep[];
};

const parseSteps = (schema: Schema) => {
  const steps: SchemaStep[] = [];
  schema.mapProperties((schema, name) => {
    if (schema['x-component']?.indexOf('StepPane') > -1) {
      steps.push({
        name,
        props: schema['x-component-props'],
        schema,
      });
    }
  });
  return steps;
};

const createFormStep = (defaultCurrent = 0): IFormStep => {
  const env: FormStepEnv = define(
    {
      form: null,
      field: null,
      steps: [],
    },
    {
      form: observable.ref,
      field: observable.ref,
      steps: observable.shallow,
    },
  );

  const setDisplay = action.bound?.((target: number) => {
    const currentStep = env.steps[target];
    env.steps.forEach(({ name }) => {
      env.form?.query(`${env.field?.address}.${name}`).take((field) => {
        if (name === currentStep.name) {
          field.setDisplay('visible');
        } else {
          field.setDisplay('hidden');
        }
      });
    });
  });

  const next = action.bound?.(() => {
    if (formStep.allowNext) {
      formStep.setCurrent(formStep.current + 1);
    }
  });

  const back = action.bound?.(() => {
    if (formStep.allowBack) {
      formStep.setCurrent(formStep.current - 1);
    }
  });

  const formStep: IFormStep = model({
    connect(steps, field) {
      env.steps = steps;
      env.form = field?.form;
      env.field = field;
    },
    current: defaultCurrent,
    setCurrent(key: number) {
      setDisplay?.(key);
      formStep.current = key;
    },
    get allowNext() {
      return formStep.current < env.steps.length - 1;
    },
    get allowBack() {
      return formStep.current > 0;
    },
    async next() {
      try {
        await env.form?.validate();
        if (env.form?.valid) {
          next?.();
        }
      } catch {
        /* empty */
      }
    },
    async back() {
      back?.();
    },
    async submit(onSubmit) {
      return env.form?.submit?.(onSubmit) as Promise<any>;
    },
  });
  return markRaw(formStep);
};

export const FormStep = connect(
  observer(({ formStep, className, ...props }: IFormStepProps) => {
    const field = useField<VoidField>();
    const prefixCls = usePrefixCls('formily-step', props);
    const schema = useFieldSchema();
    const steps = parseSteps(schema);
    const current = props.current || formStep?.current || 0;
    formStep?.connect?.(steps, field);
    return (
      <div className={cls(prefixCls, className)}>
        <Steps {...props} style={{ marginBottom: 10, ...props.style }} current={current}>
          {steps.map(({ props }, key) => {
            return <Steps.Step key={key} {...props} />;
          })}
        </Steps>
        {steps.map(({ name, schema }, key) => {
          if (key !== current) return;
          return <RecursionField key={key} name={name} schema={schema} />;
        })}
      </div>
    );
  }),
) as unknown as ComposedFormStep;

const StepPane: React.FC<React.PropsWithChildren<StepProps>> = ({ children }) => {
  return <Fragment>{children}</Fragment>;
};

FormStep.StepPane = StepPane;
FormStep.createFormStep = createFormStep;

export default FormStep;
