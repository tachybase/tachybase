import React, { FC, useContext, useEffect, useMemo, useRef } from 'react';
import { useField, useFieldSchema, useForm } from '@tachybase/schema';

import { DragOutlined, PlusOutlined } from '@ant-design/icons';

import {
  SchemaComponentsContext,
  SchemaExpressionScopeContext,
  SchemaMarkupContext,
} from '../../../../../../schema/src/react';
import { useSchemaInitializerRender, useSchemaSettingsRender } from '../../../../application';
import { useFormBlockContext } from '../../../../block-provider';
import { useDataSource, useDataSourceManager } from '../../../../data-source';
import {
  DragHandler,
  SortableContext,
  Space,
  useCompile,
  useDesignable,
  useGridContext,
  useGridRowContext,
  useSchemaComponentContext,
  useSchemaOptionsContext,
} from '../../../../schema-component';
import { gridRowColWrap } from '../../../../schema-initializer';
import { SchemaToolbarProps, useGetAriaLabelOfDesigner } from '../../../../schema-settings';
import { useStyles } from '../../../../schema-settings/styles';
import { useEditableSelectedField } from './EditableSelectedFieldContext';

export const EditableFormItemSchemaToolbar = (props) => {
  return <EditableSchemaToolbar showBorder={false} showBackground {...props} />;
};

export const EditableSchemaToolbar: FC<SchemaToolbarProps> = (props) => {
  const { designable } = useDesignable();

  if (!designable) {
    return null;
  }

  return <EditableInternalSchemaToolbar {...props} />;
};

const EditableInternalSchemaToolbar: FC<SchemaToolbarProps> = (props) => {
  const { title, initializer, settings, showBackground, showBorder = true } = props;
  const { designable } = useDesignable();
  const fieldSchema = useFieldSchema();
  const form = useForm();
  const schemaMarkup = useContext(SchemaMarkupContext);
  const expressionScope = useContext(SchemaExpressionScopeContext);
  const schemaComponents = useContext(SchemaComponentsContext);
  const formBlockValue = useFormBlockContext();
  const schemaOptions = useSchemaOptionsContext();
  const field = useField();
  const compile = useCompile();
  const { styles } = useStyles();
  const { getAriaLabel } = useGetAriaLabelOfDesigner();
  const { setEditableField } = useEditableSelectedField();
  const dm = useDataSourceManager();
  const dataSources = dm?.getDataSources();
  const dataSourceContext = useDataSource();
  const { draggable } = useContext(SortableContext);
  const dataSource = dataSources?.length > 1 && dataSourceContext;
  const titleArr = useMemo(() => {
    if (!title) return undefined;
    if (typeof title === 'string') return [compile(title)];
    if (Array.isArray(title)) return title.map((item) => compile(item));
  }, [compile, title]);
  const { render: schemaSettingsRender, exists: schemaSettingsExists } = useSchemaSettingsRender(
    fieldSchema['x-settings'] || settings,
    fieldSchema['x-settings-props'],
  );
  const { render: schemaInitializerRender, exists: schemaInitializerExists } = useSchemaInitializerRender(
    fieldSchema['x-initializer'] || initializer,
    fieldSchema['x-initializer-props'],
  );
  const rowCtx = useGridRowContext();
  const gridContext = useGridContext();

  const initializerProps: any = useMemo(() => {
    return {
      insertPosition: 'afterEnd',
      wrap: rowCtx?.cols?.length > 1 ? undefined : gridRowColWrap,
      Component: (props: any) => (
        <PlusOutlined
          {...props}
          role="button"
          aria-label={getAriaLabel('schema-initializer')}
          style={{ cursor: 'pointer', fontSize: 14 }}
        />
      ),
    };
  }, [getAriaLabel, rowCtx?.cols?.length]);

  const dragElement = useMemo(() => {
    if (draggable === false) return null;
    return (
      <DragHandler>
        <DragOutlined role="button" aria-label={getAriaLabel('drag-handler')} />
      </DragHandler>
    );
  }, [draggable, getAriaLabel]);

  const initializerElement = useMemo(() => {
    if (initializer === false) return null;
    if (gridContext?.InitializerComponent || gridContext?.renderSchemaInitializer) {
      return gridContext?.InitializerComponent ? (
        <gridContext.InitializerComponent {...initializerProps} />
      ) : (
        gridContext.renderSchemaInitializer?.(initializerProps)
      );
    }
    if (!schemaInitializerExists) return null;
    return schemaInitializerRender(initializerProps);
  }, [gridContext, initializer, initializerProps, schemaInitializerExists, schemaInitializerRender]);

  const settingsElement = useMemo(() => {
    return settings !== false && schemaSettingsExists ? schemaSettingsRender() : null;
  }, [schemaSettingsExists, schemaSettingsRender, settings]);

  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toolbarElement = toolbarRef.current;
    const parentElement = toolbarElement?.parentElement;
    function show() {
      if (toolbarElement) {
        toolbarElement.style.display = 'block';
      }
    }

    function hide() {
      if (toolbarElement) {
        toolbarElement.style.display = 'none';
      }
    }

    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement;
      const isInsideToolbar = toolbarElement?.contains(target);
      if (!isInsideToolbar) {
        // const uid = fieldSchema?.['x-uid'] || null;
        setEditableField({
          field,
          fieldSchema,
          schemaMarkup,
          expressionScope,
          schemaComponents,
          schemaOptions,
          form,
          formBlockValue,
        });
      }
    }

    if (parentElement) {
      const style = window.getComputedStyle(parentElement);
      if (style.position === 'static') {
        parentElement.style.position = 'relative';
      }

      parentElement.addEventListener('mouseenter', show);
      parentElement.addEventListener('mouseleave', hide);
      parentElement.addEventListener('click', handleClick);
    }

    return () => {
      if (parentElement) {
        parentElement.removeEventListener('mouseenter', show);
        parentElement.removeEventListener('mouseleave', hide);
        parentElement.removeEventListener('click', handleClick);
      }
    };
  }, []);

  if (!designable) {
    return null;
  }

  return (
    <div
      ref={toolbarRef}
      className={styles.toolbar}
      style={{ border: showBorder ? 'auto' : 0, background: showBackground ? 'auto' : 0 }}
    >
      {/* {titleArr && (
        <div className={styles.toolbarTitle}>
          <Space size={2}>
            {titleArr.map((item) => (
              <span key={item} className={styles.toolbarTitleTag}>
                {dataSource ? `${compile(dataSource?.displayName)} > ${item}` : item}
              </span>
            ))}
          </Space>
        </div>
      )}
      <div className={styles.toolbarIcons}>
        <Space size={3} align={'center'}>
          {dragElement}
          {initializerElement}
          {settingsElement}
        </Space>
      </div> */}
      <div className={styles.toolbarIcons}>
        <Space size={3} align={'center'}>
          {dragElement}
          {/* {initializerElement}
          {settingsElement} */}
        </Space>
      </div>
    </div>
  );
};
