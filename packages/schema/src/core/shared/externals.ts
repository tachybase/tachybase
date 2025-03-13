import { FormPath } from '../../shared';
import {
  getLocaleByPath,
  getValidateLocaleIOSCode,
  registerValidateFormats,
  registerValidateLocale,
  registerValidateMessageTemplateEngine,
  registerValidateRules,
  setValidateLanguage,
} from '../../validator';
import { Form } from '../models';
import { IFormProps } from '../types';
import {
  isArrayField,
  isArrayFieldState,
  isDataField,
  isDataFieldState,
  isField,
  isFieldState,
  isForm,
  isFormState,
  isGeneralField,
  isGeneralFieldState,
  isObjectField,
  isObjectFieldState,
  isQuery,
  isVoidField,
  isVoidFieldState,
} from './checkers';
import { createEffectContext, createEffectHook, useEffectForm } from './effective';

const createForm = <T extends object = any>(options?: IFormProps<T>) => {
  return new Form(options);
};

export {
  FormPath,
  createForm,
  isArrayField,
  isArrayFieldState,
  isDataField,
  isDataFieldState,
  isField,
  isFieldState,
  isForm,
  isFormState,
  isGeneralField,
  isGeneralFieldState,
  isObjectField,
  isObjectFieldState,
  isQuery,
  isVoidField,
  isVoidFieldState,
  getValidateLocaleIOSCode,
  getLocaleByPath,
  setValidateLanguage,
  registerValidateFormats,
  registerValidateLocale,
  registerValidateMessageTemplateEngine,
  registerValidateRules,
  createEffectHook,
  createEffectContext,
  useEffectForm,
};
