import { Collection } from '@tachybase/data-source-manager';
import { parse } from '@tachybase/utils';

import axios from 'axios';
import _ from 'lodash';

import { transformResponseThroughMiddleware } from './transform-response';
import { typeInterfaceMap } from './type-interface-map';
import { normalizeRequestOptions, normalizeRequestOptionsKey } from './utils';

function compileTemplate(template, context) {
  return parse(template)(context);
}
function mergeRequestOptions(options) {
  const { baseRequestConfig, actionOptions, templateContext = {} } = options;
  const rawConfig = {
    method: actionOptions.method,
    url: actionOptions.path,
    baseURL: baseRequestConfig.baseUrl,
    headers: {
      ...baseRequestConfig.headers,
      ...actionOptions.headers,
    },
    params: actionOptions.params,
  };
  if (actionOptions.body) {
    rawConfig.data = actionOptions.body;
  }
  if (actionOptions.contentType) {
    rawConfig.headers['Content-Type'] = actionOptions.contentType;
  }
  if (actionOptions.contentType === 'application/x-www-form-urlencoded') {
    rawConfig.data = normalizeRequestOptionsKey(rawConfig.data);
  }
  const config = compileTemplate(rawConfig, templateContext);
  if (templateContext.values && !rawConfig.data) {
    config.data = templateContext.values;
  }
  if (actionOptions.contentType === 'application/x-www-form-urlencoded') {
    config.data = new URLSearchParams(config.data).toString();
  }
  return config;
}
function buildTemplateContext(options) {
  const { dataSourceRequestConfig, templateContext, debugVars = {} } = options;
  const variables = {
    dataSourceVariables: dataSourceRequestConfig.variables || {},
  };
  for (const variableKey of Object.keys(variables)) {
    templateContext[variableKey] = variables[variableKey];
  }
  for (const variableKey of Object.keys(debugVars)) {
    if (variableKey == 'body') {
      _.set(templateContext, ['request', 'body'], debugVars[variableKey]);
    } else {
      _.set(templateContext, ['request', 'params', variableKey], debugVars[variableKey]);
    }
  }
  if (templateContext.values && !_.get(templateContext, 'request.body')) {
    templateContext.body = templateContext.values;
    _.set(templateContext, 'request.body', templateContext.values);
  }
}
function rawTypeToFieldType(rawType, exampleValue) {
  const typeInfers = {
    string: 'string',
    number: () => {
      if (Number.isInteger(exampleValue)) {
        return 'integer';
      }
      return 'float';
    },
    boolean: 'boolean',
    object: () => {
      if (_.isNull(exampleValue)) {
        return ['string', 'integer', 'float', 'boolean', 'json'];
      }
      return 'json';
    },
  };
  const inferType = typeInfers[rawType];
  if (typeof inferType === 'function') {
    return inferType();
  }
  return inferType;
}
function getInterfaceOptionsByType(type) {
  const interfaceConfig = typeInterfaceMap[type];
  if (typeof interfaceConfig === 'function') {
    return interfaceConfig();
  } else {
    return interfaceConfig;
  }
}
function parseResponseToFieldsOptions(responseData) {
  let objectItem = {};
  if (Array.isArray(responseData)) {
    objectItem = responseData[0];
  }
  if (_.isPlainObject(responseData)) {
    objectItem = responseData;
  }
  return Object.keys(objectItem).map((key) => {
    const rawType = typeof objectItem[key];
    const inferredFieldType = rawTypeToFieldType(rawType, objectItem[key]);
    let fieldOptions = {
      name: key,
      rawType,
      title: key,
      field: key,
    };
    let fieldType = inferredFieldType;
    if (Array.isArray(inferredFieldType)) {
      fieldType = inferredFieldType[0];
      fieldOptions['possibleTypes'] = inferredFieldType;
    }
    fieldOptions = {
      ...fieldOptions,
      type: fieldType,
      ...getInterfaceOptionsByType(fieldType),
    };
    _.set(fieldOptions, 'uiSchema.title', key);
    return fieldOptions;
  });
}
function guessFilterTargetKeyName(fields) {
  const keyNames = ['id', 'nodeId', 'node_id'];
  for (const keyName of keyNames) {
    if (fields.find((field) => field.field === keyName)) {
      return keyName;
    }
  }
  return void 0;
}
export class HttpCollection extends Collection {
  availableActions() {
    const allActionOptions = this.options.actions || {};
    const actions = ['list', 'get', 'create', 'update', 'destroy'];
    return actions.filter((action) => allActionOptions[action]);
  }
  // send http request to external server
  static async runAction(options) {
    const { dataSource, actionOptions, templateContext = {}, parseField, debugVars, runAsDebug } = options;
    normalizeRequestOptions(actionOptions);
    const dataSourceRequestConfig = dataSource.requestConfig();
    buildTemplateContext({
      dataSourceRequestConfig,
      templateContext,
      debugVars,
    });
    const requestConfig = mergeRequestOptions({
      baseRequestConfig: dataSourceRequestConfig,
      actionOptions,
      templateContext,
    });
    if (runAsDebug) {
      requestConfig.validateStatus = () => true;
    }
    const handleResponse = (response2) => {
      if (parseField && response2.transformedResponse.data) {
        response2.fields = parseResponseToFieldsOptions(response2.transformedResponse.data);
        const filterTargetKeyName = guessFilterTargetKeyName(response2.fields);
        if (filterTargetKeyName) {
          response2.filterTargetKey = filterTargetKeyName;
        }
      }
      if (options.runAsDebug && !response2.responseValidationErrorMessage) {
        response2.debugBody = response2.transformedResponse;
      }
      return response2;
    };
    const response = await axios.request(requestConfig).catch((error) => {
      throw new Error(`Failed to request external http datasource`, { cause: error });
    });
    const clientRequest = response.request;
    const baseResponse = {
      rawResponse: {
        status: response.status,
        headers: response.headers,
        data: response.data,
        body: response.data,
        request: {
          url: axios.getUri(requestConfig),
          method: clientRequest.method,
          headers: response.request.getHeaders(),
        },
      },
      data: null,
    };
    const transformResponse = (baseResponse2, actionOptions2) => {
      const transformer = actionOptions2.responseTransformer;
      baseResponse2.transformedResponse = compileTemplate(transformer, {
        rawResponse: baseResponse2.rawResponse,
      });
      try {
        transformResponseThroughMiddleware({
          transformedResponse: baseResponse2.transformedResponse,
          actionOptions: actionOptions2,
          templateContext,
        });
      } catch (e) {
        if (options.runAsDebug) {
          baseResponse2.responseValidationErrorMessage = e.message;
        } else {
          throw e;
        }
      }
    };
    transformResponse(baseResponse, actionOptions);
    dataSource.logger.debug({
      actionOptions,
      requestConfig,
      baseResponse,
    });
    return handleResponse(baseResponse);
  }
  getActionOptions(action) {
    const allActionOptions = this.options.actions || {};
    const actionOption = allActionOptions[action];
    if (!actionOption) {
      throw new Error(`request config of action "${action}" is not set`);
    }
    return actionOption;
  }
  runAction(action: string, templateContext?: any) {
    const actionOptions = this.getActionOptions(action);
    return HttpCollection.runAction({
      actionOptions: {
        ...actionOptions,
        type: action,
      },
      dataSource: this.collectionManager.dataSource,
      templateContext,
    });
  }
}
