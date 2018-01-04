var InitWebGL = function() {
	var VSText, FSText;
	loadTextResource('/shaders/vertexShader.glsl')
	.then(function(result) {
		VSText = result;
		return loadTextResource('/shaders/fragmentShader.glsl');
	})
	.then(function(result){
		FSText = result;
		return StartWebGL(VSText, FSText);
	})
	.catch(function(error) {
		alert('Error with loading resources. See console.');
		console.error(error);
	})
}




var StartWebGL = function (vertexShaderText, fragmentShaderText) {
	
	var canvas = document.getElementById('example-canvas');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		alert('Your browser does not support WebGL');
		return;
	}


	canvas.height = gl.canvas.clientHeight;
	canvas.width = gl.canvas.clientWidth;


	gl.viewport(0,0,gl.canvas.width,gl.canvas.height);


	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		alert('Error compiling shader!');
		console.error('Shader error info: ', gl.getShaderInfoLog(vertexShader));
	}
	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		alert('Error compiling shader!');
		console.error('Shader error info: ', gl.getShaderInfoLog(fragmentShader));
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);
	gl.validateProgram(program);

	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('Error validating program ', gl.getProgramInfoLog(program));

		return;
	}


	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	var vertexArray = [
		//   X,   Y
			0.0, 0.5,
			0.5, -0.5,
			-0.5, -0.5
	];

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(program, 'vertexPosition');

	gl.vertexAttribPointer(
		positionAttribLocation, // ссылка на атрибут
		2, // кол-во элементов на 1 итерацию
		gl.FLOAT, // тип данных
		gl.FALSE, // нормализация
		2 * Float32Array.BYTES_PER_ELEMENT, // элементов массива на одну вершину
		0 * Float32Array.BYTES_PER_ELEMENT // отступ для каждой вершины
	);

	gl.enableVertexAttribArray(positionAttribLocation);

	gl.clearColor(0.75, 0.9, 1.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.useProgram(program);
	gl.drawArrays(gl.TRIANGLES, 0, 3);

};


document.addEventListener('DOMContentLoaded', function() {
	InitWebGL();
});