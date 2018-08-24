///
///	code by Isaiah Smith
///
///	https://technostalgic.tech
///	twitter @technostalgicGM
///

// enumerates all the different actions performed by triggering a control
var controlAction = {
	none: -1,
	left: 0,
	right: 1,
	up: 2,
	down: 3,
	quickDrop: 4,
	nudgeDown: 5,
	rotateCW: 6,
	rotateCCW: 7,
	swap: 8,
	select: 9,
	pause: 10
}

class controlState{
	static init(){
		// initializes the static fields of controlState
		console.log("initializing controlState...");
		controlState.keys = [];
		controlState.mouseDown = false;
		controlState.mousePos = new vec2();
		controlState.controls = {};
		controlState.controlChangeListener = null;
		
		controlState.touchStartPos = null;
		controlState.touchStartTime = null;
		controlState.touchPos = null;
		controlState.currentTouchID = null;
		controlState.touchList = [];

		controlState.scalingRatio = new vec2(1);

		this.attachEventListeners();
	}
	// sets the scaling ratio so that the mouse events are properly positioned if the canvas is being rescaled
	static setScalingRatio(nativeSize, targetSize){
		controlState.scalingRatio = new vec2(
			targetSize.x / nativeSize.x,
			targetSize.y / nativeSize.y
		);
	}

	static attachEventListeners(){
		document.addEventListener("mousemove", controlState.handleMouseMove);
		document.addEventListener("mousedown", controlState.handleMouseDown);
		document.addEventListener("mouseup", controlState.handleMouseUp);
		document.addEventListener("keydown", controlState.handleKeyDown);
		document.addEventListener("keyup", controlState.handleKeyUp);
	}

	static handleMouseMove(e){
		// the event listener that is triggered when the mouse is moved
		var fixedPos = new vec2(e.offsetX, e.offsetY);
		
		// adjust for the size of the canvas if it's different from the native resolution
		fixedPos.x /= controlState.scalingRatio.x; //scalingTarget.width / nativeResolution.x;
		fixedPos.y /= controlState.scalingRatio.y; //scalingTarget.height / nativeResolution.y;
		
		controlState.mousePos = fixedPos;
	}
	static handleMouseDown(e){
		// the event listener that is triggered when the mouse is pressed
		controlState.mouseDown = true;
	}
	static handleMouseUp(e){
		// the event listener that is triggered when the mouse is released
		controlState.mouseDown = false;
		console.log("mouse click at: " + new vec2(e.offsetX, e.offsetY));
	}
	static handleKeyDown(e){
		// the event listener that is triggered when a keyboard key is pressed
		console.log(e.key.toString() + ": " + e.keyCode.toString());
		if(!e.keyCode) return;
		controlState.keys[e.keyCode] = true;
		
		var a = controlState.getControlsForKey(e.keyCode);
	}
	static handleKeyUp(e){
		// the event listener that is triggered when a keyboard key is released
		if(!e.keyCode) return;
		controlState.keys[e.keyCode] = false;
	}

	static handleTouchStart(e){
		for(let touch of e.touches){
			if(!controlState.touchList.includes(touch)){
				controlState.touchList.push(touch);
				
				// if there is no active touch, make this the currently active touch
				if(!controlState.currentTouchID){
					controlState.currentTouchID = touch.identifier;
					controlState.touchStartTime = timeElapsed;
				
					// calculate the touch's in-game position
					controlState.touchStartPos = clientToOffsetPos(new vec2(touch.clientX, touch.clientY));
					controlState.touchStartPos.x /= scalingTarget.width / nativeResolution.x;
					controlState.touchStartPos.y /= scalingTarget.height / nativeResolution.y;
					controlState.touchPos = controlState.touchStartPos.clone();
				}
			}
		}
	}
	static handleTouchMove(e){
		e.preventDefault(); // disable touch scrolling
		
		for(let i = e.touches.length - 1; i >= 0; i--){
			if(e.touches[i].identifier == controlState.currentTouchID){
				// calculate the touch's in-game position
				var tpos = clientToOffsetPos(new vec2(e.touches[i].clientX, e.touches[i].clientY));
				tpos.x /= scalingTarget.width / nativeResolution.x;
				tpos.y /= scalingTarget.height / nativeResolution.y;
				
				controlState.touchPos = tpos.clone();
				break;
			}
		}
	}
	static handleTouchEnd(e){
		e.preventDefault(); // disable touch clicking and right-clicking
		
		// remove the touch object that ended from the controlState.touchList
		for(let i = controlState.touchList.length - 1; i >= 0; i--){
			if(!touchListIncludes(e.touches, controlState.touchList[i])){
				
				// if it's the currently active touch, reset the flags and call the gamestate touchEnd fuction
				if(controlState.touchList[i].identifier == controlState.currentTouchID){	
					controlState.currentTouchID = null;
					controlState.touchStartPos = null;
					controlState.touchStartTime = null;
				}
				controlState.touchList.splice(i, 1);
			}
		}
	}
	static handleTouchCancel(e){
		for(let i = controlState.touchList.length - 1; i >= 0; i--){
			if(!touchListIncludes(e.touches, controlState.touchList[i])){
				if(controlState.touchList[i].identifier == controlState.currentTouchID){
					controlState.currentTouchID = null;
					controlState.touchStartPos = null;
					controlState.touchStartTime = null;
				}
				controlState.touchList.splice(i, 1);
			}
		}
	}
	
