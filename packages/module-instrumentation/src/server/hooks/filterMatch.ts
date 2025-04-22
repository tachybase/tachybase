const operators = {
  $eq: (a, b) => a === b,
  $ne: (a, b) => a !== b,
  $gt: (a, b) => a > b,
  $gte: (a, b) => a >= b,
  $lt: (a, b) => a < b,
  $lte: (a, b) => a <= b,
  $in: (a, b) => a.includes(b),
  $exists: (a, b) => (b ? a !== undefined : a === undefined),
  $null: (a, b) => (b ? a === null : a !== null),
};

function getValueByPath(obj, path) {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function matchCondition(value, condition) {
  for (const op in condition) {
    const operator = op;
    if (operators[operator]) {
      if (!operators[operator](value, condition[op])) return false;
    } else {
      return false;
    }
  }
  return true;
}

export function filterMatch(model, filter) {
  if ('$and' in filter) {
    return filter['$and'].every((subFilter) => filterMatch(model, subFilter));
  }

  if ('$or' in filter) {
    return filter['$or'].some((subFilter) => filterMatch(model, subFilter));
  }

  for (const key in filter) {
    const value = filter[key];

    if (typeof value === 'object' && !Array.isArray(value)) {
      for (const subKey in value) {
        const nested = value[subKey];

        const fullPath = `${key}.${subKey}`;
        const actualValue = getValueByPath(model, fullPath);

        if (!matchCondition(actualValue, nested)) {
          return false;
        }
      }
    } else {
      if (getValueByPath(model, key) !== value) {
        return false;
      }
    }
  }

  return true;
}
