interface Node {
  id: number;
  type: string;
  upstreamId: number;
  upstream: Node;
  downstreamId: number;
  downstream: Node;
  [key: string]: any;
}

// 插入节点
function insertNode(list: Node[], newNode: Node, upstreamId: number, downstreamId: number): Node[] {
  // 查找上游节点和下游节点
  let upstreamNode = list.find((node) => node.id === upstreamId);
  let downstreamNode = list.find((node) => node.id === downstreamId);

  // 检查是否存在
  if (!upstreamNode || !downstreamNode) {
    throw new Error('Upstream or downstream node not found');
  }

  // 更新引用
  newNode.upstream = upstreamNode;
  newNode.upstreamId = upstreamNode.id;
  newNode.downstream = downstreamNode;
  newNode.downstreamId = downstreamNode.id;

  // 更新上游节点和下游节点的引用
  upstreamNode.downstream = newNode;
  upstreamNode.downstreamId = newNode.id;
  downstreamNode.upstream = newNode;
  downstreamNode.upstreamId = newNode.id;

  // 添加到数组
  list.push(newNode);

  return list.slice();
}

// 删除节点
function deleteNode(list: Node[], nodeId): Node[] {
  // 查找要删除的节点
  let nodeToDelete = list.find((node) => node.id === nodeId);

  // 检查是否存在
  if (!nodeToDelete) {
    throw new Error('Node not found');
  }

  // 查找上游和下游节点
  let upstreamNode = list.find((node) => node.id === nodeToDelete.upstreamId);
  let downstreamNode = list.find((node) => node.id === nodeToDelete.downstreamId);

  // 更新上游节点的下游引用
  if (upstreamNode) {
    upstreamNode.downstream = downstreamNode;
    upstreamNode.downstreamId = downstreamNode.id;
  }

  // 更新下游节点的上游引用
  if (downstreamNode) {
    downstreamNode.upstream = upstreamNode;
    downstreamNode.upstreamId = upstreamNode.id;
  }

  // 从数组中移除节点
  const newlist = list.filter((node) => node.id !== nodeId);

  return newlist;
}

// 根据链表顺序重新排序数组的函数
function sortArrayByLinkedList(nodeList: Node[]): Node[] {
  let sortedList: Node[] = [];
  let current: Node | null = null;

  // 找到链表的头部节点（没有上游节点的节点）
  for (const node of nodeList) {
    if (node.upstream === null) {
      current = node;
      break;
    }
  }

  // 如果没有找到头部节点，返回空数组
  if (!current) {
    return sortedList;
  }

  // 遍历链表，按照节点的连接顺序将它们添加到新的数组中
  while (current !== null) {
    sortedList.push(current);
    const nextNode = current.downstream;
    // 断开引用，避免循环引用
    current.downstream = null;
    current = nextNode;
  }

  return sortedList;
}

export function rearrangeNodeList(nodeList: Node[], activeId: number, overId: number): Node[] {
  const activeIndex = nodeList.findIndex((node) => node.id === activeId);
  const overIndex = nodeList.findIndex((node) => node.id === overId);

  const activeNode = nodeList[activeIndex];
  const overNode = nodeList[overIndex];

  const direction = activeIndex > overIndex ? 'up' : 'down';

  // 检查是否存在
  if (!activeNode || !overNode) {
    throw new Error('Active or over node not found');
  }
  // 删除旧的活动节点
  const listWithoutActive = deleteNode(nodeList, activeId);

  // 插入新的活动节点
  let upstreamId: number;
  let downstreamId: number;
  if (direction === 'up') {
    upstreamId = overNode.upstreamId;
    downstreamId = overNode.id;
  } else {
    upstreamId = overNode.id;
    downstreamId = overNode.downstreamId;
  }
  const listHaveActive = insertNode(listWithoutActive, activeNode, upstreamId, downstreamId);

  // 重新排序链表数组
  const sortedList = sortArrayByLinkedList(listHaveActive);

  return sortedList;
}
