import { PageStyle } from './PageStyle.provider';
import { TabHeader } from './TabHeader';
import { usePageStyle } from './usePageStyle';

export const CustomAdminHeader = () => {
  const pageStyle = usePageStyle();

  return pageStyle === PageStyle.PAGE_TAB ? <TabHeader /> : null;
};
