import { SpaceProps } from 'antd';

const spaceProps: SpaceProps = {
  size: ['large', 'small'],
  wrap: true,
};

export const useGridCardActionBarProps = () => {
  return {
    spaceProps,
  };
};

export const useGridCardDetailUrl = ({ collection, field, fieldSchema }) => {
  const name = 'detail';
  const { datasource = 'main', name: collectionName } = collection;
  const { record } = field;
  const primaryKey = 'id';
  const primaryKeyValue = record[primaryKey];

  return `/mobile/${name}/${datasource}/${collectionName}/${primaryKeyValue}`;
};
