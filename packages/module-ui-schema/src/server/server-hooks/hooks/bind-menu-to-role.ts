export async function bindMenuToRole({ schemaInstance, db, options }) {
  const { transaction } = options;
  const addNewMenuRoles = await db.getRepository('roles').find({
    filter: {
      allowNewMenu: true,
    },
  });

  const xUid = schemaInstance.get('x-uid');
  for (const role of addNewMenuRoles) {
    // 此处由于可能开启allowNewMenu之前父节点没给到角色,导致角色没有权限,所以这里需要给角色添加所有父节点权限
    const ancestors = await db.getRepository('uiSchemaTreePath').find({
      fields: ['ancestor'],
      filter: {
        descendant: schemaInstance.get('x-uid'),
      },
    });
    const ancestorsIds = ancestors.map((item) => item.get('ancestor'));
    ancestorsIds.push(xUid);
    await db.getRepository('roles.menuUiSchemas', role.get('name')).add({
      tk: ancestorsIds,
      transaction,
    });
  }
}
