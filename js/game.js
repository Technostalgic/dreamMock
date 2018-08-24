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
	// initializes the control state
	controlState.init();
	game.controlHoldUp = false;

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

	// set the scaling ratio for the control state so that mouse events are correctly positioned
	controlState.setScalingRatio(game.nativeResolution, new vec2(
		game.scalingCanvas.width, 
		game.scalingCanvas.height
	));

	// Stuff for testing the circuits
	game.initialCircuit = circuit.fromSize(new vec2(10, 6));
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
	handleInitialCircuitControls();
}

// handles logic that has to do with rendering
function renderStep(){
	// draw the test circuit
	game.initialCircuit.draw(game.renderContext, new vec2(50, 50), 32);
	drawInitialCircuitControls(game.renderContext, new vec2(25, 400));

	// paste the render canvas onto the scaling canvas with the corrected size
	game.scalingContext.drawImage(
		game.renderCanvas, 
		0, 0, 
		game.scalingCanvas.width, game.scalingCanvas.height
	);

	game.renderContext.fillStyle = "#FFF";
	game.renderContext.fillRect(0, 0, game.nativeResolution.x, game.nativeResolution.y);
}

function handleInitialCircuitControls(controlstate = controlState){
	if(game.controlHoldUp){
		if(!(controlState.isKeyDown(90) ||
			controlState.isKeyDown(88) ||
			controlState.isKeyDown(67) ))
			game.controlHoldUp = false;
		return;
	}
	// z
	if(controlstate.isKeyDown(90)){
		if(game.initialCircuit.circuitState == game.circuitStates.running)
			game.initialCircuit.stopRunning();
		else
			game.initialCircuit.startRunning();
		game.controlHoldUp = true;
	}
	// x
	if(controlstate.isKeyDown(88)){
		if(game.initialCircuit.circuitState == game.circuitStates.building)
			return;
		game.initialCircuit.sendPulse();
		game.controlHoldUp = true;
	}
	// c
	if(controlstate.isKeyDown(67)){
		if(game.initialCircuit.circuitState == game.circuitStates.building)
			return;
		game.initialCircuit.sendTrigger();
		game.controlHoldUp = true;
	}
}

function drawInitialCircuitControls(ctx, pos){
	switch(game.initialCircuit.circuitState){
		case game.circuitStates.building:
			this.drawControls_building(ctx, pos);
			break;
		case game.circuitStates.running:
			this.drawControls_running(ctx, pos);
			break;
	}
}
function drawControls_building(ctx, pos){
	ctx.textAlign = "center";
	ctx.font = "16px sans-serif";
	
	// draw the 'run' control
	var runBox = new collisionBox(pos, new vec2(80, 40));
	runBox.drawOutline(ctx, color.black, 2)
	runBox.drawFill(ctx, color.grey);
	ctx.fillStyle = color.black.toHex();
	ctx.fillText("Run (z)", pos.x + 40, pos.y + 28);
}
function drawControls_running(ctx, pos){
	var off = new vec2();
	ctx.textAlign = "center";
	ctx.font = "16px sans-serif";

	// draw the 'stop' control
	var runBox = new collisionBox(pos, new vec2(80, 40));
	runBox.drawOutline(ctx, color.black, 2)
	runBox.drawFill(ctx, color.grey);
	ctx.fillStyle = color.black.toHex();
	ctx.fillText("Stop (z)", pos.x + 40, pos.y + 28);
	off.x += 100;

	// draw the 'pulse' control
	var pulseBox = new collisionBox(pos.plus(off), new vec2(80, 40));
	pulseBox.drawOutline(ctx, color.black, 2)
	pulseBox.drawFill(ctx, color.grey);
	ctx.fillStyle = color.black.toHex();
	ctx.fillText("Pulse (x)", pos.x + off.x + 40, pos.y + off.y + 28);
	off.x += 100;

	// draw the 'trigger' control
	var pulseBox = new collisionBox(pos.plus(off), new vec2(80, 40));
	pulseBox.drawOutline(ctx, color.black, 2)
	pulseBox.drawFill(ctx, color.grey);
	ctx.fillStyle = color.black.toHex();
	ctx.fillText("Trigger (c)", pos.x + off.x + 40, pos.y + off.y + 28);
	off.x += 100;
}