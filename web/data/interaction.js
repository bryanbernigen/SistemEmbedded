//Variables
var shapes = {};
var centerPoints = {};
var choosenMode;
var choosenShapeType = null;
var choosenShapeID = null;
var choosenVertexID = null;
var currentShape;
var tempShape = []; 
//For Creating Animation
var animationID = null;
var isAnimating = false;
var animatedShapeID = null;
var animationFrames = 100;
var currentAnimationFrame = 0;
var animationXDistance = 0;
var animationYDistance = 0;
var animationDeltaX = 0;
var animationDeltaY = 0;

//Mouse Variables
var mousePosX = 0;
var mousePosY = 0;
var prevMousePosX = 0;
var prevMousePosY = 0;
var firstClickMousePosX = 0;
var firstClickMousePosY = 0;
var pointHovered = null;
var pointClicked = null;
var currentColorRed = 0.0;
var currentColorGreen = 0.0;
var currentColorBlue = 0.0;
var currentColorAlpha = 1;
var isCenterPointDisplay = false;
var hoveredShape = null;
var rectangleResizeMode = 0;

function redraw() {
    gl.clearColor(0.9296875, 0.91015625, 0.8515625, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    for (let id in shapes) {
        try {
            shapes[id].draw();
            if (isCenterPointDisplay) {
                let point = new Point([centerOfShape(shapes[id].vertices)], new Color(0.9, 0.9, 0.9, 0.70));
                point.draw();
            }
        }
        catch (e) {
            console.log(e);
        }

    }
    if (choosenShapeID != null && choosenMode != ModeType.DRAW) {
        if (choosenVertexID != null) {
            pointClicked = new Point([[shapes[choosenShapeID].vertices[choosenVertexID][0], shapes[choosenShapeID].vertices[choosenVertexID][1]]], new Color(1.0, 1.0, 1.0));
        } else {
            pointClicked = new Point([centerOfShape(shapes[choosenShapeID].vertices)], new Color(1.0, 1.0, 1.0));
        }
        pointClicked.draw();
    }
    if (pointHovered != null && choosenMode != ModeType.DRAW) {
        pointHovered.draw();
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(tempShape), gl.STATIC_DRAW);
    if (tempShape.length <= 12 && choosenShapeType != ShapeType.CONVEX_HULL) {
        gl.drawArrays(gl.LINE_STRIP, 0, tempShape.length / 6);
    }
    else if (choosenShapeType == ShapeType.CONVEX_HULL) {
        if (currentShape != null) {
            currentShape.draw()
        }
    }
    else if (choosenShapeType == ShapeType.POLYGON_FAN
        || choosenShapeType == ShapeType.SQUARE
        || choosenShapeType == ShapeType.RECTANGLE) {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, tempShape.length / 6);
    }
    else {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, tempShape.length / 6);
    }
}

function changeRectangleResizeMode() {
    rectangleResizeMode = document.getElementById("rectangle-resize-mode").value
    console.log(rectangleResizeMode)
}

function savePolygon() {
    if (currentShape != null) {
        shapes[currentShape.id] = currentShape;
    }
    currentShape = null;
    tempShape = [];
    choosenShapeType = null;

    redraw();

    choosenMode = null;
    choosenShapeType = null;
    document.getElementById("currentMode").innerHTML = "Current Mode : NONE";
}

function saveShape() {
    if (currentShape != null) {
        shapes[currentShape.id] = currentShape;
    }
    currentShape = null;
    tempShape = [];
    choosenMode = null;
    choosenShapeType = null;
    document.getElementById("currentMode").innerHTML = "Current Mode : NONE";
}

function changeButtonColor(mode) {
    document.getElementById("move").style.backgroundColor = null;
    document.getElementById("delete").style.backgroundColor = null;
    document.getElementById("dilatate").style.backgroundColor = null;
    document.getElementById("rotate").style.backgroundColor = null;
    document.getElementById("changeColor").style.backgroundColor = null;
    document.getElementById("add").style.backgroundColor = null;
    document.getElementById("animate").style.backgroundColor = null;

    switch (mode) {
        case ModeType.MOVE:
            document.getElementById("move").style.backgroundColor = "grey";
            break;
        case ModeType.DELETE:
            document.getElementById("delete").style.backgroundColor = "grey";
            break;
        case ModeType.DILATATE:
            document.getElementById("dilatate").style.backgroundColor = "grey";
            break;
        case ModeType.ROTATE:
            document.getElementById("rotate").style.backgroundColor = "grey";
            break;
        case ModeType.CHANGECOLOR:
            document.getElementById("changeColor").style.backgroundColor = "grey";
            break;
        case ModeType.ADD:
            document.getElementById("add").style.backgroundColor = "grey";
            break;
        case ModeType.ANIMATE:
            document.getElementById("animate").style.backgroundColor = "grey";
        default:
            break;
    }
}

