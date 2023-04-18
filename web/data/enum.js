//Define
const epsilon = 0.05;

//Enum Shape type
const ShapeType = {
    TRIANGLE: 0,
    LINE: 1,
    SQUARE: 2,
    RECTANGLE: 3,
    POLYGON_FAN: 4,
    POLYGON_STRIP: 5,
    POINT: 6,
    CONVEX_HULL: 7,
    ANIMATE: 8
}

//Enum Mode
const ModeType = {
    DRAW: 0,
    MOVE: 1,
    DELETE: 2,
    DILATATE: 3,
    ROTATE: 4,
    CHANGECOLOR: 5,
    ADD: 6
}

const RectangleResizeMode = {
    HORIZONTAL: 0,
    VERTICAL: 1
}