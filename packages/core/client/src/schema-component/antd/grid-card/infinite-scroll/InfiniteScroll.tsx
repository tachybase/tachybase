import { useLockFn, useThrottleFn } from 'ahooks';
import type { FC, ReactNode } from 'react';
import React, { useEffect, useRef, useState } from 'react';
// import { useConfig } from '../config-provider';
// import DotLoading from '../dot-loading';
import { NativeProps, getScrollParent, mergeProps, withNativeProps } from './utils';

// TODO: 待继续
const useConfig = () => {
  return {
    locale: {
      InfiniteScroll: {
        retry: false,
        noMore: false,
        failedToLoad: '范德萨发',
      },
      common: {
        loading: false,
      },
    },
  };
};

// TODO: 待继续
const DotLoading = () => null;

function isWindow(element: any | Window): element is Window {
  return element === window;
}

const classPrefix = `adm-infinite-scroll`;

export type InfiniteScrollProps = {
  loadMore: (isRetry: boolean) => Promise<void>;
  hasMore: boolean;
  threshold?: number;
  children?: ReactNode | ((hasMore: boolean, failed: boolean, retry: () => void) => ReactNode);
} & NativeProps;

const defaultProps: Required<Pick<InfiniteScrollProps, 'threshold' | 'children'>> = {
  threshold: 250,
  children: (hasMore: boolean, failed: boolean, retry: () => void) => (
    <InfiniteScrollContent hasMore={hasMore} failed={failed} retry={retry} />
  ),
};

export const InfiniteScroll: FC<InfiniteScrollProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  const [failed, setFailed] = useState(false);
  const doLoadMore = useLockFn(async (isRetry: boolean) => {
    try {
      await props.loadMore(isRetry);
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
      if (!props.hasMore) return;
      const element = elementRef.current;
      if (!element) return;
      if (!element.offsetParent) return;
      const parent = getScrollParent(element);
      setScrollParent(parent);
      if (!parent) return;
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top;
      const current = isWindow(parent) ? window.innerHeight : parent.getBoundingClientRect().bottom;
      if (current >= elementTop - props.threshold) {
        const nextFlag = {};
        nextFlagRef.current = nextFlag;
        try {
          await doLoadMore(false);
          setFlag(nextFlag);
        } catch (e) {
          console.log('%c Line:88 🍯 e', 'font-size:18px;color:#2eafb0;background:#3f7cff', e);
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
      console.log('%c Line:121 🥥 e', 'font-size:18px;color:#3f7cff;background:#2eafb0', e);
    }
  }

  return withNativeProps(
    props,
    <div className={classPrefix} ref={elementRef}>
      {typeof props.children === 'function' ? props.children(props.hasMore, failed, retry) : props.children}
    </div>,
  );
};

const InfiniteScrollContent: FC<{
  hasMore: boolean;
  failed: boolean;
  retry: () => void;
}> = (props) => {
  const { locale } = useConfig();

  if (!props.hasMore) {
    return <span>{locale.InfiniteScroll.noMore}</span>;
  }

  if (props.failed) {
    return (
      <span>
        <span className={`${classPrefix}-failed-text`}>{locale.InfiniteScroll.failedToLoad}</span>
        <a
          onClick={() => {
            props.retry();
          }}
        >
          {locale.InfiniteScroll.retry}
        </a>
      </span>
    );
  }

  return (
    <>
      <span>{locale.common.loading}</span>
      <DotLoading />
    </>
  );
};

const keepComp = (props) => {
  return <InfiniteScroll {...props} />;
};

keepComp({});
