import { useEffect, useMemo, useState } from 'react';
import { observer, useFieldSchema } from '@tachybase/schema';

import { Button, CheckList, Divider, PickerView, Popup, SearchBar, Space, Toast } from 'antd-mobile';

import './style';

import {
  BlockItem,
  CollectionProvider,
  MobileProvider,
  SchemaComponent,
  useAPIClient,
  useCollection,
  useCollectionManager,
  useFieldServiceFilter,
  useRequest,
} from '@tachybase/client';
import { isArray } from '@tachybase/utils/client';

import { lang } from '../../../../../locale';
import { MInput } from '../Input';
import { CreateRecordAction } from './CreateRecordAction';
import { useStyles } from './style';

export const AntdSelect = observer((props) => {
  const { value, collectionName, service, fieldNames, addMode, onChange, multiple, mode } = props as any;
  const [popupVisible, setPopupVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { styles } = useStyles();
  const [options, setOptions] = useState([]);
  const fieldSchema = useFieldSchema();
  const cm = useCollectionManager();
  const collection = useCollection();
  const [fieldServiceFilter] = useFieldServiceFilter(service?.params);
  const [filter, setFilter] = useState({});
  const api = useAPIClient();
  const [selectValue, setSelectValue] = useState(value);
  const fieldNamesLabel = fieldNames?.label || 'label';
  const fieldNamesValue = fieldNames?.value || 'value';

  const inputValue = useMemo(() => {
    if (isArray(value)) {
      return value.map((item) => item[fieldNamesLabel]).join(', ');
    } else if (value && typeof value === 'object') {
      return value[fieldNamesLabel];
    }
    return '';
  }, [value, fieldNamesLabel]);

  const { run } = useRequest(
    {
      resource: collectionName,
      action: 'list',
      params: {
        filter: { ...fieldServiceFilter?.filter, ...filter },
      },
    },
    {
      manual: true,
      onSuccess(data) {
        if (data) {
          const dataOption = data['data']?.map((value) => {
            return {
              ...value,
              label: value[fieldNamesLabel],
              value: value[fieldNamesValue],
            };
          });
          setOptions(dataOption);
        }
      },
    },
  );

  const checkedPopup = () => {
    if (collectionName) {
      run();
    } else if (fieldSchema['x-collection-field']) {
      const field = cm.getCollectionField(fieldSchema['x-collection-field']);
      const data = field.uiSchema?.enum;
      setOptions(data);
    } else {
      setOptions(fieldSchema.enum);
    }
  };

  const quickAdd = async () => {
    const resData = await api.request({
      url: collectionName + ':create',
      method: 'post',
      data: {
        [fieldNamesLabel]: searchValue,
      },
    });

    if (resData.status === 200) {
      Toast.show({
        icon: 'success',
        content: '添加成功',
      });
    } else {
      Toast.show({
        icon: 'fail',
        content: '失败成功',
      });
    }

    const paramsFilter = { ...filter };
    delete paramsFilter[fieldNamesLabel];

    setFilter(paramsFilter);
    setSearchValue('');
    setPopupVisible(false);
  };

  useEffect(() => {
    checkedPopup();
  }, [filter, popupVisible]);

  return (
    <CollectionProvider name={collectionName || collection?.name}>
      <BlockItem>
        <div
          onClick={() => {
            if (fieldSchema['x-disabled']) return;
            setPopupVisible(true);
            checkedPopup();
          }}
          style={{ color: '#c5c5c5' }}
        >
          {value?.length || (value && !isArray(value)) ? (
            <MInput style={{ '--color': '#1e8bf1' }} value={inputValue} disabled={fieldSchema['x-disabled']} />
          ) : (
            <Space>{fieldSchema['x-disabled'] ? '' : '请选择内容'}</Space>
          )}
        </div>
        <Popup
          visible={popupVisible}
          className={`${styles['PopupStyle']}`}
          onMaskClick={() => {
            setPopupVisible(false);
          }}
        >
          <MobileProvider>
            <SearchBar
              placeholder={lang('Please enter search content')}
              value={searchValue}
              onChange={(value) => {
                const paramsFilter = { ...filter };
                paramsFilter[fieldNamesLabel] = { $includes: value };
                setFilter(paramsFilter);
                setSearchValue(value);
              }}
            />
            {searchValue && addMode === 'quickAdd' ? (
              <Space justify="center" align="center" onClick={quickAdd}>
                + 创建{searchValue}
              </Space>
            ) : null}
            <Divider />
            {multiple || mode === 'multiple' ? (
              <CheckList
                multiple
                className={`${styles['checkListStyle']}`}
                onChange={(value) => {
                  if (!value.length) {
                    setSelectValue(null);
                    return;
                  }
                  const filterValue = options.filter((item) => value.includes(item.value));
                  setSelectValue(filterValue);
                }}
              >
                {options.map((item, index) => {
                  return (
                    <CheckList.Item key={index} value={item.value}>
                      {item.label}
                    </CheckList.Item>
                  );
                })}
              </CheckList>
            ) : (
              <PickerView
                columns={[options]}
                onChange={(value) => {
                  const changeValue = options.find((item) => item['value'] === value[0]);
                  setSelectValue(changeValue);
                }}
              />
            )}

            <Space justify="evenly" align="center">
              {addMode === 'modalAdd' ? (
                <SchemaComponent
                  components={{ CreateRecordAction }}
                  schema={{
                    type: 'void',
                    name: 'CreateRecord',
                    'x-component': 'CreateRecordAction',
                    'x-component-props': { fieldSchema },
                  }}
                />
              ) : null}
              <Button
                color="primary"
                onClick={() => {
                  setPopupVisible(false);
                  const paramsFilter = { ...filter };
                  if (paramsFilter[fieldNamesLabel]) delete paramsFilter[fieldNamesLabel];
                  setSearchValue('');
                  setFilter(paramsFilter);
                }}
              >
                {lang('Cancel')}
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  onChange(selectValue);
                  setPopupVisible(false);
                  const paramsFilter = { ...filter };
                  if (paramsFilter[fieldNamesLabel]) delete paramsFilter[fieldNamesLabel];
                  setSearchValue('');
                  setFilter(paramsFilter);
                }}
              >
                {lang('Confirm')}
              </Button>
            </Space>
          </MobileProvider>
        </Popup>
      </BlockItem>
    </CollectionProvider>
  );
});
