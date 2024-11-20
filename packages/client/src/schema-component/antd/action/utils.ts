import type { ISchema } from '@tachybase/schema';

import { last } from 'lodash';

import { ActionType } from '../../../schema-settings/LinkageRules/type';
import { VariableOption, VariablesContextType } from '../../../variables/types';
import { conditionAnalyses } from '../../common/utils/uitls';

const validateJSON = {
  validator: `{{(value, rule)=> {
    if (!value) {
      return '';
    }
    try {
      const val = JSON.parse(value);
      if(!isNaN(val)) {
        return false;
      }
      return true;
    } catch(error) {
      console.error(error);
      return false;
    }
  }}}`,
  message: '{{t("Invalid JSON format")}}',
};

export const requestSettingsSchema: ISchema = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      title: '{{t("Request URL")}}',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    method: {
      type: 'string',
      title: '{{t("Request method")}}',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: 'POST',
      enum: [
        { label: 'POST', value: 'POST' },
        { label: 'GET', value: 'GET' },
        { label: 'PUT', value: 'PUT' },
        { label: 'PATCH', value: 'PATCH' },
        { label: 'DELETE', value: 'DELETE' },
      ],
    },
    headers: {
      type: 'string',
      title: '{{t("Request headers")}}',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-validator': validateJSON,
    },
    params: {
      type: 'string',
      title: '{{t("Request query parameters")}}',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-validator': validateJSON,
    },
    data: {
      type: 'string',
      title: '{{t("Request body")}}',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-validator': validateJSON,
    },
  },
};

export const linkageAction = async ({
  operator,
  field,
  condition,
  variables,
  localVariables,
}: {
  operator;
  field;
  condition;
  variables: VariablesContextType;
  localVariables: VariableOption[];
}) => {
  const disableResult = field?.stateOfLinkageRules?.disabled || [false];
  const displayResult = field?.stateOfLinkageRules?.display || ['visible'];

  switch (operator) {
    case ActionType.Visible:
      if (await conditionAnalyses({ ruleGroup: condition, variables, localVariables })) {
        displayResult.push(operator);
        field.data = field.data || {};
        field.data.hidden = false;
      }
      field.stateOfLinkageRules = {
        ...field.stateOfLinkageRules,
        display: displayResult,
      };
      field.display = last(displayResult);
      break;
    case ActionType.Hidden:
      if (await conditionAnalyses({ ruleGroup: condition, variables, localVariables })) {
        field.data = field.data || {};
        field.data.hidden = true;
      } else {
        field.data = field.data || {};
        field.data.hidden = false;
      }
      break;
    case ActionType.Disabled:
      if (await conditionAnalyses({ ruleGroup: condition, variables, localVariables })) {
        disableResult.push(true);
      }
      field.stateOfLinkageRules = {
        ...field.stateOfLinkageRules,
        disabled: disableResult,
      };
      field.disabled = last(disableResult);
      field.componentProps['disabled'] = last(disableResult);
      break;
    case ActionType.Active:
      if (await conditionAnalyses({ ruleGroup: condition, variables, localVariables })) {
        disableResult.push(false);
      }
      field.stateOfLinkageRules = {
        ...field.stateOfLinkageRules,
        disabled: disableResult,
      };
      field.disabled = last(disableResult);
      field.componentProps['disabled'] = last(disableResult);
      break;
    default:
      return null;
  }
};

export const afterSuccessSchema: ISchema = {
  type: 'object',
  title: '{{t("After successful submission")}}',
  properties: {
    successMessage: {
      title: '{{t("Popup message")}}',
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {},
    },
    popupClose: {
      title: '{{t("Popup close method")}}',
      enum: [
        { label: '{{t("Automatic close")}}', value: false },
        { label: '{{t("Manually close")}}', value: true },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {},
    },
    manualClose: {
      title: '{{t("Message clear metchod")}}',
      enum: [
        { label: '{{t("Automatic close")}}', value: false },
        { label: '{{t("Manually close")}}', value: true },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {},
    },
    redirecting: {
      title: '{{t("Then")}}',
      enum: [
        { label: '{{t("Stay on current page")}}', value: false },
        { label: '{{t("Redirect to")}}', value: true },
      ],
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      'x-component-props': {},
      'x-reactions': {
        target: 'redirectTo',
        fulfill: {
          state: {
            visible: '{{!!$self.value}}',
          },
        },
      },
    },
    redirectTo: {
      title: '{{t("Link")}}',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {},
    },
  },
};
