import { useForm } from '@tachybase/schema';
import { useAPIClient, useBlockRequestContext, useRequest } from '@tachybase/client';
import { useChartFilter } from '@nocobase/plugin-data-visualization/client';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

export const useLink = () => {
  const { data } = useRequest<any>({
    resource: 'link-manage',
    action: 'get',
    params: {
      name: 'DetailCheckPage',
    },
  });
  return data?.data[0];
};

export const useAddToChecklistActionProps = () => {
  const { filter } = useChartFilter();
  const navigate = useNavigate();
  const api = useAPIClient();
  const link = useLink();
  const form = useForm();
  return {
    async onClick() {
      const view = form.values.view_record_items;
      const result = await filter();

      const numbers = [];
      result?.forEach((items) => {
        numbers.push(...items.reduce((orders, current) => [...orders, ...current['单号']], []));
      });
      await api.resource('detail_checks').create({
        values: {
          start: view.record.date[0],
          end: view.record.date[1],
          project_id: view.project?.id,
          product_category_id: view.product_category?.id,
          product_id: view.product?.id,
          numbers,
        },
      });
      if (link) {
        navigate(link.link);
      } else {
        message.error('需要联系管理员配置链接！');
      }
    },
  };
};
