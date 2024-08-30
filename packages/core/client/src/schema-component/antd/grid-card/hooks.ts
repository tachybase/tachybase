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

export const useGridCustomPageUrl = ({ field, fieldSchema }) => {
  const { linkCollection, fields, linkDataSource, link } =
    fieldSchema?.parent?.parent?.['x-decorator-props']?.['linkConfig'] || {};
  const { record } = field;
  let options = '?';
  fields.forEach((item, index) => {
    if (!record[item]) return;
    return (options += `${index === 0 ? '' : '&'}${item}=${record[item]}`);
  });
  return `${link}/${linkDataSource}/${linkCollection}${options}`;
};
