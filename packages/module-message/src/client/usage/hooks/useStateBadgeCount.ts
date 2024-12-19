import { useEffect, useMemo, useState } from 'react';
import { useAPIClient, useCurrentUserContext, useNoticeSub } from '@tachybase/client';

import _ from 'lodash';

import { COLLECTION_NAME_MESSAGES } from '../../../common/collections/messages';
import { MESSAGES_UPDATE_BADGE_COUNT } from '../../../common/constants';

// 通知计数器
export function useStateBadgeCount(initialCount: number = 0) {
  const apiClient = useAPIClient();
  const ctxUser = useCurrentUserContext();
  const currentUser = ctxUser?.data?.data;

  const [badgeCount, setBadgeCount] = useState(initialCount);

  const fetchAndSetBadgeCount = async () => {
    const res = await apiClient.request({
      resource: COLLECTION_NAME_MESSAGES,
      action: 'count',
      params: {
        filter: {
          read: false,
          userId: currentUser?.id,
        },
      },
    });

    const count = res?.data?.data ?? 0;
    setBadgeCount(count);
  };

  const debouncedFetch = useMemo(() => _.debounce(fetchAndSetBadgeCount, 300), [fetchAndSetBadgeCount]);

  // 订阅消息数量变更通知
  useNoticeSub(MESSAGES_UPDATE_BADGE_COUNT, () => {
    debouncedFetch();
  });

  // 初始化获取消息数量
  useEffect(() => {
    fetchAndSetBadgeCount();
  }, []);

  return {
    badgeCount,
  };
}
