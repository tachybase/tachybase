export const isMain = () => {
  return currentProcessNum() === '0';
};

export const currentProcessNum = () => {
  if (typeof process.env.NODE_APP_INSTANCE === 'undefined') {
    return '0';
  } else {
    return process.env.NODE_APP_INSTANCE;
  }
};