function changeMode(mode) {
    choosenMode = mode;
    // change html element with current mode
    document.getElementById("currentMode").innerHTML = "Current Mode : " + Object.keys(ModeType)[mode];
    changeButtonColor(mode);

    //Reset Temp Shape
    tempShape = [];
    choosenShapeID = null;
    choosenVertexID = null;
}

function changeModeDraw(shapeType) {
    choosenMode = ModeType.DRAW;
    changeButtonColor(ModeType.DRAW)
    choosenShapeType = shapeType;

    document.getElementById("currentMode").innerHTML = "Current Mode : DRAW";

    // Save polygon
    if (choosenShapeType == ShapeType.POLYGON_FAN) {
        const button = document.getElementById("drawPolygonFan")
        if (button.innerHTML == "Polygon Fan") {
            button.innerHTML = "Save"
            button.style.backgroundColor = "green"
            button.style.color = "white"
        }
        else {
            button.innerHTML = "Polygon Fan"
            button.style.backgroundColor = null
            button.style.color = null
            savePolygon()
        }
    }
    else if (choosenShapeType == ShapeType.POLYGON_STRIP) {
        const button = document.getElementById("drawPolygonStrip")
        if (button.innerHTML == "Polygon Strip") {
            button.innerHTML = "Save"
            button.style.backgroundColor = "green"
            button.style.color = "white"
        }
        else {
            button.innerHTML = "Polygon Strip"
            button.style.backgroundColor = null
            button.style.color = null
            savePolygon()
        }
    }
    else if (choosenShapeType == ShapeType.CONVEX_HULL) {
        const button = document.getElementById("drawConvexHull")
        if (button.innerHTML == "Convex Hull") {
            button.innerHTML = "Save"
            button.style.backgroundColor = "green"
            button.style.color = "white"
        }
        else {
            button.innerHTML = "Convex Hull"
            button.style.backgroundColor = null
            button.style.color = null
            currentShape.vertices.pop()
            savePolygon()
        }
    }
}

function changeColor() {
    const inputColor = document.getElementById('inputColor').value.toString();
    currentColorRed = Number("0x" + inputColor[1] + inputColor[2]) / 255;
    currentColorGreen = Number("0x" + inputColor[3] + inputColor[4]) / 255;
    currentColorBlue = Number("0x" + inputColor[5] + inputColor[6]) / 255;

    if (choosenMode == ModeType.CHANGECOLOR) {
        if (choosenShapeID != null) {
            if (choosenVertexID != null) {
                shapes[choosenShapeID].vertices[choosenVertexID][2] = currentColorRed;
                shapes[choosenShapeID].vertices[choosenVertexID][3] = currentColorGreen;
                shapes[choosenShapeID].vertices[choosenVertexID][4] = currentColorBlue;
            } else {
                for (let i = 0; i < shapes[choosenShapeID].vertices.length; i++) {
                    shapes[choosenShapeID].vertices[i][2] = currentColorRed;
                    shapes[choosenShapeID].vertices[i][3] = currentColorGreen;
                    shapes[choosenShapeID].vertices[i][4] = currentColorBlue;
                }
            }
            redraw();
        }
    }
}

function changeOptionDisplayCenter() {
    isCenterPointDisplay = isCenterPointDisplay ^ true;
    redraw();
}

function setColor(red, green, blue) {
    red = Math.floor(red * 255);
    green = Math.floor(green * 255);
    blue = Math.floor(blue * 255);

    var newColor = "#";
    if (red < 16) {
        newColor += "0" + red.toString(16);
    } else {
        newColor += red.toString(16);
    }

    if (green < 16) {
        newColor += "0" + green.toString(16);
    } else {
        newColor += green.toString(16);
    }

    if (blue < 16) {
        newColor += "0" + blue.toString(16);
    } else {
        newColor += blue.toString(16);
    }

    document.getElementById('inputColor').value = newColor;
}

