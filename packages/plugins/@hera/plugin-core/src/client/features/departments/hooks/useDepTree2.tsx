import { useAPIClient } from '@tachybase/client';

import { useDepTree } from './useHooksDe';

export const useDepTree2 = (props?) => {
  const { resource = 'departments', resourceOf, params = {} } = props || {};
  const service = useAPIClient().resource(resource, resourceOf);
  const depTree = useDepTree(props);
  const { setTreeData, updateTreeData, initData } = depTree;
  const loadData =
    (_) =>
    async ({ key, children }) => {
      if (children != null && children.length) return;
      const { data } = await service.list({
        ...params,
        pagination: false,
        appends: ['parent(recursively=true)'],
        filter: { parentId: key },
      });
      if (data?.data?.length) {
        setTreeData(updateTreeData(key, data?.data));
      }
    };
  const getByKeyword = async (keyword) => {
    const { data } = await service.list({
      ...params,
      pagination: false,
      filter: { title: { $includes: keyword } },
      appends: ['parent(recursively=true)'],
      pageSize: 100,
    });
    initData(data?.data);
  };
  return { ...depTree, loadData, getByKeyword };
};
