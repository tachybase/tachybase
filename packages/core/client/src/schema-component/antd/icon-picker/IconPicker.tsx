import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { useFormLayout } from '@formily/antd-v5';
import { connect, mapProps, mapReadPretty } from '@nocobase/schema';
import { isValid } from '@nocobase/schema';
import { Button, Space } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, hasIcon } from '../../../icon';
import { StablePopover } from '../popover';
import { IconFilterInput } from './IconFilterInput';
import { IconFilterList } from './IconList';

function IconField(props: any) {
  const { value, onChange, disabled } = props;
  const { t } = useTranslation();
  const layout = useFormLayout();
  const [visible, setVisible] = useState(false);
  const [filterKey, setFilterKey] = useState('');

  return (
    <div>
      <Space.Compact>
        <StablePopover
          placement={'bottom'}
          open={visible}
          onOpenChange={(val) => {
            if (disabled) {
              return;
            }
            setVisible(val);
          }}
          content={
            <>
              <IconFilterInput changeFilterKey={setFilterKey} />
              <IconFilterList currentKey={value} filterKey={filterKey} onChange={onChange} changePop={setVisible} />
            </>
          }
          title={t('Icon')}
          trigger="click"
        >
          <Button size={layout.size as any} disabled={disabled}>
            {hasIcon(value) ? <Icon type={value} /> : t('Select icon')}
          </Button>
        </StablePopover>
        {value && !disabled && (
          <Button
            size={layout.size as any}
            icon={<CloseOutlined />}
            onClick={(e) => {
              onChange(null);
            }}
          ></Button>
        )}
      </Space.Compact>
    </div>
  );
}

export const IconPicker = connect(
  IconField,
  mapProps((props, field) => {
    return {
      ...props,
      suffix: <span>{field?.['loading'] || field?.['validating'] ? <LoadingOutlined /> : props.suffix}</span>,
    };
  }),
  mapReadPretty((props) => {
    if (!isValid(props.value)) {
      return <div></div>;
    }
    return <Icon type={props.value} />;
  }),
);

export default IconPicker;
