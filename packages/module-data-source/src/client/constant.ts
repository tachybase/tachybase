export const getConnectionCollectionPath = ({ key, type }: { key: string | number; type: string }) =>
  `/admin/settings/data-source-manager/${key}/collections?type=${type}`;
