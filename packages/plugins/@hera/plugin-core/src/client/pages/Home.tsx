import React from 'react';
import { useStyles } from './style';
import { Carousel, Image } from 'antd';
import { useAppSpin, useRequest } from '@tachybase/client';

export const HomePage: React.FC<{}> = () => {
  const { styles } = useStyles();
  const { render } = useAppSpin();
  const { data, loading } = useRequest<{ data: any }>({
    url: 'home_page_presentations:list',
    params: {
      'appends[]': 'pictures',
    },
  });
  if (loading) {
    return render();
  }
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className={styles.home}>
      <header>
        <div className="headerStyle">
          <span className="headerTitle">上海创兴建筑设备租赁有限公司</span>
          <ul>
            <li className="active">公司简介</li>
            <li>新闻中心</li>
            <li>产品展示</li>
            <li>工程案例</li>
            <li>联系我们</li>
          </ul>
        </div>
      </header>
      <main>
        <Carousel autoplay>
          {data.data.map((item) => (
            <div key={item.id}>
              <Image preview={false} src={item.pictures[0].url} />
            </div>
          ))}
        </Carousel>
      </main>
      <footer>
        <ul>
          <li>
            <a>公司简介</a>
          </li>
          <li>
            <a>真实合同</a>
          </li>
          <li>
            <a>企业文化</a>
          </li>
          <li>
            <a>联系我们</a>
          </li>
          <li>
            <a href="/admin">管理系统入口</a>
          </li>
        </ul>
        <div>
          <span>©2023-{year} 上海道有云网络科技有限公司 版权所有 沪ICP备2023024678号</span>
        </div>
      </footer>
    </div>
  );
};
