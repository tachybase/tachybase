export const getUserListByDepartment = async (api, departmentId: string) => {
  if (!departmentId) {
    return [];
  }

  const APIResource = api.resource('users');

  const { data } = await APIResource.list({
    filter: { 'departments.id': departmentId },
    appends: ['departments', 'departments.parent(recursively=true)'],
  });

  const userList = data.data;
  return userList;
};
