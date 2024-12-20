interface Node {
  id: number;
  type: string;
  upstreamId: number;
  upstream: Node;
  downstreamId: number;
  downstream: Node;
  [key: string]: any;
}

export function rearrangeNodeList(nodeList: Node[], activeId: number, overId: number): Node[] {
  const newList = [];

  const activeIndex = nodeList.findIndex((node) => node.id === activeId);
  const overIndex = nodeList.findIndex((node) => node.id === overId);

  const activeNode = nodeList[activeIndex];
  const overNode = nodeList[overIndex];

  const direction = activeIndex > overIndex ? 'down' : 'up';

  if (activeIndex === -1 || overIndex === -1) {
    return nodeList;
  }

  if (direction === 'up') {
    // 上移的情况
    for (let i = 0; i < nodeList.length; i++) {
      if (i < overIndex - 1) {
        // 前面的节点不动
        newList.push(nodeList[i]);
      } else if (i === overIndex - 1) {
        // 只更改节点的下游引用
        const targetNode = nodeList[i];
        const upstreamNode = newList.at(-1);
        const downstreamNode = activeNode;
        const newNode = {
          ...targetNode,
          upstreamId: upstreamNode.id,
          upstream: upstreamNode,
          downstreamId: downstreamNode.id,
          downstream: downstreamNode,
        };
        newList.push(newNode);
      } else if (i === overIndex) {
        // 插入活动节点, 并更改上下游节点
        const targetNode = activeNode;
        const upstreamNode = newList.at(-1);
        const downstreamNode = nodeList[i];
        const newNode = {
          ...targetNode,
          upstreamId: upstreamNode.id,
          upstream: upstreamNode,
          downstreamId: downstreamNode.id,
          downstream: downstreamNode,
        };
        newList.push(newNode);
      } else if (i > overIndex && i < activeIndex) {
        // 下移后续节点, 并更改上下游节点引用
        const targetNode = nodeList[i - 1];
        const upstreamNode = newList.at(-1);
        const downstreamNode = nodeList[i];
        const newNode = {
          ...targetNode,
          upstreamId: upstreamNode.id,
          upstream: upstreamNode,
          downstreamId: downstreamNode.id,
          downstream: downstreamNode,
        };
        newList.push(newNode);
      } else if (i === activeIndex + 1) {
        // 只更改上游节点引用
        const targetNode = nodeList[i];
        const upstreamNode = newList.at(-1);
        const downstreamNode = nodeList[i];
        const newNode = {
          ...targetNode,
          upstreamId: upstreamNode.id,
          upstream: upstreamNode,
          downstreamId: downstreamNode.id,
          downstream: downstreamNode,
        };
        newList.push(newNode);
      } else if (i > activeIndex + 1) {
        // 后边节点不做变动
        newList.push(nodeList[i]);
      }
    }
  } else {
    // 下移的情况
    for (let i = 0; i < nodeList.length; i++) {
      if (i < activeIndex - 1) {
        // 前面的节点不动
        newList.push(nodeList[i]);
      } else if (i === activeIndex - 1) {
        // 只更改节点的下游引用
        const targetNode = nodeList[i];
        const upstreamNode = newList.at(-1);
        const downstreamNode = nodeList[i + 1];
        const newNode = {
          ...targetNode,
          upstreamId: upstreamNode?.id,
          upstream: upstreamNode,
          downstreamId: downstreamNode.id,
          downstream: downstreamNode,
        };
        newList.push(newNode);
      } else if (i === activeIndex) {
        // 移除活动节点, 并更改上下游节点
        const targetNode = nodeList[i + 1];
        const upstreamNode = newList.at(-1);
        const downstreamNode = nodeList[i + 2];
        const newNode = {
          ...targetNode,
          upstreamId: upstreamNode.id,
          upstream: upstreamNode,
          downstreamId: downstreamNode.id,
          downstream: downstreamNode,
        };
        newList.push(newNode);
      } else if (i > activeIndex && i < overIndex) {
        // 上移后续节点, 并更改上下游节点引用
        const targetNode = nodeList[i + 1];
        const upstreamNode = newList.at(-1);
        const downstreamNode = nodeList[i + 2];
        const newNode = {
          ...targetNode,
          upstreamId: upstreamNode.id,
          upstream: upstreamNode,
          downstreamId: downstreamNode.id,
          downstream: downstreamNode,
        };
        newList.push(newNode);
      } else if (i === overIndex + 1) {
        // 只更改上游节点引用
        const targetNode = nodeList[i];
        const upstreamNode = newList.at(-1);
        const downstreamNode = targetNode.downstream;
        const newNode = {
          ...targetNode,
          upstreamId: upstreamNode.id,
          upstream: upstreamNode,
          downstreamId: downstreamNode.id,
          downstream: downstreamNode,
        };
        newList.push(newNode);
      } else if (i > overIndex + 1) {
        // 后边节点不做变动
        newList.push(nodeList[i]);
      }
    }
  }

  return nodeList;
}
