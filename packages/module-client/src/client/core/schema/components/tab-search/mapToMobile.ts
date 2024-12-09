const customComponent = {
  ['TabSearchCollapsibleInputItem']: 'TabSearchCollapsibleInputMItem',
  ['useTabSearchFieldItemProps']: 'useTabSearchFieldItemRelatedProps',
  ['TabSearchFieldItem']: 'TabSearchFieldMItem',
};

export function mapToMobile(componentName: string) {
  return customComponent[componentName];
}
