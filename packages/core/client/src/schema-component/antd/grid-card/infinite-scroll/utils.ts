import classNames from 'classnames';
import type { CSSProperties, ReactElement } from 'react';
import React, { AriaAttributes } from 'react';

const canUseDom = !!(
  typeof window !== 'undefined' &&
  typeof document !== 'undefined' &&
  window.document &&
  window.document.createElement
);

type ScrollElement = HTMLElement | Window;

const defaultRoot = canUseDom ? window : undefined;

const overflowStylePatterns = ['scroll', 'auto', 'overlay'];

function isElement(node: Element) {
  const ELEMENT_NODE_TYPE = 1;
  return node.nodeType === ELEMENT_NODE_TYPE;
}
export function getScrollParent(
  el: Element,
  root: ScrollElement | null | undefined = defaultRoot,
): Window | Element | null | undefined {
  let node = el;

  while (node && node !== root && isElement(node)) {
    if (node === document.body) {
      return root;
    }
    const { overflowY } = window.getComputedStyle(node);
    if (overflowStylePatterns.includes(overflowY) && node.scrollHeight > node.clientHeight) {
      return node;
    }
    node = node.parentNode as Element;
  }
  return root;
}

export function mergeProps<A, B>(a: A, b: B): B & A;
export function mergeProps<A, B, C>(a: A, b: B, c: C): C & B & A;
export function mergeProps(...items: any[]) {
  const ret: any = {};
  items.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (item[key] !== undefined) {
        ret[key] = item[key];
      }
    });
  });
  return ret;
}

export type NativeProps<S extends string = never> = {
  className?: string;
  style?: CSSProperties & Partial<Record<S, string>>;
  tabIndex?: number;
} & AriaAttributes;

export function withNativeProps<P extends NativeProps>(props: P, element: ReactElement) {
  const p = {
    ...element.props,
  };
  if (props.className) {
    p.className = classNames(element.props.className, props.className);
  }
  if (props.style) {
    p.style = {
      ...p.style,
      ...props.style,
    };
  }
  if (props.tabIndex !== undefined) {
    p.tabIndex = props.tabIndex;
  }
  for (const key in props) {
    // if (!props.hasOwnProperty(key)) continue;
    if (!Object.hasOwn(props, key)) continue;
    if (key.startsWith('data-') || key.startsWith('aria-')) {
      p[key] = props[key];
    }
  }
  return React.cloneElement(element, p);
}
