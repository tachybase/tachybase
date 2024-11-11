import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { getScrollParent, merge } from '@tachybase/utils/client';

import { useLockFn, useThrottleFn } from 'ahooks';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';

import useStyles from './style';

function isWindow(element: any | Window): element is Window {
  return element === window;
}

export type InfiniteScrollProps = {
  loadMore: (isRetry: boolean) => Promise<void>;
  hasMore: boolean;
  threshold?: number;
  children?: ReactNode | ((hasMore: boolean, failed: boolean, retry: () => void) => ReactNode);
};

const defaultProps: Required<Pick<InfiniteScrollProps, 'threshold' | 'children'>> = {
  threshold: 250,
  children: (hasMore: boolean, failed: boolean, retry: () => void) => (
    <InfiniteScrollContent hasMore={hasMore} failed={failed} retry={retry} />
  ),
};

export const InfiniteScroll = ({
  threshold = defaultProps.threshold,
  loadMore,
  children = defaultProps.children,
  hasMore,
}: InfiniteScrollProps) => {
  const { styles } = useStyles();
  const [failed, setFailed] = useState(false);
  const doLoadMore = useLockFn(async (isRetry: boolean) => {
    try {
      await loadMore(isRetry);
    } catch (e) {
      setFailed(true);
      throw e;
    }
  });

  const elementRef = useRef<HTMLDivElement>(null);

  // Prevent duplicated trigger of `check` function
  const [flag, setFlag] = useState({});
  const nextFlagRef = useRef(flag);

  const [scrollParent, setScrollParent] = useState<Window | Element | null | undefined>();

  const { run: check } = useThrottleFn(
    async () => {
      if (nextFlagRef.current !== flag) return;
      if (!hasMore) return;
      const element = elementRef.current;
      if (!element) return;
      if (!element.offsetParent) return;
      const parent = getScrollParent(element);
      setScrollParent(parent);
      if (!parent) return;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const current = isWindow(parent) ? window.innerHeight : parent.getBoundingClientRect().bottom;
      if (current >= elementTop - threshold) {
        const nextFlag = {};
        nextFlagRef.current = nextFlag;
        try {
          await doLoadMore(false);
          setFlag(nextFlag);
        } catch (e) {
          console.error(e);
        }
      }
    },
    {
      wait: 100,
      leading: true,
      trailing: true,
    },
  );

  // Make sure to trigger `loadMore` when content changes
  useEffect(() => {
    check();
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    if (!scrollParent) return;
    function onScroll() {
      check();
    }
    scrollParent.addEventListener('scroll', onScroll);
    return () => {
      scrollParent.removeEventListener('scroll', onScroll);
    };
  }, [scrollParent]);

  async function retry() {
    setFailed(false);
    try {
      await doLoadMore(true);
      setFlag(nextFlagRef.current);
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className={styles.infiniteScroll} ref={elementRef}>
      {typeof children === 'function' ? children(hasMore, failed, retry) : children}
    </div>
  );
};

const InfiniteScrollContent = (props: { hasMore: boolean; failed: boolean; retry: () => void }) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  if (!props.hasMore) {
    return <span>{t('no more')}</span>;
  }

  if (props.failed) {
    return (
      <span>
        <span className={`${styles.infiniteScroll}-failed-text`}>{t('failed to load')}</span>
        <a
          onClick={() => {
            props.retry();
          }}
        >
          {t('retry')}
        </a>
      </span>
    );
  }

  return (
    <>
      <span>{t('loading')}</span>
      <Spin />
    </>
  );
};
