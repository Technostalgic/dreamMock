///		
///		code by Isaiah Smith
///		
///		https://technostalgic.tech	
///		twitter @technostalgicGM
///		

// initialize the global game object
var game = game || {};

function startGameLoop(){
	requestAnimationFrame(gameStep);
}

// initialize the game variables
function initGameVars(){
	// game's native canvas size = 500 x 500
	game.nativeResolution = new vec2(500);
	
	// initialize the timekeeping variables
	game.timestamp = performance.now();
	game.lastTimestamp = game.timestamp;

	// scaling canvas is the canvas element that will appear on the HTML document
	game.scalingCanvas = document.createElement("canvas");
	game.scalingCanvas.width = game.nativeResolution.x;
	game.scalingCanvas.height = game.nativeResolution.y;
	// context for scaling canvas so it can be written to
	game.scalingContext = game.scalingCanvas.getContext("2d");

	// render canvas is the canvas element that all the graphics will be drawn to, then it will be resized to fit the scaling canvas
	game.renderCanvas = document.createElement("canvas");
	game.renderCanvas.width = game.nativeResolution.x;
	game.renderCanvas.height = game.nativeResolution.y;
	// context for the render canvas so it can be written to
	game.renderContext = game.renderCanvas.getContext("2d");

	// Stuff for testing the circuits
	game.initialCircuit = circuit.fromSize(new vec2(10));
}

function getDT(){
	// returns the time passed between this and the previous step
	return game.timestamp - game.lastTimestamp;
}
function gameStep(){
	var dt = getDT();

	logicStep(dt);
	renderStep();
	requestAnimationFrame(gameStep);
	
	game.lastTimestamp = game.timestamp;
	game.timestamp = performance.now();
}
function logicStep(dt){
}
// handles logic that has to do with rendering
function renderStep(){
	// draw the test circuit
	game.initialCircuit.draw(game.renderContext, new vec2(10), 32);

	// paste the render canvas onto the scaling canvas with the corrected size
	game.scalingContext.drawImage(
		game.renderCanvas, 
		0, 0, 
		game.scalingCanvas.width, game.scalingCanvas.height
	);

	game.renderContext.fillStyle = "#FFF";
	game.renderContext.fillRect(0, 0, game.nativeResolution.x, game.nativeResolution.y);
}