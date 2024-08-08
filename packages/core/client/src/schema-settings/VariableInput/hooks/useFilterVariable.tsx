import { useMemo } from 'react';
import { Field, useField } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { useFormActiveFields } from '../../../block-provider';
import { useFilterContext } from '../../filter-form/context';

/**
 * 变量：`自定义筛选`
 * @param props
 * @returns
 */
export const useFilterVariable = (props: any = {}) => {
  const customFilter = useFilterContext();
  const field = useField<Field>();
  const { getActiveFieldsName } = useFormActiveFields();
  const activeFields = getActiveFieldsName('form');
  const fields = props?.form?.fields;
  const { t } = useTranslation();
  const settings = useMemo(() => {
    const customFields = [];

    for (const field in fields) {
      customFields.push({
        key: field,
        ...fields[field],
      });
    }
    const options = customFields
      .filter((value) => value?.props?.name.includes('custom.'))
      .map((custom) => {
        if (activeFields.includes(custom?.props?.name)) {
          const value = custom?.props?.name.replace(/^custom\./, '');
          return {
            key: custom?.props?.name,
            value,
            label: custom.title,
          };
        } else {
          return null;
        }
      })
      .filter(Boolean);
    return {
      label: t('Current filter'),
      value: '$nFilter',
      key: '$nFilter',
      children: options,
    };
  }, [fields]);

  return {
    /** 变量配置 */
    currentCustomFilterSetting: settings,
    /** 变量值 */
    currentCustonFilterCtx: field?.value,
    /** 用于判断是否需要显示配置项 */
    shouldDisplayCustomFilter: !!customFilter,
  };
};
