import { useTableBlockContext } from '@tachybase/client';

import { useStyles } from './ApplyList.style';
import { FeatureCard } from './FeatureCard';

/**
 * DOC:
 * 区块初始化组件: 审批: 发起申请(新)
 */
export const ApplyList = () => {
  const { styles } = useStyles();
  const { service } = useTableBlockContext();
  const { loading, data } = service;
  const dataSources = data?.data ?? [];

  if (loading) {
    return null;
  }

  return (
    <div className={styles.featureList}>
      {dataSources.map((item, index) => (
        <FeatureCard key={index} data={item} />
      ))}
    </div>
  );
};
