function get2PointDistance(x1, y1, x2, y2) {
    var dx = x1 - x2;
    var dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

function isInside(x, y, vertices) {
    var inside = false;
    for (var i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        var xi = vertices[i][0], yi = vertices[i][1];
        var xj = vertices[j][0], yj = vertices[j][1];
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

function centerOfShape(vertices) {
    var x = 0;
    var y = 0;
    for (var i = 0; i < vertices.length; i++) {
        x += vertices[i][0];
        y += vertices[i][1];
    }
    return [x / vertices.length, y / vertices.length];
}

function pointToLineDistance(x, y, x1, y1, x2, y2) {
    let A = x - x1;
    let B = y - y1;
    let C = x2 - x1;
    let D = y2 - y1;

    let dot = A * C + B * D;
    let len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) //in case of 0 length line
        param = dot / len_sq;

    let xx, yy;

    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    let dx = x - xx;
    let dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
}

function triangleArea(x1, y1, x2, y2, x3, y3) {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
}

function isPointInsideTriangle(x, y, x1, y1, x2, y2, x3, y3) {
    let A = triangleArea(x1, y1, x2, y2, x3, y3);
    let A1 = triangleArea(x, y, x2, y2, x3, y3);
    let A2 = triangleArea(x1, y1, x, y, x3, y3);
    let A3 = triangleArea(x1, y1, x2, y2, x, y);
    return Math.abs(A - A1 - A2 - A3) < 0.0001;
}

function isPointInsideShape(x, y, vertices, shapeType) {
    if (vertices.length < 3) {
        return pointToLineDistance(x, y, vertices[0][0], vertices[0][1], vertices[1][0], vertices[1][1]) < epsilon;
    }

    if (shapeType == ShapeType.POLYGON_STRIP) {
        for (var i = 0; i < vertices.length - 2; i++) {
            if (isPointInsideTriangle(x, y, vertices[i][0], vertices[i][1], vertices[i + 1][0], vertices[i + 1][1], vertices[i + 2][0], vertices[i + 2][1])) {
                return true;
            }
        }
    } else if (shapeType == ShapeType.POLYGON_FAN) {
        for (var i = 1; i < vertices.length - 1; i++) {
            if (isPointInsideTriangle(x, y, vertices[0][0], vertices[0][1], vertices[i][0], vertices[i][1], vertices[i + 1][0], vertices[i + 1][1])) {
                return true;
            }
        }
    }
    else {
        for (var i = 0; i < vertices.length - 1; i++) {
            if (i == vertices.length - 2) {
                if (isPointInsideTriangle(x, y, vertices[i][0], vertices[i][1], vertices[i + 1][0], vertices[i + 1][1], vertices[0][0], vertices[0][1])) {
                    return true;
                }
            } else {
                if (isPointInsideTriangle(x, y, vertices[i][0], vertices[i][1], vertices[i + 1][0], vertices[i + 1][1], vertices[i + 2][0], vertices[i + 2][1])) {
                    return true;
                }
            }
        }
    }
}

function getSquareSecondPoint(firstX, firstY) {
    let secondX = mousePosX
    let secondY = mousePosY

    const width = Math.abs(secondX - firstX)
    const height = Math.abs(secondY - firstY)

    if (width > height) {
        if (secondY > firstY) {
            secondY = firstY + width
        } else {
            secondY = firstY - width
        }
    } else {
        if (secondX > firstX) {
            secondX = firstX + height
        } else {
            secondX = firstX - height
        }
    }
    return [secondX, secondY]
}

function cross(x1,y1,x2,y2){
    return x1*y2 - x2*y1
}

function ccw(pivotX,pivotY,x1,y1,x2,y2){
    return cross(x1-pivotX,y1-pivotY,x2-pivotX,y2-pivotY) > 0
}

function isCoLinear(pivotX,pivotY,x1,y1,x2,y2){
    const INF = 10000000000
    let m1 = INF
    let m2 = INF
    if(x1-pivotX != 0){
        m1 = (y1-pivotY)/(x1-pivotX)
    }
    if(x2-pivotX != 0){
        m2 = (y2-pivotY)/(x2-pivotX)
    }
    const epsilonM = 0.001
    if(Math.abs(m1-m2)<=epsilonM){
        return true
    }else{
        return false
    }
}

function angleCmp(pivotX,pivotY,x1,y1,x2,y2){
    if(isCoLinear(pivotX,pivotY,x1,y1,x2,y2)){
        if (get2PointDistance(x1,y1,pivotX,pivotY) < get2PointDistance(x2,y2,pivotX,pivotY)){
            return -1
        }else{
            return 1
        }
    }
    let d1x = x1-pivotX;
    let d1y = y1-pivotY;
    let d2x = x2-pivotX;
    let d2y = y2-pivotY;

    tan1 = Math.atan2(d1y,d1x);
    tan2 = Math.atan2(d2y,d2x);

    if(tan1 < tan2){
        return -1
    }else{
        return 1
    }
}

function getConvexHull(vertex){
    let n = vertex.length
    let res = []
    if(n <= 3){
        for(let i=0;i<n;i++){
            res.push([vertex[0],vertex[1],vertex[2],vertex[3],vertex[4],vertex[5]])
        }
        return res
    }

    let idx = 0
    for(let i=1;i<n;i++){
        if(vertex[i][1] < vertex[idx][1] || (vertex[i][1] == vertex[idx][1] && vertex[i][0] > vertex[idx][0])){
            idx = i
        }
    }

    let pivot = vertex[idx]

    let arr = []
    for(let i=0;i<n;i++){
        if(i == idx)continue
        arr.push([vertex[i][0],vertex[i][1],vertex[i][2],vertex[i][3],vertex[i][4],vertex[i][5]])
    }

    arr.sort((a,b) => angleCmp(pivot[0],pivot[1],a[0],a[1],b[0],b[1]))

    res.push([arr[arr.length-1][0],arr[arr.length-1][1],arr[arr.length-1][2],arr[arr.length-1][3],arr[arr.length-1][4],arr[arr.length-1][5]])
    res.push([vertex[idx][0],vertex[idx][1],vertex[idx][2],vertex[idx][3],vertex[idx][4],vertex[idx][5]])
    res.push([arr[0][0],arr[0][1],arr[0][2],arr[0][3],arr[0][4],arr[0][5]])

    let i = 1;
    while(i < arr.length){
        let k = res.length;
        if(ccw(res[k-2][0],res[k-2][1],res[k-1][0],res[k-1][1],arr[i][0],arr[i][1])){
            res.push([arr[i][0],arr[i][1],arr[i][2],arr[i][3],arr[i][4],arr[i][5]])
            i+=1;
        }else{
            res.pop();
        }
    }

    return res;
}