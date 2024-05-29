import {
  ArrayField,
  FormPathPattern,
  GeneralField,
  IExchangeArrayStateProps,
  INodePatch,
  isArrayField,
  isDataField,
  ISpliceArrayStateProps,
  isVoidField,
  LifeCycleTypes,
} from '@formily/core';
import { batch } from '@formily/reactive';
import { unstable_useCompatEffect } from '@formily/reactive-react';
import { each, FormPath, isNumberLike } from '@formily/shared';

export * from '@formily/core';
export type { ArrayField, Field, FormPathPattern, GeneralField, ObjectField } from '@formily/core';
export * from '@formily/grid';
export * from '@formily/json-schema';
export {
  type IFieldProps,
  type IRecursionFieldProps,
  type ISchemaFieldProps,
  type ISchemaFieldReactFactoryOptions,
  type IVoidFieldProps,
  type JSXComponent,
  type SchemaReactComponents,
  FormConsumer,
  ArrayField as ArrayFieldComponent,
  ExpressionScope,
  Field as FieldComponent,
  FieldContext,
  FormContext,
  FormProvider,
  ObjectField as ObjectFieldComponent,
  RecursionField,
  SchemaComponentsContext,
  SchemaContext,
  SchemaExpressionScopeContext,
  SchemaOptionsContext,
  VoidField as VoidFieldComponent,
  connect,
  createSchemaField,
  mapProps,
  mapReadPretty,
  useExpressionScope,
  useField,
  useFieldSchema,
  useForm,
  useFormEffects,
} from '@formily/react';
export * from '@formily/reactive';
export * from '@formily/reactive-react';
export * from '@formily/shared';
export * from '@formily/validator';
interface IRecycleTarget {
  onMount: () => void;
  onUnmount: () => void;
}

export const useAttach = <T extends IRecycleTarget>(target: T): T => {
  unstable_useCompatEffect(() => {
    target.onMount();
    return () => target.onUnmount();
  }, [target]);
  return target;
};

export const NumberIndexReg = /^\.(\d+)/;
export const exchangeArrayState = (field: ArrayField, props: IExchangeArrayStateProps) => {
  const { fromIndex, toIndex } = {
    fromIndex: 0,
    toIndex: 0,
    ...props,
  };
  const address = field.address.toString();
  const fields = field.form.fields;
  const addrLength = address.length;
  const fieldPatches: INodePatch<GeneralField>[] = [];
  const isArrayChildren = (identifier: string) => {
    return identifier.indexOf(address) === 0 && identifier.length > addrLength;
  };

  const isDown = fromIndex < toIndex;

  const isMoveNode = (identifier: string) => {
    const afterStr = identifier.slice(address.length);
    const number = afterStr.match(NumberIndexReg)?.[1];
    if (number === undefined) return false;
    const index = Number(number);
    return isDown ? index > fromIndex && index <= toIndex : index < fromIndex && index >= toIndex;
  };

  const isFromNode = (identifier: string) => {
    const afterStr = identifier.substring(addrLength);
    const number = afterStr.match(NumberIndexReg)?.[1];
    if (number === undefined) return false;
    const index = Number(number);
    return index === fromIndex;
  };

  const moveIndex = (identifier: string) => {
    const preStr = identifier.substring(0, addrLength);
    const afterStr = identifier.substring(addrLength);
    const number = afterStr.match(NumberIndexReg)[1];
    const current = Number(number);
    let index = current;
    if (index === fromIndex) {
      index = toIndex;
    } else {
      index += isDown ? -1 : 1;
    }

    return `${preStr}${afterStr.replace(/^\.\d+/, `.${index}`)}`;
  };

  batch(() => {
    each(fields, (field, identifier) => {
      if (isArrayChildren(identifier)) {
        if (isMoveNode(identifier) || isFromNode(identifier)) {
          const newIdentifier = moveIndex(identifier);
          fieldPatches.push({
            type: 'update',
            address: newIdentifier,
            oldAddress: identifier,
            payload: field,
          });
          if (!fields[newIdentifier]) {
            fieldPatches.push({
              type: 'remove',
              address: identifier,
            });
          }
        }
      }
    });
    patchFieldStates(fields, fieldPatches);
  });
  field.form.notify(LifeCycleTypes.ON_FORM_GRAPH_CHANGE);
};

export const patchFieldStates = (target: Record<string, GeneralField>, patches: INodePatch<GeneralField>[]) => {
  patches.forEach(({ type, address, oldAddress, payload }) => {
    if (type === 'remove') {
      destroy(target, address, false);
    } else if (type === 'update') {
      if (payload) {
        target[address] = payload;
        if (target[oldAddress] === payload) {
          target[oldAddress] = undefined;
        }
      }
      if (address && payload) {
        locateNode(payload, address);
      }
    }
  });
};

