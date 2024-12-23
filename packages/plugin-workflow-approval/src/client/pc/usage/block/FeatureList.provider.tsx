import { useRequest } from '@tachybase/client';

export const ProviderFeatureList = (props) => {
  const { collection, action, params, children } = props;
  const { loading, data } = useRequest({
    resource: collection,
    action: action,
    params: params,
  });

  console.log('%c Line:6 🍿 data', 'font-size:18px;color:#33a5ff;background:#fca650', data);

  if (loading) {
    return null;
  }
  return children;
};
