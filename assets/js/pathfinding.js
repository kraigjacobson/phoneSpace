function backtrace(node) {
    var path = [node];
    while (node.nodeParent) {
        node = node.nodeParent;
        path.push(node);
    }
    return path.reverse();
}

function newPathTo(startNode, endNode) {
    var openList = new Heap(function (nodeA, nodeB) {
            return nodeA.f - nodeB.f;
        }),
        heuristic = function (dx, dy) {
            return dx + dy;
        },
        abs = Math.abs, SQRT2 = Math.SQRT2,
        node, neighbors, neighbor, i, x, y, ng;

    for (i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if (entity.type === 'star') {
            entity.g = 0;
            entity.f = 0;
            entity.opened = false;
            entity.closed = false;
            entity.nodeParent = null;
        }
    }

    // set the `g` and `f` value of the start node to be 0
    startNode.g = 0;
    startNode.f = 0;

    // push the start node into the open list
    openList.push(startNode);
    startNode.opened = true;

    // while the open list is not empty
    while (!openList.empty()) {
        // pop the position of node which has the minimum `f` value.
        node = openList.pop();
        node.closed = true;

        // if reached the end position, construct the path and return it
        if (node === endNode) {
            var path = backtrace(endNode);
            path.splice(0, 1);
            return path;
        }

        // get neigbours of the current node
        neighbors = node.neighbors;
        for (i = 0; i < neighbors.length; ++i) {
            neighbor = neighbors[i];

            if (neighbor.closed) {
                continue;
            }

            x = neighbor.x;
            y = neighbor.y;

            // get the distance between current node and the neighbor
            // and calculate the next g score
            ng = node.g + ((x - node.x === 0 || y - node.y === 0) ? 1 : SQRT2);

            // check if the neighbor has not been inspected yet, or
            // can be reached with smaller cost from the current node
            if (!neighbor.opened || ng < neighbor.g) {
                neighbor.g = ng;
                neighbor.h = neighbor.h || heuristic(abs(x - endNode.x), abs(y - endNode.y));
                neighbor.f = neighbor.g + neighbor.h;
                neighbor.nodeParent = node;

                if (!neighbor.opened) {
                    openList.push(neighbor);
                    neighbor.opened = true;
                } else {
                    // the neighbor can be reached with smaller cost.
                    // Since its f value has been updated, we have to
                    // update its position in the open list
                    openList.updateItem(neighbor);
                }
            }
        } // end for each neighbor
    } // end while not open list empty

    // fail to find the path
    return [];
}