import {
  useAPIClient,
  useBlockRequestContext,
  useCollection_deprecated,
  useCollectionManager_deprecated,
  useCompile,
} from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { message } from 'antd';
import { saveAs } from 'file-saver';
import lodash from 'lodash';
import { useTranslation } from 'react-i18next';

export const useExportAction = () => {
  const { service, resource } = useBlockRequestContext();
  const apiClient = useAPIClient();
  const actionSchema = useFieldSchema();
  const compile = useCompile();
  const { getCollectionJoinField } = useCollectionManager_deprecated();
  const { name, title, getField } = useCollection_deprecated();
  const { t } = useTranslation();
  return {
    async onClick() {
      const { exportSettings } = lodash.cloneDeep(actionSchema?.['x-action-settings'] ?? {});
      exportSettings.forEach((es) => {
        const { uiSchema, interface: fieldInterface } =
          getCollectionJoinField(`${name}.${es.dataIndex.join('.')}`) ?? {};
        // @ts-ignore
        es.enum = uiSchema?.enum?.map((e) => ({ value: e.value, label: e.label }));
        if (!es.enum && uiSchema?.type === 'boolean') {
          es.enum = [
            { value: true, label: t('Yes') },
            { value: false, label: t('No') },
          ];
        }
        es.defaultTitle = uiSchema?.title;
        if (fieldInterface === 'chinaRegion') {
          es.dataIndex.push('name');
        }
      });
      const hide = message.loading(t('Exporting Data...'), 0); // 显示加载状态
      const { data } = await resource.export(
        {
          title: compile(title),
          appends: service.params[0]?.appends?.join(),
          filter: JSON.stringify(service.params[0]?.filter),
          sort: service.params[0]?.sort,
        },
        {
          method: 'post',
          data: {
            columns: compile(exportSettings),
          },
          responseType: 'blob',
        },
      );
      hide(); // 隐藏加载状态
      if (data.type === 'application/json') {
        const text = await data.text();
        const {
          data: { filename },
        } = JSON.parse(text);
        window.location.href = filename;
      } else {
        const blob = new Blob([data], { type: 'application/x-xls' });
        saveAs(blob, `${compile(title)}.xlsx`);
      }
    },
  };
};
