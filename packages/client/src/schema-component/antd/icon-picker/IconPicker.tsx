import { useState } from 'react';
import { useFormLayout } from '@tachybase/components';
import { connect, isValid, mapProps, mapReadPretty } from '@tachybase/schema';

import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useTranslation } from 'react-i18next';

import { hasIcon, Icon } from '../../../icon';
import { StablePopover } from '../popover';
import { useStyles } from './IconPicker.style';
import { IconPickerContentV2 } from './IconPickerContentV2';

function IconField(props: any) {
  const { value, onChange, disabled } = props;
  const { t } = useTranslation();
  const layout = useFormLayout();
  const { styles } = useStyles();
  const [visible, setVisible] = useState(false);
  const [filterKey, setFilterKey] = useState('');

  return (
    <div>
      <Space.Compact>
        <StablePopover
          overlayClassName={styles.popoverStyles}
          placement={'bottom'}
          open={true || visible}
          trigger="click"
          content={<IconPickerContentV2 {...{ value, onChange, setFilterKey, filterKey, setVisible }} />}
          onOpenChange={(val) => {
            if (disabled) {
              return;
            }
            setVisible(val);
          }}
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
