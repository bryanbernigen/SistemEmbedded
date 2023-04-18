//Variable Declaration and Initialization 
var canvas = document.getElementById("canvas");
var gl = canvas.getContext("webgl2");
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
var program = gl.createProgram();
var vertexBuffer = gl.createBuffer();
var positionAttribLocation;
var colorAttribLocation;
var shadderSource;


//Initialize the WebGL
function init() {
    //Check if webgl is supported
    if (!gl) {
        alert("WebGL is not supported");
        return;
    }

    //Set the Canvas
    gl.clearColor(0.9296875, 0.91015625, 0.8515625, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Create Shadder
    const shadderSource = {
        vertexShaderSource: `#version 300 es
        in vec2 vertPosition;
        in vec4 vertColor;
        out vec4 fragColor;
    
        void main() {
            fragColor = vertColor;
            gl_PointSize = 20.0;
            gl_Position = vec4(vertPosition, 0, 1);
        }`,

        fragmentShaderSource: `#version 300 es
        precision mediump float;
        in vec4 fragColor;
        out vec4 outColor;
    
        void main() {
            outColor = fragColor;
        }`
    }
    gl.shaderSource(vertexShader, shadderSource.vertexShaderSource);
    gl.shaderSource(fragmentShader, shadderSource.fragmentShaderSource);

    //Compile Shadder
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    //Attach Shadder
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    //Link Shadder
    gl.linkProgram(program);

    //Bind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    // Create Position Attribute
    positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
    gl.vertexAttribPointer(
        positionAttribLocation,
        2,                                      //2 float per vertex (XY)
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,     //1 vertex = 6 float (XYRGBA)
        0                                       //Position start from the first element
    );

    // Create Color Attribute
    colorAttribLocation = gl.getAttribLocation(program, "vertColor");
    gl.vertexAttribPointer(
        colorAttribLocation,
        4,                                      //4 float per vertex (RGBA)
        gl.FLOAT,
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT,     //1 vertex = 6 float (XYRGBA)
        2 * Float32Array.BYTES_PER_ELEMENT      //Color start from the third element
    );

    //Enable the attribute
    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    //Enable transparency
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //Start the program
    gl.useProgram(program);
}

//Initialize the WebGL
init();