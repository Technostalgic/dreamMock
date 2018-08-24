///		
///		code by Isaiah Smith
///		
///		https://technostalgic.tech	
///		twitter @technostalgicGM
///		

// initialize the global game object
var game = game || {};

// terminalType enumerator
game.terminalType = {
    closed: 0,
    input: 1,
    output: 2
};
// circuit state enumerator
game.circuitStates = {
    building: 0,
    running: 1
};

class circuit{
    constructor(){
        this.grid = [];
        this.circuitState = game.circuitStates.building;
    }

    static fromSize(size){
        var r = new circuit();
        r.setGridSize(size);
        return r;
    }

    // sets the 'grid' to the specified size and fills it with empty components
    setGridSize(x, y){
        // if the user only entered the first parameter as a 2d vector instead of specifying both x and y
        if(!y){
            this.setGridSize(x.x, x.y);
            return;
        }

        // populate the grid with empty components
        this.grid = [];
        for(let gx = 0; gx < x; gx++){
            this.grid[gx] = [];
            for(let gy = 0; gy < y; gy++){
                this.grid[gx][gy] = circuitComponent.getEmpty();
            }
        }
    }
    // iterates through each component in the grid with the specified function
    iterateGrid(func = function(comp, x, y){}){
        for(var x = 0; x < this.grid.length; x++)
            for(var y = 0; y < this.grid[x].length; y++)
                func(this.grid[x][y], x, y);
    }

    //
    startRunning(){
        this.circuitState = game.circuitStates.running;
    }
    stopRunning(){
        this.circuitState = game.circuitStates.building;
    }
    sendPulse(dt = 100){
        if(this.circuitState === game.circuitStates.building)
            return;
        console.log("sending pulse of " + dt.toString() + "ms..");
    }
    sendTrigger(dt = 100){
        if(this.circuitState === game.circuitStates.building)
            return;
        console.log("sending trigger of " + dt.toString() + "ms..");
    }

    getComponentAt(x, y){
        return this.grid[x][y];
    }
    setComponentAt(componentObj, x, y){
        this.grid[x][y] = componentObj;
    }

    // draws all the components in the circuit's grid
    draw(ctx, pos, tileSize = 32){
        this.iterateGrid(
            function(comp, x, y){
                if(!comp) return;
                comp.draw(ctx, pos.plus(new vec2(x * tileSize, y * tileSize)), tileSize);
            });
    }
}

class circuitComponent{
    constructor(){
        this.circuitParent = null;
        this.circuitPosition = null;
        
        this.terminals = {
            left:null, right:null, up:null, down:null
        };
        
        this.powerBank = 0;
        this.powerConsumption = 0;
        this.powerResistance = 0;
        this.powerAmplification = 1;
        this.powerDischargeRate = 1;
    }

    // attaches a componentTerminal to the component
    attachTerminal(terminalObj, dir = null){
        dir = dir || terminalObj.terminalDirection;
        terminalObj.parentComponent = this;
        switch(dir){
            case side.left: this.terminals.left = terminalObj; break;
            case side.right: this.terminals.right = terminalObj; break;
            case side.up: this.terminals.up = terminalObj; break;
            case side.down: this.terminals.down = terminalObj; break;
        }
    }

    // the proper way to add a component to a circuit
    attachToCircuit(circuitObj, x, y){
        if(!y){
            this.attachToCircuit(circuitObj, x.x, x.y);
            return;
        }
        this.circuitParent = circuitObj;
    }
    // gets a list of all the coomponents that this component outputs to
    getOutputComponents(){
        if(!this.circuitParent)
            return [];
        var r = [];
        //TODO: Fill output list 'r'
        return r;
    }
    // gets a list of all the terminals this component is outputting to
    getOutputTerminals(){
        var outComps = this.getOutputComponents();
        var r = [];
        for(var comp of outComps){

        }
        return r;
    }
    // gets a list of all the components that this component receives input from
    getInputComponents(){
        if(!this.circuitParent)inputinput
            return [];
        var r = [];
        //TODO: Fill input list 'r'
        return r;
    }
    // gets a list of all terminals on the component
    getAllTerminals(){
        var r = [];

        if(!!this.terminals.left) r.push(this.terminals.left);
        if(!!this.terminals.right) r.push(this.terminals.right);
        if(!!this.terminals.up) r.push(this.terminals.up);
        if(!!this.terminals.down) r.push(this.terminals.down);

        return r;
    }

    // gathers all the power from the inputs into the power bank
    gatherCurrent(){
        var terms = this.getAllTerminals();
        for(var term of terms){
            if(term.terminalType == game.terminalType.input){
                this.powerBank += term.powerBank;
                term.powerBank = 0;
            }
        }
    }
    // a logic step for the circuit component, gathers input power and sends output power
    stepCurrent(dt){
        this.gatherCurrent();
        this.m_stepCurrent(dt);
    }
    // for override
    m_stepCurrent(dt){}

    static getEmpty(){
        var r = new circuitComponent();
        return r;
    }

    draw(ctx, pos, tileSize){
        var midRadius = 5;
        var terms = this.getAllTerminals();
        
        for(var term of terms)
            term.draw(ctx, pos, tileSize);
        
        var tpos = pos.plus(new vec2(tileSize / 2));
        color.black.setFill(ctx);
        ctx.beginPath();
        ctx.arc(tpos.x, tpos.y, midRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
}

class componentTerminal{
    constructor(){
        this.parentComponent = null;
        this.terminalType = game.terminalType.closed;
        this.terminalDirection = side.none;
        this.powerBank = 0;
        this.terminalID = -1;
    }

    // the proper way to attach a terminal to a component
    attachToComponent(componentObj, dir = null){
        componentObj.attachTerminal(this);
    }

    addPower(pwr){
        this.powerBank += pwr;
    }

    // returns a closed terminal
    static getClosed(componentObj, dir = side.none){
        var r = new componentTerminal();
        r.attachToComponent(componentObj);
        r.terminalDirection = dir;
        return r;
    }

    draw(ctx, pos, tileSize, col = color.getGreyscale(0.2)){
        var maxWidth = 4;
        var minWidth = 2;
        var length = tileSize / 2;

        // swap max with min widths, if the terminalType is input, so that input terminals can be differentiated from output terminals
        var mxW = this.terminalType == game.terminalType.output ? 
            maxWidth : minWidth;
        var mnW = this.terminalType == game.terminalType.output ?
            minWidth : maxWidth;
        
        // how the polygon vertices should be rotated according to the terminalDirection
        var termDir = 0;
        switch(this.terminalDirection){
            case side.left: termDir = Math.PI; break;
            case side.right: termDir = 0; break;
            case side.up: termDir = Math.PI / -2; break;
            case side.down: termDir = Math.PI / 2; break;
        }

        // determine the 4 corners of the polygon
        var tl = new vec2(0, -mxW).rotate(termDir).plus(pos).plus(new vec2(tileSize / 2));
        var tr = new vec2(length, -mnW).rotate(termDir).plus(pos).plus(new vec2(tileSize / 2));
        var br = new vec2(length, mnW).rotate(termDir).plus(pos).plus(new vec2(tileSize / 2));
        var bl = new vec2(0, mxW).rotate(termDir).plus(pos).plus(new vec2(tileSize / 2));

        // draw the polygon
        col.setFill(ctx);
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.closePath();
        ctx.fill();
    }
}