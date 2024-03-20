import { useSchemaInitializer } from '@nocobase/client';

export const useFilterFormCustomProps = () => {
  const { insert } = useSchemaInitializer();
  return {
    title: 'Custom',
    onClick: () => {
      insert({
        type: 'void',
        'x-decorator': 'CardItem',
        'x-component': 'h1',
        'x-content': 'Custom block',
      });
    },
  };
};