//Canvas Event Listeners
canvas.addEventListener("mousemove", function (event) {
    getMousePosition(canvas, event);
    selectVertexOrShape("HOVER");
    switch (choosenMode) {
        case ModeType.DRAW:
            switch (choosenShapeType) {
                case ShapeType.POLYGON_FAN:     //Same With Line
                    tempShape[tempShape.length - 6] = mousePosX;
                    tempShape[tempShape.length - 5] = mousePosY;
                    tempShape[tempShape.length - 4] = currentColorRed;
                    tempShape[tempShape.length - 3] = currentColorGreen;
                    tempShape[tempShape.length - 2] = currentColorBlue;
                    tempShape[tempShape.length - 1] = currentColorAlpha;
                    break;
                case ShapeType.POLYGON_STRIP:     //Same With Line
                    tempShape[tempShape.length - 6] = mousePosX;
                    tempShape[tempShape.length - 5] = mousePosY;
                    tempShape[tempShape.length - 4] = currentColorRed;
                    tempShape[tempShape.length - 3] = currentColorGreen;
                    tempShape[tempShape.length - 2] = currentColorBlue;
                    tempShape[tempShape.length - 1] = currentColorAlpha;
                    break;
                case ShapeType.LINE:        //Same with Triangle
                    tempShape[tempShape.length - 6] = mousePosX;
                    tempShape[tempShape.length - 5] = mousePosY;
                    tempShape[tempShape.length - 4] = currentColorRed;
                    tempShape[tempShape.length - 3] = currentColorGreen;
                    tempShape[tempShape.length - 2] = currentColorBlue;
                    tempShape[tempShape.length - 1] = currentColorAlpha;
                    break;
                case ShapeType.TRIANGLE:    //Just Need to Update Last Point
                    tempShape[tempShape.length - 6] = mousePosX;
                    tempShape[tempShape.length - 5] = mousePosY;
                    tempShape[tempShape.length - 4] = currentColorRed;
                    tempShape[tempShape.length - 3] = currentColorGreen;
                    tempShape[tempShape.length - 2] = currentColorBlue;
                    tempShape[tempShape.length - 1] = currentColorAlpha;
                    break;
                case ShapeType.SQUARE:      //Update 3 Points must be locked
                    const [secondX, secondY] =
                        getSquareSecondPoint(
                            tempShape[tempShape.length - 24],
                            tempShape[tempShape.length - 23]
                        )
                    tempShape[tempShape.length - 18] = secondX;
                    tempShape[tempShape.length - 12] = secondX;
                    tempShape[tempShape.length - 11] = secondY;
                    tempShape[tempShape.length - 5] = secondY;
                    break;
                case ShapeType.RECTANGLE:   //Update 3 Points freely
                    tempShape[tempShape.length - 18] = mousePosX;
                    tempShape[tempShape.length - 12] = mousePosX;
                    tempShape[tempShape.length - 11] = mousePosY;
                    tempShape[tempShape.length - 5] = mousePosY;
                    break;
                case ShapeType.CONVEX_HULL:
                    if (currentShape != null) {
                        currentShape.setLastVertex([mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])
                    }
                    break;
                default:
                    break;
            }
            break;
        case ModeType.MOVE:
            selectVertexOrShape("HOVER");
            if (choosenShapeID != null) {
                if (choosenVertexID != null) {
                    moveVertex();
                }
                else {
                    moveShape();
                }
            }
            break;
        case ModeType.DILATATE:
            if (choosenShapeID != null) {
                dilatateShape();
            }
            break;
        case ModeType.ROTATE:
            if (choosenShapeID != null) {
                rotateShape();
            }
            break;
        default:
            break;
    }

    redraw();
});

