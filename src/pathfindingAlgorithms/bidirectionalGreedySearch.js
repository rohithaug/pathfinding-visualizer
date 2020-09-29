export function bidirectionalGreedySearch(grid, startNode, finishNode) {
  if (!startNode || !finishNode || startNode === finishNode) {
    return false;
  }
  let unvisitedNodesStart = [];
  let visitedNodesInOrderStart = [];
  let unvisitedNodesFinish = [];
  let visitedNodesInOrderFinish = [];
  startNode.distance = 0;
  finishNode.distance = 0;
  unvisitedNodesStart.push(startNode);
  unvisitedNodesFinish.push(finishNode);

  while (
    unvisitedNodesStart.length !== 0 &&
    unvisitedNodesFinish.length !== 0
  ) {
    unvisitedNodesStart.sort((a, b) => a.totalDistance - b.totalDistance);
    unvisitedNodesFinish.sort((a, b) => a.totalDistance - b.totalDistance);
    let closestNodeStart = unvisitedNodesStart.shift();
    let closestNodeFinish = unvisitedNodesFinish.shift();

    closestNodeStart.isVisited = true;
    closestNodeFinish.isVisited = true;
    visitedNodesInOrderStart.push(closestNodeStart);
    visitedNodesInOrderFinish.push(closestNodeFinish);
    if (isNeighbour(closestNodeStart, closestNodeFinish)) {
      return [visitedNodesInOrderStart, visitedNodesInOrderFinish, true];
    }

    //Start side search
    let neighbours = getNeighbours(closestNodeStart, grid);
    for (let neighbour of neighbours) {
      if (!neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesFinish)) {
        visitedNodesInOrderStart.push(closestNodeStart);
        visitedNodesInOrderFinish.push(neighbour);
        return [visitedNodesInOrderStart, visitedNodesInOrderFinish, true];
      }
      let distance = closestNodeStart.distance + 1;
      //f(n) = h(n)
      if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesStart)) {
        unvisitedNodesStart.unshift(neighbour);
        neighbour.distance = distance;
        neighbour.totalDistance = manhattenDistance(neighbour, finishNode);
        neighbour.previousNode = closestNodeStart;
      } else if (distance < neighbour.distance) {
        neighbour.distance = distance;
        neighbour.totalDistance = manhattenDistance(neighbour, finishNode);
        neighbour.previousNode = closestNodeStart;
      }
    }

    //Finish side search
    neighbours = getNeighbours(closestNodeFinish, grid);
    for (let neighbour of neighbours) {
      if (!neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesStart)) {
        visitedNodesInOrderStart.push(closestNodeFinish);
        visitedNodesInOrderStart.push(neighbour);
        return [visitedNodesInOrderStart, visitedNodesInOrderFinish, true];
      }
      let distance = closestNodeFinish.distance + 1;
      //f(n) = h(n)
      if (neighbourNotInUnvisitedNodes(neighbour, unvisitedNodesFinish)) {
        unvisitedNodesFinish.unshift(neighbour);
        neighbour.distance = distance;
        neighbour.totalDistance = manhattenDistance(neighbour, startNode);
        neighbour.previousNode = closestNodeFinish;
      } else if (distance < neighbour.distance) {
        neighbour.distance = distance;
        neighbour.totalDistance = manhattenDistance(neighbour, startNode);
        neighbour.previousNode = closestNodeFinish;
      }
    }
  }
  return [visitedNodesInOrderStart, visitedNodesInOrderFinish, false];
}

function isNeighbour(closestNodeStart, closestNodeFinish) {
  let rowStart = closestNodeStart.row;
  let colStart = closestNodeStart.col;
  let rowFinish = closestNodeFinish.row;
  let colFinish = closestNodeFinish.col;
  if (rowFinish === rowStart - 1 && colFinish === colStart) return true;
  if (rowFinish === rowStart && colFinish === colStart + 1) return true;
  if (rowFinish === rowStart + 1 && colFinish === colStart) return true;
  if (rowFinish === rowStart && colFinish === colStart - 1) return true;
  return false;
}

function getNeighbours(node, grid) {
  let neighbours = [];
  let { row, col } = node;
  if (row !== 0) neighbours.push(grid[row - 1][col]);
  if (col !== grid[0].length - 1) neighbours.push(grid[row][col + 1]);
  if (row !== grid.length - 1) neighbours.push(grid[row + 1][col]);
  if (col !== 0) neighbours.push(grid[row][col - 1]);
  return neighbours.filter(
    (neighbour) => !neighbour.isWall && !neighbour.isVisited
  );
}

function manhattenDistance(nodeA, nodeB) {
  let x = Math.abs(nodeA.row - nodeB.row);
  let y = Math.abs(nodeA.col - nodeB.col);
  return x + y;
}

function neighbourNotInUnvisitedNodes(neighbour, unvisitedNodes) {
  for (let node of unvisitedNodes) {
    if (node.row === neighbour.row && node.col === neighbour.col) {
      return false;
    }
  }
  return true;
}

export function getNodesInShortestPathOrderBidirectionalGreedySearch(
  nodeA,
  nodeB
) {
  let nodesInShortestPathOrder = [];
  let currentNode = nodeB;
  while (currentNode !== null) {
    nodesInShortestPathOrder.push(currentNode);
    currentNode = currentNode.previousNode;
  }
  currentNode = nodeA;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
