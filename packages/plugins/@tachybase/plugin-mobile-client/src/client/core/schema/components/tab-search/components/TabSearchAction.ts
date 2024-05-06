import { useDesigner, useSchemaInitializerRender } from '@nocobase/client';
import { useFieldSchema } from '@tachybase/schema';
import { isTabSearchCollapsibleInputItem } from '../utils';

export const useTabSearchAction = () => {
  const Designer = useDesigner();
  const fieldSchema = useFieldSchema();
  const { render } = useSchemaInitializerRender(fieldSchema['x-initializer'], fieldSchema['x-initializer-props']);

  const filterProperties = (s) => {
    if (!isTabSearchCollapsibleInputItem(s['x-component'])) {
      return true;
    } else {
      // 保留第一个，如果进入这个判断一定有值，所以取0不会出错
      return (
        s === Object.values(s.parent.properties).filter((s) => isTabSearchCollapsibleInputItem(s['x-component']))[0]
      );
    }
  };
  return {
    fieldSchema,
    Designer,
    render,
    filterProperties,
  };
};
