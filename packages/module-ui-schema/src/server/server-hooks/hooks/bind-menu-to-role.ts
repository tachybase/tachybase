export async function bindMenuToRole({ schemaInstance, db, options }) {
  const { transaction, position, target } = options;
  const addNewMenuRoles = await db.getRepository('roles').find({
    filter: {
      allowNewMenu: true,
    },
  });

  const uid = schemaInstance.get('x-uid');

  let ancestorSet = new Set();
  ancestorSet.add(uid);
  if (target) {
    const ancestorList = await db.getRepository('uiSchemaTreePath').find({
      fields: ['ancestor'],
      filter: {
        descendant: target,
      },
      transaction,
    });
    ancestorList.forEach((ancestor) => {
      ancestorSet.add(ancestor.get('ancestor'));
    });
    // 插入兄弟节点时候 获取祖先节点则需要去掉这个节点
    if (position === 'beforeBegin' || position === 'afterEnd') {
      ancestorSet.delete(target);
    }
  }

  for (const role of addNewMenuRoles) {
    await db.getRepository('roles.menuUiSchemas', role.get('name')).add({
      tk: [...ancestorSet],
      transaction,
    });
  }
}
