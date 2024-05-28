export const getDepartmentStr = (department) => {
  const title = department.title;
  const parent = department.parent;
  if (parent) {
    return getDepartmentStr(parent) + '/' + title;
  } else {
    return title;
  }
};
