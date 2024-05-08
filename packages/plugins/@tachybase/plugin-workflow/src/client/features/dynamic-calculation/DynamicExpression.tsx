import { onFieldInputValueChange, onFormInitialValuesChange } from '@tachybase/schema';
import { connect, mapReadPretty, observer, useField, useForm, useFormEffects } from '@tachybase/schema';
import { Tag } from 'antd';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useCollectionManager_deprecated, useCompile, useRecord, Variable } from '@tachybase/client';
import { getCollectionFieldOptions } from '../..';

import { NAMESPACE } from '../../locale';

const InternalExpression = observer(
  (props: any) => {
    const { onChange } = props;
    const field = useField<any>();
    // TODO(refactor): better to provide another context like useFieldset()
    const form = useForm();
    const basePath = field.path.segments.slice(0, -1);
    const collectionPath = [...basePath, 'sourceCollection'].join('.');
    const [collection, setCollection] = useState(form.getValuesIn(collectionPath));
    const compile = useCompile();
    const { getCollectionFields } = useCollectionManager_deprecated();

    useFormEffects(() => {
      onFormInitialValuesChange((form) => {
        setCollection(form.getValuesIn(collectionPath));
      });
      onFieldInputValueChange(collectionPath, (f) => {
        setCollection(f.value);
        onChange(null);
      });
    });

    const options = getCollectionFieldOptions({ collection, compile, getCollectionFields });

    return <Variable.TextArea {...props} scope={options} />;
  },
  { displayName: 'InternalExpression' },
);

function Result(props) {
  const { t } = useTranslation();
  const values = useRecord();
  const compile = useCompile();
  const { getCollectionFields } = useCollectionManager_deprecated();
  const options = useMemo(
    () => getCollectionFieldOptions({ collection: values.sourceCollection, compile, getCollectionFields }),
    [values.sourceCollection, values.sourceCollection],
  );
  return props.value ? (
    <Variable.TextArea {...props} scope={options} />
  ) : (
    <Tag>{t('Unconfigured', { ns: NAMESPACE })}</Tag>
  );
}

export const DynamicExpression = connect(InternalExpression, mapReadPretty(Result));
