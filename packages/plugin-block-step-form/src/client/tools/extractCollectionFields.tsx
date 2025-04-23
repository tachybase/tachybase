export function extractCollectionFields(schema) {
  const collectionFields = [];
  const traverse = (node) => {
    if (node['x-component'] === 'CollectionField') {
      collectionFields.push(node);
    } else if (node.properties) {
      Object.keys(node.properties).forEach((key) => traverse(node.properties[key]));
    }
  };
  traverse(schema);

  const pathList = collectionFields.map((field) => {
    const path = [];
    let current = field;
    while (current.parent && current !== schema) {
      path.unshift(current.name);
      current = current.parent;
    }
    return path.join('.');
  });

  return pathList;
}
