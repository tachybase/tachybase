import { JumboTabs, Image } from 'antd-mobile';
import React from 'react';

const images = [
  {
    label: '全部商品',
    imageUrl: 'https://courier.dzkbdd.cn/static/jx-h5/assets/operator_all_select-884b60ce.png',
  },
  {
    label: '中国电信',
    imageUrl: 'https://courier.dzkbdd.cn/static/jx-h5/assets/operator_dx-7df8411f.png',
  },
  {
    label: '中国移动',
    imageUrl: 'https://courier.dzkbdd.cn/static/jx-h5/assets/operator_yd-7b994595.png',
  },
  {
    label: '中国联通',
    imageUrl: 'https://courier.dzkbdd.cn/static/jx-h5/assets/operator_lt-d9888233.png',
  },
  {
    label: '中国广电',
    imageUrl: 'https://courier.dzkbdd.cn/static/jx-h5/assets/operator_gd-cc48f3e6.png',
  },
];

export const ImageSearch = () => {
  return (
    <JumboTabs>
      {images.map(({ label, imageUrl }) => (
        <JumboTabs.Tab key={label} title={label} description={<ImageDescription srcUrl={imageUrl} />}>
          {label}
          {
            // TODO: 填充数据的区域
          }
        </JumboTabs.Tab>
      ))}
    </JumboTabs>
  );
};

const ImageDescription = (props) => {
  const { srcUrl } = props;
  return <Image src={srcUrl} width={100} height={100} fit="fill" />;
};
