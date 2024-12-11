import { getRequestValues } from '../../../utils/getRequestValues';

export const getSchemaAction = (form, actionKey) => {
  const reactionsFunc = (keyName, params) => {
    const result = getRequestValues(form, actionKey);

    const targetRes = result.find((item) => {
      const itemArr = item?.split('.') || [];
      return itemArr.pop() === keyName;
    });

    if (targetRes) {
      params.description = null;
    }
  };

  return {
    page: {
      type: 'number',
      title: 'Page',
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      description: "{{t('Page variable not used. Pagination based on total current request data.')}}",
      'x-reactions': (params) => reactionsFunc('page', params),
    },
    pageSize: {
      type: 'number',
      title: 'PageSize',
      'x-decorator': 'FormItem',
      'x-component': 'InputNumber',
      description: "{{t('PageSize variable not used. Pagination based on total current request data.')}}",
      'x-reactions': (params) => reactionsFunc('pageSize', params),
    },
    filter: {
      type: 'object',
      title: 'Filter',
      'x-decorator': 'FormItem',
      'x-component': 'Input.JSON',
      description: "{{t('Filter variable not used. Filtering will apply to the current request data.')}}",
      'x-reactions': (params) => reactionsFunc('filter', params),
    },
    sort: {
      type: 'string',
      title: 'Sort',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      description: "{{t('Sort variable not used. Sorting will apply to the current request data.')}}",
      'x-reactions': (params) => reactionsFunc('sort', params),
    },
    appends: {
      type: 'string',
      title: 'Appends',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    fields: {
      type: 'string',
      title: 'Fields',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      description: "{{t('Fields variable not used. Filtering will be based on the current request data.')}}",
      'x-reactions': (params) => reactionsFunc('fields', params),
    },
    except: {
      type: 'string',
      title: 'Except',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      description: "{{t('Except variable not used. Filtering will be based on the current request data.')}}",
      'x-reactions': (params) => reactionsFunc('except', params),
    },
    filterByTk: {
      type: 'string',
      title: 'FilterByTk',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      description: "{{t('The current parameters are not adapted')}}",
      'x-reactions': (params) => reactionsFunc('filterByTk', params),
    },
    whiteList: {
      type: 'string',
      title: 'whiteList',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    blacklist: {
      type: 'string',
      title: 'blacklist',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
    body: {
      type: 'object',
      title: 'Body',
      'x-decorator': 'FormItem',
      'x-component': 'Input.JSON',
      'x-component-props': {
        autoSize: {
          minRows: 5,
          maxRows: 20,
        },
      },
    },
  };
};
