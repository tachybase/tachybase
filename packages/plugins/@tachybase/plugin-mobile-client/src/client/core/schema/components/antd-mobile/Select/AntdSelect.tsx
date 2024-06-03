import React, { useEffect, useState } from 'react';
import { observer, RecursionField, useField, useFieldSchema, useForm } from '@tachybase/schema';

import { Button, CheckList, Divider, Modal, PickerView, Popup, SearchBar, Space, Tag, Toast } from 'antd-mobile';

import { MInput } from '../Input';

import './style';

import {
  BlockItem,
  CollectionProvider_deprecated,
  useAPIClient,
  useCollectionManager,
  useDesignable,
  useRequest,
} from '@tachybase/client';
import { isArray } from '@tachybase/utils/client';

import { CreateRecordAction } from './CreateRecordAction';
import { useInsertSchema } from './hook/hooks';
import schema from './schema';
import { useStyles } from './style';

export const AntdSelect = observer((props) => {
  const { value, collectionName, service, fieldNames, addMode, onChange, multiple, mode } = props as any;
  const [popupVisible, setPopupVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { styles } = useStyles();
  const [options, setOptions] = useState([]);
  const fieldSchema = useFieldSchema();
  const cm = useCollectionManager();
  const [visibleValue, setVisibleValue] = useState({});
  const [filter, setFilter] = useState(service?.params?.filter);
  const api = useAPIClient();
  const field = useField();
  const { insertAfterBegin } = useDesignable();
  const insertAddNewer = useInsertSchema('AddNewer', fieldSchema, insertAfterBegin);
  const [selectValue, setSelectValue] = useState(value);
  const { data, run } = useRequest(
    {
      resource: collectionName,
      action: 'list',
      params: {
        filter,
      },
    },
    {
      manual: true,
    },
  );
  useEffect(() => {
    checkedPopup();
  }, [filter]);
  useEffect(() => {
    if (data) {
      const dataOption = data['data']?.map((value) => {
        return {
          ...value,
          label: value[fieldNames.label],
          value: value[fieldNames.value],
        };
      });
      setOptions(dataOption);
    }
  }, [data]);

  const checkedPopup = () => {
    if (collectionName) {
      run();
    } else {
      const field = cm.getCollectionField(fieldSchema['x-collection-field']);
      const data = field.uiSchema?.enum;
      setVisibleValue(data.find((item) => item.value === value) || '');
      setOptions(data);
    }
  };

  const addData = () => {
    api
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
        delete paramsFilter[fieldNames.label];
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
    data[fieldNames.label] = searchValue;
    addData();
  };
  const modalAdd = () => {
    const collectionField = cm.getCollectionField(fieldSchema['x-collection-field']);
    // console.log('🚀 ~ modalAdd ~ collectionField:', collectionField);
    const targetCollection = cm.getCollection(collectionField?.target);

    // insertAddNewer(schema.AddNewer);
    // const props = {
    //   fieldSchema,
    //   field,
    //   targetCollection,
    // };
    Modal.show({
      content: (
        <CollectionProvider_deprecated name={targetCollection?.name}>
          <RecursionField
            onlyRenderProperties
            basePath={field.address}
            schema={fieldSchema}
            filterProperties={(s) => {
              return s['x-component'] === 'AssociationField.AddNewer';
            }}
          />
        </CollectionProvider_deprecated>
      ),
      showCloseButton: true,
    });
  };
  return (
    <BlockItem>
      {!value || typeof value === 'object' ? (
        <div
          onClick={() => {
            setPopupVisible(true);
            checkedPopup();
          }}
          style={{ color: '#c5c5c5' }}
        >
          {isArray(value) && value.length ? (
            value.map((item, index) => (
              <Space key={index}>{`${item.label}${value.length - 1 === index ? '' : ','}`}</Space>
            ))
          ) : (
            <Space>{value?.label || '请选择内容'}</Space>
          )}
        </div>
      ) : (
        <Tag color={'default'}>{value?.['label']}</Tag>
      )}

      <Popup visible={popupVisible} className={`${styles['PopupStyle']}`} closeOnMaskClick>
        <SearchBar
          placeholder="请输入内容"
          value={searchValue}
          onChange={(value) => {
            const paramsFilter = { ...filter };
            paramsFilter[fieldNames.label] = { $includes: value };
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
          {/* {addMode === 'modalAdd' ? (
            <Button color="primary" fill="outline" onClick={modalAdd}>
              添加
            </Button>
          ) : null} */}
          <Button
            color="primary"
            onClick={() => {
              setPopupVisible(false);
            }}
          >
            取消
          </Button>
          <Button
            color="primary"
            onClick={() => {
              onChange(selectValue);
              setPopupVisible(false);
            }}
          >
            确定
          </Button>
        </Space>
      </Popup>
    </BlockItem>
  );
});
