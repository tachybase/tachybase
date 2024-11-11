export const mapIfHas = (getfunction, category) => {
  if (isNaN(category)) {
    if (category == 0) {
      category = '租金';
    }
    return category;
  } else {
    return getfunction(category);
  }
};
