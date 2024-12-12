// FIXME /admin
export const getConnectionCollectionPath = ({ key, type }: { key: string | number; type: string }) =>
  `/_admin/data-modeling/data-source/${key}?type=${type}`;
