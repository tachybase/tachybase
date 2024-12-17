import { useCurrentAppInfo } from '../../common';

const useDialect = () => {
  const {
    data: { database },
  } = useCurrentAppInfo();

  const isDialect = (dialect: string) => database?.dialect === dialect;

  return {
    isDialect,
    dialect: database?.dialect,
  };
};

export default useDialect;