canvas.addEventListener("click", function (event) {
    selectVertexOrShape("CLICK")
    switch (choosenMode) {
        case ModeType.DRAW:
            switch (choosenShapeType) {
                case ShapeType.TRIANGLE:
                    createTriangle();
                    break;
                case ShapeType.LINE:
                    createLine();
                    break;
                case ShapeType.POLYGON_FAN:
                    createPolygonFan();
                    break;
                case ShapeType.POLYGON_STRIP:
                    createPolygonStrip();
                    break;
                case ShapeType.SQUARE:
                    createSquare();
                    break;
                case ShapeType.RECTANGLE:
                    createRectangle();
                    break;
                case ShapeType.CONVEX_HULL:
                    createConvexHull();
                    break;
                default:
                    break;
            }
            break;
        case ModeType.MOVE:
            break;
        case ModeType.DILATATE:
            break;
        case ModeType.ROTATE:
            break;
        case ModeType.DELETE:
            if (choosenShapeID != null) {
                if (choosenVertexID != null) {
                    // If vertex is selected
                    shapes[choosenShapeID].deleteVertex(choosenVertexID);
                    pointClicked = null;
                    choosenShapeID = null;
                    choosenVertexID = null;
                }
                else {
                    // If centroid is selected
                    delete shapes[choosenShapeID]
                    pointClicked = null;
                    choosenShapeID = null;
                    choosenVertexID = null;
                }
            }
            break;
        case ModeType.ANIMATE:
            //Create timer to call animate function
            if(!isAnimating){
                isAnimating = true;
                let choosenShapeCenter;
                try{
                    choosenShapeCenter = centerOfShape(shapes[choosenShapeID].vertices);
                }
                catch{
                    isAnimating = false;
                    return;
                }
                animationTick = 0;
                animationXDistance = choosenShapeCenter[0];
                animationYDistance = choosenShapeCenter[1];
                animationDeltaX = -animationXDistance/animationFrames;
                animationDeltaY = -animationYDistance/animationFrames;

                console.log(animationDeltaX,animationDeltaY);
                animatedShapeID = choosenShapeID;
                animationID = setInterval(animateShape,10);                
            }
            break;    
        default:
            break;
    }
    redraw();
});

//Track the mouse position
function getMousePosition(canvas, event) {
    mousePosX = (event.offsetX / canvas.clientWidth) * 2 - 1;
    mousePosY = (1 - (event.offsetY / canvas.clientHeight)) * 2 - 1;
}

// Normalize transparency of shape when mouse hover
function onUnhoverShape() {
    if (hoveredShape != null) {
        for (let i = 0; i < hoveredShape.vertices.length; i++) {
            hoveredShape.vertices[i][5] = 1;
        }
    }
}

// Change transparency of shape when mouse hover
function onHoverShape(shape) {
    hoveredShape = shape
    if (hoveredShape != null) {
        for (let i = 0; i < hoveredShape.vertices.length; i++) {
            hoveredShape.vertices[i][5] = 0.9;
        }
    }
}

//Select Vertex or Shape Close to Mouse
function selectVertexOrShape(event) {
    pointHovered = null;
    onUnhoverShape();
    if (event == "CLICK") {
        pointClicked = null;
    }
    if (choosenShapeID == null && choosenVertexID == null) {
        for (let j in shapes) {
            for (let i = 0; i < shapes[j].vertices.length; i++) {
                if (get2PointDistance(mousePosX, mousePosY, shapes[j].vertices[i][0], shapes[j].vertices[i][1]) <= epsilon) {
                    if (event == "HOVER") {
                        pointHovered = new Point([[shapes[j].vertices[i][0], shapes[j].vertices[i][1]]], new Color(1.0, 1.0, 1.0))
                        onHoverShape(shapes[j]);
                    }
                    else if (event == "CLICK") {
                        choosenShapeID = shapes[j].id;
                        choosenVertexID = i;
                        prevMousePosX = mousePosX;
                        prevMousePosY = mousePosY;
                        firstClickMousePosX = mousePosX;
                        firstClickMousePosY = mousePosY;
                        setColor(shapes[j].vertices[i][2], shapes[j].vertices[i][3], shapes[j].vertices[i][4]);
                    }
                    return
                }
            }
            if (isPointInsideShape(mousePosX, mousePosY, shapes[j].vertices, shapes[j].type)) {
                if (event == "HOVER") {
                    // pointHovered = new Point([[shapes[j].vertices[i][0], shapes[j].vertices[i][1]]], new Color(1.0, 1.0, 1.0))
                    onHoverShape(shapes[j]);
                }
                else if (event == "CLICK") {
                    choosenShapeID = shapes[j].id;
                    // choosenVertexID = i;
                    prevMousePosX = mousePosX;
                    prevMousePosY = mousePosY;
                    firstClickMousePosX = mousePosX;
                    firstClickMousePosY = mousePosY;
                    // setColor(shapes[j].vertices[i][2], shapes[j].vertices[i][3], shapes[j].vertices[i][4]);
                }
            }
            const center = centerOfShape(shapes[j].vertices);
            if (get2PointDistance(mousePosX, mousePosY, center[0], center[1]) <= epsilon) {
                if (event == "HOVER") {
                    pointHovered = new Point([[center[0], center[1]]], new Color(1.0, 1.0, 1.0))
                    onHoverShape(shapes[j]);
                }
                else if (event == "CLICK") {
                    choosenShapeID = shapes[j].id;
                    choosenVertexID = null;
                    prevMousePosX = mousePosX;
                    prevMousePosY = mousePosY;
                    firstClickMousePosX = mousePosX;
                    firstClickMousePosY = mousePosY;
                    setColor(0.0, 0.0, 0.0);
                    if (choosenMode == ModeType.ADD && (shapes[choosenShapeID].type == ShapeType.POLYGON_FAN || shapes[choosenShapeID].type == ShapeType.POLYGON_STRIP || shapes[choosenShapeID].type == ShapeType.CONVEX_HULL)) {
                        tempShape = [];
                        choosenMode = ModeType.DRAW;
                        for (let k = 0; k < shapes[choosenShapeID].vertices.length; k++) {
                            tempShape.push(shapes[choosenShapeID].vertices[k][0], shapes[choosenShapeID].vertices[k][1], shapes[choosenShapeID].vertices[k][2], shapes[choosenShapeID].vertices[k][3], shapes[choosenShapeID].vertices[k][4], shapes[choosenShapeID].vertices[k][5]);
                        }
                        currentShape = shapes[choosenShapeID];
                        delete shapes[choosenShapeID];
                        changeModeDraw(currentShape.type);
                    }
                }
            }
        }
    }
    else {
        if (event == "CLICK") {
            choosenShapeID = null;
            choosenVertexID = null;
        }
    }

    redraw();
    return [null, null];
}

