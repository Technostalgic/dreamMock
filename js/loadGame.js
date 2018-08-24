///		
///		code by Isaiah Smith
///		
///		https://technostalgic.tech	
///		twitter @technostalgicGM
///		

// initialize the global game object
var game = game || {};

function loadGame(){
	loadScripts();
}

// loads all the game scripts onto the HTML document
function loadScripts(){
	// load the vec2 game script
	var script_vec2 = document.createElement("script");
	script_vec2.src = "./js/vec2.js";
	// load the main game script
	var script_game = document.createElement("script");
	script_game.src = "./js/game.js";
	// load the circuitry script
	var script_circuit = document.createElement("script");
	script_circuit.src = "./js/circuit.js";

	// append the scripts to the HTML document
	document.head.appendChild(script_circuit);
	document.head.appendChild(script_vec2);
	document.head.appendChild(script_game);
}
// initailizes all the variables from the scripts that are loaded{
function initScripts() {
	initGameVars();
}

// appends the scaling canvas to the HTML document
function createCanvas(){
	if(!game.scalingCanvas){
		console.log("Canvas not yet initialized! Canvas creation aborted");
		return;
	}

	// add scaling canvas
	document.body.appendChild(game.scalingCanvas);
	console.log("Scaling canvas successfully appended to HTML body!");
}

// initializes the game data in the correct order to avoid conflicts
function initialize(){
	initGameVars();
	createCanvas();

	startGameLoop();
}

// =================================================================================================
window.addEventListener("load", function(){
	setTimeout(initialize);
});