export const destroy = (target: Record<string, GeneralField>, address: string, forceClear = true) => {
  const field = target[address];
  field?.dispose();
  if (isDataField(field) && forceClear) {
    const form = field.form;
    const path = field.path;
    form.deleteValuesIn(path);
    form.deleteInitialValuesIn(path);
  }
  delete target[address];
};

export const locateNode = (field: GeneralField, address: FormPathPattern) => {
  field.address = FormPath.parse(address);
  field.path = buildFieldPath(field);
  field.form.indexes[field.path.toString()] = field.address.toString();
  return field;
};

export const buildFieldPath = (field: GeneralField) => {
  return buildDataPath(field.form.fields, field.address);
};

export const buildDataPath = (fields: Record<string, GeneralField>, pattern: FormPath) => {
  let prevArray = false;
  const segments = pattern.segments;
  const path = segments.reduce((path: string[], key: string, index: number) => {
    const currentPath = path.concat(key);
    const currentAddress = segments.slice(0, index + 1);
    const current = fields[currentAddress.join('.')];
    if (prevArray) {
      if (!isVoidField(current)) {
        prevArray = false;
      }
      return path;
    }
    if (index >= segments.length - 1) {
      return currentPath;
    }
    if (isVoidField(current)) {
      const parentAddress = segments.slice(0, index);
      const parent = fields[parentAddress.join('.')];
      if (isArrayField(parent) && isNumberLike(key)) {
        prevArray = true;
        return currentPath;
      }
      return path;
    } else {
      prevArray = false;
    }
    return currentPath;
  }, []);
  return new FormPath(path);
};

export const spliceArrayState = (field: ArrayField, props?: ISpliceArrayStateProps) => {
  const { startIndex, deleteCount, insertCount } = {
    startIndex: 0,
    deleteCount: 0,
    insertCount: 0,
    ...props,
  };
  const address = field.address.toString();
  const addrLength = address.length;
  const form = field.form;
  const fields = form.fields;
  const fieldPatches: INodePatch<GeneralField>[] = [];
  const offset = insertCount - deleteCount;
  const isArrayChildren = (identifier: string) => {
    return identifier.indexOf(address) === 0 && identifier.length > addrLength;
  };
  const isAfterNode = (identifier: string) => {
    const afterStr = identifier.substring(addrLength);
    const number = afterStr.match(NumberIndexReg)?.[1];
    if (number === undefined) return false;
    const index = Number(number);
    return index > startIndex + deleteCount - 1;
  };
  const isInsertNode = (identifier: string) => {
    const afterStr = identifier.substring(addrLength);
    const number = afterStr.match(NumberIndexReg)?.[1];
    if (number === undefined) return false;
    const index = Number(number);
    return index >= startIndex && index < startIndex + insertCount;
  };
  const isDeleteNode = (identifier: string) => {
    const preStr = identifier.substring(0, addrLength);
    const afterStr = identifier.substring(addrLength);
    const number = afterStr.match(NumberIndexReg)?.[1];
    if (number === undefined) return false;
    const index = Number(number);
    return (
      (index > startIndex && !fields[`${preStr}${afterStr.replace(/^\.\d+/, `.${index + deleteCount}`)}`]) ||
      index === startIndex
    );
  };
  const moveIndex = (identifier: string) => {
    if (offset === 0) return identifier;
    const preStr = identifier.substring(0, addrLength);
    const afterStr = identifier.substring(addrLength);
    const number = afterStr.match(NumberIndexReg)?.[1];
    if (number === undefined) return identifier;
    const index = Number(number) + offset;
    return `${preStr}${afterStr.replace(/^\.\d+/, `.${index}`)}`;
  };

  batch(() => {
    each(fields, (field, identifier) => {
      if (isArrayChildren(identifier)) {
        if (isAfterNode(identifier)) {
          const newIdentifier = moveIndex(identifier);
          fieldPatches.push({
            type: 'update',
            address: newIdentifier,
            oldAddress: identifier,
            payload: field,
          });
        }
        if (isInsertNode(identifier) || isDeleteNode(identifier)) {
          fieldPatches.push({ type: 'remove', address: identifier });
        }
      }
    });
    patchFieldStates(fields, fieldPatches);
  });
  field.form.notify(LifeCycleTypes.ON_FORM_GRAPH_CHANGE);
};