//Function to Create Shapes
function createTriangle() {
    if (currentShape != null && currentShape.type == ShapeType.TRIANGLE) {
        if (currentShape.addVertex([mousePosX, mousePosY], [currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])) {
            saveShape()
        }
        else {
            tempShape[tempShape.length - 6] = mousePosX;
            tempShape[tempShape.length - 5] = mousePosY;
            tempShape[tempShape.length - 4] = currentColorRed;
            tempShape[tempShape.length - 3] = currentColorGreen;
            tempShape[tempShape.length - 2] = currentColorBlue;
            tempShape[tempShape.length - 1] = currentColorAlpha;
            tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        }
    }
    else {
        currentShape = new Triangle([[mousePosX, mousePosY]], new Color(currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha));
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
    }
}

function createLine() {
    if (currentShape != null && currentShape.type == ShapeType.LINE) {
        currentShape.addVertex([mousePosX, mousePosY], [currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])
        shapes[currentShape.id] = currentShape;
        saveShape()
    } else {
        currentShape = new Line([[mousePosX, mousePosY]], new Color(currentColorRed, currentColorGreen, currentColorBlue));
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
    }
}

function createPolygonFan() {
    if (currentShape != null && currentShape.type == ShapeType.POLYGON_FAN) {
        currentShape.addVertex([tempShape[tempShape.length - 6], tempShape[tempShape.length - 5]], [tempShape[tempShape.length - 4], tempShape[tempShape.length - 3], tempShape[tempShape.length - 2], tempShape[tempShape.length - 1]])
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
    } else {
        currentShape = new PolygonFan([[mousePosX, mousePosY]], new Color(currentColorRed, currentColorGreen, currentColorBlue));
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
    }
}

function createPolygonStrip() {
    if (currentShape != null && currentShape.type == ShapeType.POLYGON_STRIP) {
        currentShape.addVertex([tempShape[tempShape.length - 6], tempShape[tempShape.length - 5]], [tempShape[tempShape.length - 4], tempShape[tempShape.length - 3], tempShape[tempShape.length - 2], tempShape[tempShape.length - 1]])
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
    } else {
        currentShape = new PolygonStrip([[mousePosX, mousePosY]], new Color(currentColorRed, currentColorGreen, currentColorBlue));
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
    }
}

function createConvexHull() {
    if (currentShape != null && currentShape.type == ShapeType.CONVEX_HULL) {
        currentShape.addVertex([mousePosX, mousePosY], [currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])
    } else {
        currentShape = new ConvexHull([[mousePosX, mousePosY]], new Color(currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha));
        currentShape.addVertex([mousePosX, mousePosY], [currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])
    }
}

