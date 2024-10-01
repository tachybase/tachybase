import React, { useContext } from 'react';
import { SchemaComponentContext, useCompile } from '@tachybase/client';

import { useTranslation } from '../../../locale';
import { paramsMap } from '../constants/mapListve';
import { requestHeaderList } from '../constants/requestHeaderList';
import { useContextRequestInfo } from '../contexts/RequestForm.context';

export const useVariableOptions = (showResponse) => {
  const compile = useCompile();
  const { t } = useTranslation();
  const ctx: any = useContext(SchemaComponentContext);

  const { actionKey } = useContextRequestInfo();
  const { variables } = ctx.dataSourceData?.data?.options || {};

  const options = React.useMemo(() => getOptions({ t, variables, compile, actionKey, showResponse }), [actionKey]);

  return options;
};

const getOptions = (params) => {
  const { t, variables, compile, actionKey, showResponse } = params;
  const options = [];

  if (variables) {
    options.push({
      name: 'dataSourceVariables',
      title: t('Custom variables'),
      children: variables?.map((val) => ({
        name: compile(val.name),
        title: val.name,
      })),
    });
  }

  options.push({
    name: 'request',
    title: t('TachyBase request'),
    children: [
      {
        name: 'params',
        title: 'params',
        children: (paramsMap[actionKey] || []).map((value) => ({
          name: value,
          title: value,
        })),
      },
      {
        name: 'header',
        title: 'headers',
        children: requestHeaderList,
      },
      {
        name: 'body',
        title: 'Body',
      },
      {
        name: 'token',
        title: 'Token',
      },
    ],
  });

  if (showResponse) {
    options.push({
      name: 'rawResponse',
      title: t('Third party response'),
      children: [
        {
          name: 'body',
          title: 'body',
        },
      ],
    });
  }

  return options;
};
