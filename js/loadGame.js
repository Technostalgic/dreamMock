///		
///		code by Isaiah Smith
///		
///		https://technostalgic.tech	
///		twitter @technostalgicGM
///		

// initialize the global game object
var game = game || {};

// loads all the game scripts onto the HTML document
function loadGame(){
	// load the vec2 game script
	var script_vec2 = document.createElement("script");
	script_vec2.src = "./js/vec2.js";
	// load the main game script
	var script_game = document.createElement("script");
	script_game.src = "./js/game.js";

	// append the scripts to the HTML document
	document.head.appendChild(script_game);
	document.head.appendChild(script_vec2);
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
window.addEventListener("load", initialize);