function createSquare() {
    if (currentShape && currentShape.type == ShapeType.SQUARE) {
        const firstX = currentShape.firstVertex[0]
        const firstY = currentShape.firstVertex[1]

        const [secondX, secondY] = getSquareSecondPoint(firstX, firstY)

        currentShape.addVertex([firstX, secondY], [currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])
        currentShape.addVertex([secondX, secondY], [currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])
        currentShape.addVertex([secondX, firstY], [currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])

        saveShape()
    }
    else {
        //TODO : Fix Color
        currentShape = new Square([[mousePosX, mousePosY]], new Color(currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha));
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
    }
}

function createRectangle() {
    if (currentShape && currentShape.type == ShapeType.RECTANGLE) {
        const firstX = currentShape.firstVertex[0]
        const firstY = currentShape.firstVertex[1]

        let secondX = mousePosX
        let secondY = mousePosY

        currentShape.addVertex([firstX, secondY], [currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])
        currentShape.addVertex([secondX, secondY], [currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])
        currentShape.addVertex([secondX, firstY], [currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha])

        saveShape()
    }
    else {
        currentShape = new Rectangle([[mousePosX, mousePosY]], new Color(currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha));
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
        tempShape.push(mousePosX, mousePosY, currentColorRed, currentColorGreen, currentColorBlue, currentColorAlpha);
    }
}

//Function to Move Vertex or Shapes
function moveVertex() {
    if (shapes[choosenShapeID].type == ShapeType.SQUARE) {
        let [resultX, resultY] =
            getSquareSecondPoint(
                shapes[choosenShapeID].vertices[(choosenVertexID - 2 + 4) % 4][0],
                shapes[choosenShapeID].vertices[(choosenVertexID - 2 + 4) % 4][1]
            );
        shapes[choosenShapeID].vertices[choosenVertexID][0] = resultX;
        shapes[choosenShapeID].vertices[choosenVertexID][1] = resultY;
        if (choosenVertexID % 2 == 0) {
            shapes[choosenShapeID].vertices[(choosenVertexID + 1 + 4) % 4][0] = resultX;
            shapes[choosenShapeID].vertices[(choosenVertexID - 1 + 4) % 4][1] = resultY;
        }
        else {
            shapes[choosenShapeID].vertices[(choosenVertexID - 1 + 4) % 4][0] = resultX;
            shapes[choosenShapeID].vertices[(choosenVertexID + 1 + 4) % 4][1] = resultY;
        }
    }
    else {
        if (shapes[choosenShapeID].type == ShapeType.RECTANGLE) {
            if (rectangleResizeMode == RectangleResizeMode.HORIZONTAL) {
                shapes[choosenShapeID].vertices[choosenVertexID][0] = mousePosX;
                if (choosenVertexID % 2 == 0) {
                    shapes[choosenShapeID].vertices[(choosenVertexID + 1 + 4) % 4][0] = mousePosX;
                }
                else {
                    shapes[choosenShapeID].vertices[(choosenVertexID - 1 + 4) % 4][0] = mousePosX;
                }
            }
            else {
                shapes[choosenShapeID].vertices[choosenVertexID][1] = mousePosY;
                if (choosenVertexID % 2 == 0) {
                    shapes[choosenShapeID].vertices[(choosenVertexID - 1 + 4) % 4][1] = mousePosY;
                }
                else {
                    shapes[choosenShapeID].vertices[(choosenVertexID + 1 + 4) % 4][1] = mousePosY;
                }
            }
        }
        else {
            shapes[choosenShapeID].vertices[choosenVertexID][0] = mousePosX;
            shapes[choosenShapeID].vertices[choosenVertexID][1] = mousePosY;
        }
    }
}

function moveShape() {
    for (let i = 0; i < shapes[choosenShapeID].vertices.length; i++) {
        shapes[choosenShapeID].vertices[i][0] += mousePosX - prevMousePosX;
        shapes[choosenShapeID].vertices[i][1] += mousePosY - prevMousePosY;
    }
    prevMousePosX = mousePosX;
    prevMousePosY = mousePosY;
}

//Function to Dilatate Shapes according to center of shape
function dilatateShape() {
    let center = centerOfShape(shapes[choosenShapeID].vertices);
    for (let i = 0; i < shapes[choosenShapeID].vertices.length; i++) {
        shapes[choosenShapeID].vertices[i][0] = center[0] + (shapes[choosenShapeID].vertices[i][0] - center[0]) * (1 + (mousePosX - prevMousePosX));
        shapes[choosenShapeID].vertices[i][1] = center[1] + (shapes[choosenShapeID].vertices[i][1] - center[1]) * (1 + (mousePosX - prevMousePosX));
    }
    prevMousePosX = mousePosX;
    prevMousePosY = mousePosY;
}

