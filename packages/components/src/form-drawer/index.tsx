import React, { Fragment, useLayoutEffect, useRef, useState } from 'react';
import {
  applyMiddleware,
  createForm,
  Form,
  FormProvider,
  IFormProps,
  IMiddleware,
  isBool,
  isFn,
  isNum,
  isStr,
  observer,
  onFormSubmitSuccess,
  ReactFC,
  toJS,
} from '@tachybase/schema';

import { Drawer, DrawerProps } from 'antd';
import { createPortal } from 'react-dom';

import { createPortalProvider, createPortalRoot, loading, usePrefixCls } from '../__builtins__';

type FormDrawerRenderer = React.ReactElement | ((form: Form) => React.ReactElement);

type DrawerTitle = string | number | React.ReactElement;

type EventType = React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement | HTMLButtonElement>;

const isDrawerTitle = (props: any): props is DrawerTitle => {
  return isNum(props) || isStr(props) || isBool(props) || React.isValidElement(props);
};

const getDrawerProps = (props: any): IDrawerProps => {
  if (isDrawerTitle(props)) {
    return {
      title: props,
    };
  } else {
    return props;
  }
};

export interface IFormDrawer {
  forOpen(middleware: IMiddleware<IFormProps>): IFormDrawer;
  open(props?: IFormProps): Promise<any>;
  close(): void;
}

export interface IDrawerProps extends DrawerProps {
  onClose?: (e: EventType) => void | boolean;
  loadingText?: React.ReactNode;
}
interface IEnv {
  form: Form | null;
  host: HTMLDivElement;
  promise: Promise<any> | null;
  openMiddlewares: IMiddleware<IFormProps>[];
}

export function FormDrawer(title: IDrawerProps, id: string, renderer: FormDrawerRenderer): IFormDrawer;
export function FormDrawer(title: IDrawerProps, id: FormDrawerRenderer): IFormDrawer;
export function FormDrawer(title: DrawerTitle, id: string, renderer: FormDrawerRenderer): IFormDrawer;
export function FormDrawer(title: DrawerTitle, id: FormDrawerRenderer): IFormDrawer;
export function FormDrawer(title: any, id: any, renderer?: any): IFormDrawer {
  if (isFn(id) || React.isValidElement(id)) {
    renderer = id;
    id = 'form-drawer';
  }
  const env: IEnv = {
    host: document.createElement('div'),
    openMiddlewares: [],
    form: null,
    promise: null,
  };
  const root = createPortalRoot(env.host, id);
  const props = getDrawerProps(title);
  const drawer = {
    width: '40%',
    ...props,
    onClose: (e: any) => {
      if (props?.onClose?.(e) !== false) {
        formDrawer.close();
      }
    },
    afterOpenChange: (open: boolean) => {
      props?.afterOpenChange?.(open);
      if (open) return;
      root.unmount();
    },
  };
  const DrawerContent = observer(() => {
    return <Fragment>{isFn(renderer) ? renderer(env.form) : renderer}</Fragment>;
  });
  const renderDrawer = (open = true) => {
    const { form } = env;
    if (!form) return null;
    return (
      <Drawer {...drawer} open={open}>
        <FormProvider form={form}>
          <DrawerContent />
        </FormProvider>
      </Drawer>
    );
  };

  document.body.appendChild(env.host);
  const formDrawer = {
    forOpen: (middleware: IMiddleware<IFormProps>) => {
      if (isFn(middleware)) {
        env.openMiddlewares.push(middleware);
      }
      return formDrawer;
    },
    open: (props: IFormProps) => {
      if (env.promise) return env.promise;
      env.promise = new Promise((resolve, reject) => {
        const run = async () => {
          try {
            props = await loading(drawer.loadingText, () => applyMiddleware(props, env.openMiddlewares));
            env.form =
              env.form ||
              createForm({
                ...props,
                effects(form) {
                  onFormSubmitSuccess(() => {
                    resolve(toJS(form.values));
                    formDrawer.close();
                  });
                  props?.effects?.(form);
                },
              });
          } catch (e) {
            reject(e);
          }
        };
        run();
        root.render(() => renderDrawer(false));
        setTimeout(() => {
          root.render(() => renderDrawer(true));
        }, 16);
      });
      return env.promise;
    },
    close: () => {
      if (!env.host) return;
      root.render(() => renderDrawer(false));
    },
  };
  return formDrawer;
}

const DrawerExtra: ReactFC = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [extra, setExtra] = useState<HTMLDivElement>();
  const extraRef = useRef<HTMLDivElement>();
  const prefixCls = usePrefixCls('drawer');
  useLayoutEffect(() => {
    const content = ref.current?.closest(`.${prefixCls}-content`)?.querySelector(`.${prefixCls}-header`);
    if (content) {
      if (!extraRef.current) {
        extraRef.current = content.querySelector(`.${prefixCls}-extra`) as HTMLDivElement;
        if (!extraRef.current) {
          extraRef.current = document.createElement('div');
          extraRef.current.classList.add(`${prefixCls}-extra`);
          content.appendChild(extraRef.current);
        }
      }
      setExtra(extraRef.current);
    }
  });

  extraRef.current = extra;

  return (
    <div ref={ref} style={{ display: 'none' }}>
      {extra && createPortal(props.children, extra)}
    </div>
  );
};

const DrawerFooter: ReactFC = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [footer, setFooter] = useState<HTMLDivElement>();
  const footerRef = useRef<HTMLDivElement>();
  const prefixCls = usePrefixCls('drawer');
  useLayoutEffect(() => {
    const content = ref.current?.closest(`.${prefixCls}-content`);
    if (content) {
      if (!footerRef.current) {
        footerRef.current = content.querySelector(`.${prefixCls}-footer`) as HTMLDivElement;
        if (!footerRef.current) {
          footerRef.current = document.createElement('div');
          footerRef.current.classList.add(`${prefixCls}-footer`);
          content.appendChild(footerRef.current);
        }
      }
      setFooter(footerRef.current);
    }
  });

  footerRef.current = footer;

  return (
    <div ref={ref} style={{ display: 'none' }}>
      {footer && createPortal(props.children, footer)}
    </div>
  );
};

FormDrawer.Extra = DrawerExtra;

FormDrawer.Footer = DrawerFooter;

FormDrawer.Portal = createPortalProvider('form-drawer');

export default FormDrawer;
