import React, { ComponentType, useMemo } from 'react';
import { useExpressionScope } from '@tachybase/schema';

import _ from 'lodash';

import { useDesignable } from '../../schema-component';

const useDefaultSchemaProps = () => undefined;

interface WithSchemaHookOptions {
  displayName?: string;
}

export function withDynamicSchemaProps<T = any>(Component: any, options: WithSchemaHookOptions = {}) {
  const displayName = options.displayName || Component.displayName || Component.name;
  const ComponentWithProps: ComponentType<T> = (props) => {
    const { dn, findComponent } = useDesignable();
    const scope = useExpressionScope();
    const useComponentPropsStr = useMemo(() => {
      const xComponent = dn.getSchemaAttribute('x-component');
      const xDecorator = dn.getSchemaAttribute('x-decorator');
      const xUseComponentProps = dn.getSchemaAttribute('x-use-component-props');
      const xUseDecoratorProps = dn.getSchemaAttribute('x-use-decorator-props');

      if (xComponent && xUseComponentProps && findComponent(xComponent) === ComponentWithProps) {
        return xUseComponentProps;
      }

      if (xDecorator && xUseDecoratorProps && findComponent(xDecorator) === ComponentWithProps) {
        return xUseDecoratorProps;
      }
    }, [dn]);
    const useSchemaProps = useMemo(() => {
      const getHook = (str: string, scope: Record<string, any>, allText: string) => {
        let res = undefined;
        if (_.isFunction(str)) {
          res = str;
        } else {
          res = scope[str];
          if (!res) {
            console.error(`${allText} is not registered`);
          }
        }
        return res || useDefaultSchemaProps;
      };

      if (!useComponentPropsStr) {
        return useDefaultSchemaProps;
      }

      if (_.isFunction(useComponentPropsStr)) {
        return useComponentPropsStr;
      }

      const pathList = useComponentPropsStr.split('.');
      let result;

      for (const item of pathList) {
        result = getHook(item, result || scope, useComponentPropsStr);
      }

      return result;
    }, [scope, useComponentPropsStr]);
    const schemaProps = useSchemaProps(props);

    const memoProps = useMemo(() => {
      return { ...props, ...schemaProps };
    }, [schemaProps, props]);

    // @ts-ignore
    return <Component {...memoProps}>{props.children}</Component>;
  };

  Component.displayName = displayName;
  ComponentWithProps.displayName = `withSchemaProps(${displayName})`;

  return ComponentWithProps;
}

export function DynamicSchemaProps(options: WithSchemaHookOptions = {}) {
  return <T = any,>(Component: any, _context: any) => {
    const displayName = options.displayName || Component.displayName || Component.name;
    const ComponentWithProps: ComponentType<T> = (props) => {
      const { dn, findComponent } = useDesignable();
      const scope = useExpressionScope();
      const useComponentPropsStr = useMemo(() => {
        const xComponent = dn.getSchemaAttribute('x-component');
        const xDecorator = dn.getSchemaAttribute('x-decorator');
        const xUseComponentProps = dn.getSchemaAttribute('x-use-component-props');
        const xUseDecoratorProps = dn.getSchemaAttribute('x-use-decorator-props');

        if (xComponent && xUseComponentProps && findComponent(xComponent) === ComponentWithProps) {
          return xUseComponentProps;
        }

        if (xDecorator && xUseDecoratorProps && findComponent(xDecorator) === ComponentWithProps) {
          return xUseDecoratorProps;
        }
      }, [dn]);
      const useSchemaProps = useMemo(() => {
        const getHook = (str: string, scope: Record<string, any>, allText: string) => {
          let res = undefined;
          if (_.isFunction(str)) {
            res = str;
          } else {
            res = scope[str];
            if (!res) {
              console.error(`${allText} is not registered`);
            }
          }
          return res || useDefaultSchemaProps;
        };

        if (!useComponentPropsStr) {
          return useDefaultSchemaProps;
        }

        if (_.isFunction(useComponentPropsStr)) {
          return useComponentPropsStr;
        }

        const pathList = useComponentPropsStr.split('.');
        let result;

        for (const item of pathList) {
          result = getHook(item, result || scope, useComponentPropsStr);
        }

        return result;
      }, [scope, useComponentPropsStr]);
      const schemaProps = useSchemaProps(props);

      const memoProps = useMemo(() => {
        return { ...props, ...schemaProps };
      }, [schemaProps, props]);

      // @ts-ignore
      return <Component {...memoProps}>{props.children}</Component>;
    };

    Component.displayName = displayName;
    ComponentWithProps.displayName = `withSchemaProps(${displayName})`;

    return ComponentWithProps;
  };
}
