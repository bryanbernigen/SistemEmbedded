class Color {
    constructor(red, green, blue, alpha = 1.0) {
        this.red = this.normalizeColor(red);
        this.green = this.normalizeColor(green);
        this.blue = this.normalizeColor(blue);
        this.alpha = this.normalizeColor(alpha);
    }

    normalizeColor(inputColor) {
        //Check if the input is in range 0-1 or 0-255 
        if (inputColor > 1.0 || inputColor < -1.0) {
            inputColor = inputColor / 255;
        }
        //Check if the input is negative
        if (inputColor < 0.0) {
            inputColor = -inputColor;
        }
        //Check if the input is still greater than 1 after normalization
        if (inputColor > 1.0) {
            inputColor = 1.0;
        }
        return inputColor;
    }
}

//Abstract class for all shapes
class Shape {
    static ID = 0;
    constructor(vertices, color, type) {    // example              
        this.id = Shape.ID++;               // 0
        this.vertices = vertices;           // [[x1, y1], [x2, y2], ...]
        this.vertices[0].push(color.red, color.green, color.blue, color.alpha ? color.alpha : 1.0);                 // [r, g, b]
        this.type = type;                   // TRIANGLE / LINE / SQUARE / ETC
    }

    materialize(webGLShape) {
        let vertices = [];
        for (let i = 0; i < this.vertices.length; i++) {
            vertices.push(this.vertices[i][0], this.vertices[i][1], this.vertices[i][2], this.vertices[i][3], this.vertices[i][4], this.vertices[i][5] || 1.0);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        gl.drawArrays(webGLShape, 0, this.vertices.length);
    }

    toString() {
        return `${this.type},${this.vertices}`
    }

    //Abstract method
    draw() {
        throw new Error("Method not implemented");
    }

}

class Point extends Shape {
    constructor(vertices, color) {
        super(vertices, color, ShapeType.POINT);
    }

    draw() {
        this.materialize(gl.POINTS)
    }
}

class Line extends Shape {
    constructor(vertices, color) {
        super(vertices, color, ShapeType.LINE);
    }

    addVertex(vertex, color) {
        let newVertex = [vertex[0], vertex[1], color[0], color[1], color[2], color[3] || 1];
        this.vertices.push(newVertex);
    }

    draw() {
        this.materialize(gl.LINE_STRIP);
    }
}

class Triangle extends Shape {
    constructor(vertices, color) {
        super(vertices, color, ShapeType.TRIANGLE);
    }

    addVertex(vertex, color) {
        let newVertex = [vertex[0], vertex[1], color[0], color[1], color[2], color[3] || 1];
        if (this.vertices.length < 2) {
            this.vertices.push(newVertex);
            return false
        }
        this.vertices.push(newVertex);
        return true;
    }

    draw() {
        this.materialize(gl.TRIANGLES);
    }
}

class PolygonFan extends Shape {
    constructor(vertices, color) {
        super(vertices, color, ShapeType.POLYGON_FAN);
    }

    addVertex(vertex, color) {
        let newVertex = [vertex[0], vertex[1], color[0], color[1], color[2], color[3] || 1];
        this.vertices.push(newVertex);
    }

    draw() {
        this.materialize(gl.TRIANGLE_FAN);
    }

    deleteVertex(vertexID) {
        this.vertices.splice(vertexID, 1);
    }
}

class PolygonStrip extends Shape {
    constructor(vertices, color) {
        super(vertices, color, ShapeType.POLYGON_STRIP);
    }

    addVertex(vertex, color) {
        let newVertex = [vertex[0], vertex[1], color[0], color[1], color[2], color[3] || 1];
        this.vertices.push(newVertex);
    }

    draw() {
        this.materialize(gl.TRIANGLE_STRIP);
    }

    deleteVertex(vertexID) {
        this.vertices.splice(vertexID, 1);
    }
}

class Square extends Shape {
    constructor(vertices, color) {
        super(vertices, color, ShapeType.SQUARE);
        this.firstVertex = vertices[0];
    }

    addVertex(vertex, color) {
        let newVertex = [vertex[0], vertex[1], color[0], color[1], color[2], color[3] || 1];
        this.vertices.push(newVertex);
        return this.vertices.length >= 2;
    }

    draw() {
        this.materialize(gl.TRIANGLE_FAN);
    }
}

class Rectangle extends Shape {
    constructor(vertices, color) {
        super(vertices, color, ShapeType.RECTANGLE);
        this.firstVertex = vertices[0];
    }

    addVertex(vertex, color) {
        let newVertex = [vertex[0], vertex[1], color[0], color[1], color[2], color[3] || 1];
        this.vertices.push(newVertex);
        return this.vertices.length >= 2;
    }

    draw() {
        this.materialize(gl.TRIANGLE_FAN);
    }
}

class ConvexHull extends Shape {
    constructor(vertices, color) {
        super(vertices, color, ShapeType.CONVEX_HULL);
    }

    addVertex(vertex, color) {
        let newVertex = [vertex[0], vertex[1], color[0], color[1], color[2], color[3] || 1];
        this.vertices.push(newVertex);
    }

    draw() {
        let temp = []
        for(let i=0;i<this.vertices.length;i++){
            temp.push([this.vertices[i][0],this.vertices[i][1],this.vertices[i][2],this.vertices[i][3],this.vertices[i][4],this.vertices[i][5]])
        }
        // Add centroid to draw and make the color average of all vertices
        let center = centerOfShape(temp)
        let curColor = [0,0,0]
        for(let i=0;i<this.vertices.length;i++){
            for(let j=0;j<3;j++){
                curColor[j]+=this.vertices[i][j+2]
            }
        }
        for(let i=0;i<3;i++){
            curColor[i]/=this.vertices.length
        }
        this.vertices = [center.concat(curColor)].concat(getConvexHull(temp));
        
        this.materialize(gl.TRIANGLE_FAN);
        this.vertices = temp;
    }

    deleteVertex(vertexID) {
        this.vertices.splice(vertexID, 1);
    }

    setLastVertex(vertex){
        this.vertices[this.vertices.length-1][0] = vertex[0];
        this.vertices[this.vertices.length-1][1] = vertex[1];
        this.vertices[this.vertices.length-1][2] = vertex[2];
        this.vertices[this.vertices.length-1][3] = vertex[3];
        this.vertices[this.vertices.length-1][4] = vertex[4];
        this.vertices[this.vertices.length-1][5] = vertex[5];
    }
}

