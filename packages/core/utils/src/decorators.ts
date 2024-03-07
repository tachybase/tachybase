import Container, { Inject, Service } from './typedi';

// declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
// declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
// declare type MethodDecorator = <T>(
//   target: Object,
//   propertyKey: string | symbol,
//   descriptor: TypedPropertyDescriptor<T>,
// ) => TypedPropertyDescriptor<T> | void;
// declare type ParameterDecorator = (
//   target: Object,
//   propertyKey: string | symbol | undefined,
//   parameterIndex: number,
// ) => void;

export interface ActionDef {
  type: string;
  resourceName?: string;
  actionName?: string;
  method?: string;
}

// init actions
Container.set({ id: 'actions', value: new Map<Function, ActionDef[]>() });

export function App() {
  return Inject('app');
}

export function Db() {
  return Inject('db');
}

export function Controller(name: string) {
  return function (target: any) {
    const serviceOptions = { id: 'controller', multiple: true };
    Service(serviceOptions)(target);
    const actions = Container.get('actions') as Map<Function, ActionDef[]>;
    if (!actions.has(target)) {
      actions.set(target, []);
    }
    actions.get(target).push({
      type: 'resource',
      resourceName: name,
    });
  };
}

export function Action(name: string) {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const actions = Container.get('actions') as Map<Function, ActionDef[]>;
    if (!actions.has(target.constructor)) {
      actions.set(target.constructor, []);
    }
    actions.get(target.constructor).push({
      type: 'action',
      method: propertyKey,
      actionName: name,
    });
  };
}