	static getTouchDuration(){
		if(!controlState.touchStartTime)
			return null;
		return timeElapsed - controlState.touchStartTime;
	}
	
	static isKeyDown(keyCode){
		// checks to see if a key is currently pressed
		return(!!controlState.keys[keyCode]);
	}
	static isControlDown(action = controlAction.none){
		// checks to see if a control action is currently being triggered
		var key = Object.keys(controlAction)[action + 1];
		
		switch(action){
			case controlAction.select: return (controlState.isKeyDown(controlState.controls.select) || 
				controlState.isKeyDown(13)); // non-overridable default key 'enter'
			case controlAction.pause: return (controlState.isKeyDown(controlState.controls.pause) || 
				controlState.isKeyDown(27)); // non-overridable default key 'escape'
			default:
				return controlState.isKeyDown(controlState.controls[key]);
			
		}
		return false;
	}
	
	static getControlKeyName(controlaction){
		// returns the name of a key that is bound tot the specified control action
		return controlState.keyCodeToName( 
			controlState.controls[(Object.keys(controlState.controls)[controlaction])] 
		);
	}
	static keyCodeToName(code){
		//parses a keyCode and converts it into understandable text, used to display player controls
		if(code >= 65 && code <= 90)
			return String.fromCharCode(code);
		if(code >= 48 && code <= 57)
			return (code - 48).toString();
		if(code >= 96 && code <= 105)
			return "kp " + (code - 96).toString();
		switch(code){
			case -1: return ":::";
			case 0: return "none";
			case 8: return "backspc";
			case 13: return "enter";
			case 37: return "left arw";
			case 39: return "right arw";
			case 40: return "down arw";
			case 38: return "up arw";
			case 17: return "ctrl";
			case 16: return "shift";
			case 27: return "escape"
			case 32: return "space";
			case 219: return "l brckt";
			case 221: return "r brckt";
			case 191: return "backslash";
			case 220: return "fwdslash";
			case 190: return "period";
			case 186: return "semicolon";
			case 222: return "apstrophe";
			case 188: return "comma";
		}
		return "key" + code.toString();
	}
	static setControls(controls){
		// sets the key bindings to the specified controls
		controlState.controls = controls;
	}
	static resetControlChangeListener(){
		// used when the player presses a key to change a keybinding
		// removes the controlChangeListener from 'keydown' so that future keypresses are not binded
		window.removeEventListener("keydown", controlState.controlChangeListener);
		// resets the focus on the gamestate so the user can navigate the menu again
	}
	
	static getAllControls(){
		// returns a list of all the keys currently bound to control actions
		return [
			controlState.controls.left,
			controlState.controls.right,
			controlState.controls.up,
			controlState.controls.down,
			controlState.controls.quickDrop,
			controlState.controls.nudgeDown,
			controlState.controls.rotateCW,
			controlState.controls.rotateCCW,
			controlState.controls.select,
			controlState.controls.pause
		];
	}
	static getControlsForKey(keycode){
		// returns all the control actions currently bound to a specified key
		var r = [];
		
		Object.keys(controlState.controls).forEach(function(key){
			if(controlState.controls[key] == keycode)
				r.push(controlAction[key]);
		});
		
		// non-overridable default keys 'enter' and 'escape' bound to actions 'select' and 'pause'
		if(keycode == 13) {
			if(!r.includes(controlAction.select))
				r.push(controlAction.select);
		}
		else if (keycode == 27)
			if(!r.includes(controlAction.pause))
				r.push(controlAction.pause);
		
		return r;
	}
}