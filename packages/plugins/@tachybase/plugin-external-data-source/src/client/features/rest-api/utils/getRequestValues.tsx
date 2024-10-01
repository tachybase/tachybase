export function getRequestValues(form, actionKey) {
  const actionValue = form?.values?.actions?.[actionKey];

  let result = [];

  const { params = [], headers = [], body = [] } = actionValue || {};

  result = [...params, ...headers].map((key) => {
    return key?.value?.replace(/{{|}}/g, '');
  });

  if (typeof body == 'string') {
    result.concat(body?.replace(/{{|}}/g, ''));
  } else {
    result.concat(
      body?.map((item) => {
        return item?.value.replace(/{{|}}/g, '');
      }),
    );
  }

  return result.filter(Boolean);
}
