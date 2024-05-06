import React from 'react';
import { Icon } from '@nocobase/client';

import NoticeSvg from './notice.svg';
import SwiperSvg from './swiper.svg';
import TabSearchSvg from './tab-search.svg';

let convert = (encoded: string) => decodeURI(encoded).replace('data:image/svg+xml,', '');
if (process.env.NODE_ENV !== 'production') {
  convert = (encoded: string) => atob(encoded.replace('data:image/svg+xml;base64,', ''));
}

export const loadBase64Icon = (encoded: string) => () => <div dangerouslySetInnerHTML={{ __html: convert(encoded) }} />;

export const NoticeIcon = (props: any) => <Icon component={loadBase64Icon(NoticeSvg)} {...props} />;
export const SwiperIcon = (props: any) => <Icon component={loadBase64Icon(SwiperSvg)} {...props} />;
export const TabSearchIcon = (props: any) => <Icon component={loadBase64Icon(TabSearchSvg)} {...props} />;

Icon.register({
  'notice-block': NoticeIcon,
  'swiper-block': SwiperIcon,
  'tab-search': TabSearchIcon,
});