//Function to Animate Shapes
function animateShape() {
    //Move shape to center of screen
    for (let i = 0; i < shapes[animatedShapeID].vertices.length; i++) {
        shapes[animatedShapeID].vertices[i][0] += animationDeltaX;
        shapes[animatedShapeID].vertices[i][1] += animationDeltaY;
    }
    currentAnimationFrame++;
    if (currentAnimationFrame == animationFrames) {
        clearInterval(animationID);
        currentAnimationFrame = 0;
        isAnimating = false;
    }
    redraw();  
}
//Function to Rotate Shapes
function rotateShape() {
    let center = centerOfShape(shapes[choosenShapeID].vertices);
    for (let i = 0; i < shapes[choosenShapeID].vertices.length; i++) {
        let x = shapes[choosenShapeID].vertices[i][0] - center[0];
        let y = shapes[choosenShapeID].vertices[i][1] - center[1];
        let angle;
        if (mousePosX < firstClickMousePosX) {
            angle = (Math.atan2(y, x) + (prevMousePosX - mousePosX) * 2 * Math.PI / (1 + firstClickMousePosX));
        }
        else {
            angle = (Math.atan2(y, x) + (prevMousePosX - mousePosX) * 2 * Math.PI / (1 - firstClickMousePosX));
        }
        let radius = Math.sqrt(x * x + y * y);
        shapes[choosenShapeID].vertices[i][0] = center[0] + radius * Math.cos(angle);
        shapes[choosenShapeID].vertices[i][1] = center[1] + radius * Math.sin(angle);
    }
    prevMousePosX = mousePosX;
    prevMousePosY = mousePosY;
}

//Save & Load Shapes
function saveShapes() {
    let text = '';
    for (let id in shapes) {
        text += shapes[id].toString() + '\n';
        console.log(id, text)
    }
    saveFile(text, 'savefile.txt');
}

async function loadShapes() {
    let file = await loadFile();
    let text = await file.text();
    console.log("text: ", text)
    let lines = text.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
        data = lines[i].split(',');
        let loadedShape = null;
        for (let j = 1; j < data.length; j += 6) {
            //change data to float
            data[j] = parseFloat(data[j]);
            data[j + 1] = parseFloat(data[j + 1]);
            data[j + 2] = parseFloat(data[j + 2]);
            data[j + 3] = parseFloat(data[j + 3]);
            data[j + 4] = parseFloat(data[j + 4]);
            data[j + 5] = parseFloat(data[j + 5]);
            if (j == 1) {
                switch (parseFloat(data[0])) {
                    case ShapeType.TRIANGLE:
                        loadedShape = new Triangle([[data[1], data[2]]], new Color(data[3], data[4], data[5]));
                        break;
                    case ShapeType.LINE:
                        loadedShape = new Line([[data[1], data[2]]], new Color(data[3], data[4], data[5]));
                        break;
                    case ShapeType.SQUARE:
                        loadedShape = new Square([[data[1], data[2]]], new Color(data[3], data[4], data[5]));
                        break;
                    case ShapeType.RECTANGLE:
                        loadedShape = new Rectangle([[data[1], data[2]]], new Color(data[3], data[4], data[5]));
                        break;
                    case ShapeType.POLYGON_FAN:
                        loadedShape = new PolygonFan([[data[1], data[2]]], new Color(data[3], data[4], data[5]));
                        break;
                    case ShapeType.POLYGON_STRIP:
                        loadedShape = new PolygonStrip([[data[1], data[2]]], new Color(data[3], data[4], data[5]));
                        break;
                    case ShapeType.Point:
                        loadedShape = new Point([[data[1], data[2]]], new Color(data[3], data[4], data[5]));
                        break;
                    case ShapeType.CONVEX_HULL:
                        loadedShape = new ConvexHull([[data[1], data[2]]], new Color(data[3], data[4], data[5]));
                    default:
                        break;
                }
            }
            else {
                loadedShape.addVertex([data[j], data[j + 1]], [data[j + 2], data[j + 3], data[j + 4]])
            }
        }
        shapes[loadedShape.id] = loadedShape;
        console.log(loadedShape)
    }
    redraw()
}