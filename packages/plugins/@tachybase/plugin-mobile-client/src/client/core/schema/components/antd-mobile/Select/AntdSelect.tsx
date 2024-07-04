import React, { useEffect, useState } from 'react';
import { observer, RecursionField, Schema, useField, useFieldSchema, useForm } from '@tachybase/schema';

import { Button, CheckList, Divider, Modal, PickerView, Popup, SearchBar, Space, Tag, Toast } from 'antd-mobile';

import './style';

import {
  BlockItem,
  CollectionProvider,
  SchemaComponent,
  useAPIClient,
  useCollection,
  useCollectionField,
  useCollectionManager,
  useDesignable,
  useFieldServiceFilter,
  useRequest,
} from '@tachybase/client';
import { isArray } from '@tachybase/utils/client';

import { getMobileColor } from '../../../CustomColor';
import { MobileProvider } from '../../../provider';
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
  let inputValue = '';
  if (isArray(value)) {
    value.forEach((item, index) => {
      inputValue += `${item[fieldNamesLabel]}${value.length - 1 === index ? '' : ', '}`;
    });
  } else if (value && typeof value === 'object') {
    inputValue = value[fieldNamesLabel];
  }

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
  useEffect(() => {
    checkedPopup();
  }, [filter, popupVisible]);

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

  const addData = (data) => {
    data[fieldNamesLabel] = api
      .request({
        url: collectionName + ':create',
        method: 'post',
        data,
      })
      .then((res) => {
        if (res.status === 200) {
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
      })
      .catch(() => {
        console.error;
      });
  };
  const quickAdd = () => {
    const data = {};
    data[fieldNamesLabel] = searchValue;
    addData(data);
  };
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
              placeholder="请输入内容"
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
                取消
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
                确定
              </Button>
            </Space>
          </MobileProvider>
        </Popup>
      </BlockItem>
    </CollectionProvider>
  );
});
