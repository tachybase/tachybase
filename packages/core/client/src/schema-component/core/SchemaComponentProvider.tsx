import { createForm } from '@tachybase/schema';
import { FormProvider, Schema } from '@tachybase/schema';
import { uid } from '@tachybase/schema';
import React, { useMemo, useState, PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { SchemaComponentContext } from '../context';
import { ISchemaComponentProvider } from '../types';
import { SchemaComponentOptions } from './SchemaComponentOptions';

const randomString = (prefix = '') => {
  return `${prefix}${uid()}`;
};

Schema.silent(true);

const results = {};

const Registry = {
  silent: true,
  compile(expression: string, scope = {}) {
    const fn = () => {
      if (Registry.silent) {
        try {
          return new Function('$root', `with($root) { return (${expression}); }`)(scope);
        } catch {
          return `{{${expression}}}`;
        }
      } else {
        return new Function('$root', `with($root) { return (${expression}); }`)(scope);
      }
    };
    if (results[expression]) {
      return results[expression];
    }
    if (expression.trim().startsWith('t(')) {
      results[expression] = fn();
      return results[expression];
    }
    return fn();
  },
};

Schema.registerCompiler(Registry.compile);

export const SchemaComponentProvider: React.FC<PropsWithChildren<ISchemaComponentProvider>> = (props) => {
  const { designable, onDesignableChange, components, children } = props;
  const [uidValue, setUid] = useState(uid());
  const [formId, setFormId] = useState(uid());
  const form = useMemo(() => props.form || createForm(), [formId]);
  const { t } = useTranslation();
  const scope = useMemo(() => {
    return { ...props.scope, t, randomString };
  }, [props.scope, t]);
  const [active, setActive] = useState(designable);

  const schemaComponentContextValue = useMemo(
    () => ({
      scope,
      components,
      reset: () => setFormId(uid()),
      refresh: () => {
        setUid(uid());
      },
      designable: typeof designable === 'boolean' ? designable : active,
      setDesignable: (value) => {
        if (typeof designable !== 'boolean') {
          setActive(value);
        }
        onDesignableChange?.(value);
      },
    }),
    [uidValue, scope, components, designable, active],
  );

  return (
    // TODO: 临时修复,处理模板类型的关联数据第一次进入无法加载
    <SchemaComponentContext.Provider value={{ ...schemaComponentContextValue }}>
      <FormProvider form={form}>
        <SchemaComponentOptions inherit scope={scope} components={components}>
          {children}
        </SchemaComponentOptions>
      </FormProvider>
    </SchemaComponentContext.Provider>
  );
};
SchemaComponentProvider.displayName = 'SchemaComponentProvider';
