import { theme } from 'antd';
import { CustomToken } from '../style';

interface Result extends ReturnType<typeof theme.useToken> {
  token: CustomToken;
}

const useToken = () => {
  const result = theme.useToken();
  return result as Result;
};

export { useToken };
