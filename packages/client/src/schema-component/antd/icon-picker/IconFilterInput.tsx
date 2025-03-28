import { Input } from 'antd';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export const IconFilterInput = (props) => {
  const { changeFilterKey } = props;
  const { t } = useTranslation();
  const onChange = _.debounce((e) => {
    const inputValue = e.target.value;
    changeFilterKey(inputValue);
  }, 100);

  return (
    <Input allowClear placeholder={t("The key in Antd, such as 'ApiOutlined', ignoring case")} onChange={onChange} />
  );
};
