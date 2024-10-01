export const setFormValue = async (form, action, value) => {
  const { actions } = form.values || {};
  form.setValuesIn('actions', {
    ...actions,
    [action]: {
      ...actions?.[action],
      responseTransformer: value,
    },
  });
};
