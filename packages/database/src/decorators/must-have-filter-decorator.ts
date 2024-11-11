const mustHaveFilter = () => (originalMethod: any, context: ClassMethodDecoratorContext) => {
  const oldValue = originalMethod;

  const newMethod = function (...args: any[]) {
    const options = args[0];

    if (Array.isArray(options.values)) {
      return oldValue.apply(this, args);
    }

    if (!options?.filter && !options?.filterByTk && !options?.forceUpdate) {
      throw new Error(`must provide filter or filterByTk for ${String(context.name)} call, or set forceUpdate to true`);
    }

    return oldValue.apply(this, args);
  };

  return newMethod;
};

export default mustHaveFilter;
