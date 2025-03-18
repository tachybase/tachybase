import { ActionContextProvider } from '@tachybase/client';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown, Modal } from 'antd';

import { useTranslation } from '../../../locale';
import { ProviderContext } from '../../../NodeContext';
import { useProps } from './AddButton.props';
import useStyles from './AddButton.style';
import { ViewUploadForm } from './ViewUploadForm';

interface AddButtonProps {
  upstream;
  branchIndex?: number | null;
  [key: string]: any;
}

/**
 * 添加按钮以及节点之间的连接线
 */
export const AddButton = (props: AddButtonProps) => {
  const { t } = useTranslation();
  const { styles } = useStyles();

  const { upstream, branchIndex = null } = props;
  const { workflow, menu, isShowUploadModal, setIsShowUploadModal } = useProps(props);

  if (!workflow) {
    return null;
  }

  return (
    <div className={styles.addButtonClass}>
      <Dropdown trigger={['click']} disabled={workflow.executed} overlayClassName={styles.dropDownClass} menu={menu}>
        <Button
          className="add-btn"
          icon={<PlusOutlined />}
          type="primary"
          aria-label={props['aria-label'] || 'add-button'}
        />
      </Dropdown>
      <Modal footer={null} closable={false} title={t('Upload node')} open={isShowUploadModal}>
        <ActionContextProvider
          value={{
            visible: isShowUploadModal,
            setVisible: setIsShowUploadModal,
          }}
        >
          <ProviderContext value={{ upstream, branchIndex }}>
            <ViewUploadForm />
          </ProviderContext>
        </ActionContextProvider>
      </Modal>
    </div>
  );
};
