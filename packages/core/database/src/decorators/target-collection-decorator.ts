import lodash from 'lodash';

const injectTargetCollection = (originalMethod: any) => {
  const oldValue = originalMethod;

  const newMethod = function (...args: any[]) {
    const options = args[0];
    const values = options.values;

    if (lodash.isPlainObject(values) && values.__collection) {
      options.targetCollection = values.__collection;
    }

    return oldValue.apply(this, args);
  };

  return newMethod;
};

export default injectTargetCollection;
