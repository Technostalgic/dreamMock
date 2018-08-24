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
}

class circuit{
    constructor(){
        this.grid = [];
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
        for(let gx = 0; gx < x; x++){
            this.grid[gx] = [];
            for(let gy = 0; gy < y; gy++){
                this.grid[gx][gy] = circuitComponent.getEmpty();
            }
        }
    }

    getComponentAt(x, y){
        return this.grid[x][y];
    }
    setComponentAt(componentObj, x, y){
        this.grid[x][y] = componentObj;
    }
}

class circuitComponent{
    constructor(){
        this.circuitParent = null;
        this.circuitPosition = null;
        
        this.terminals = [];
        
        this.powerBank = 0;
        this.powerConsumption = 0;
        this.powerResistance = 0;
        this.powerAmplification = 1;
    }

    // attaches a terminal to the component
    attachTerminal(terminalObj, dir = null){
        dir = terminalDir || terminalObj.terminalDirection;
        terminalObj.parentComponent = this;
        this.terminals.push(terminalObj);
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
    // gets a list of all the components that this component receives input from
    getInputComponents(){
        if(!this.circuitParent)inputinput
            return [];
        var r = [];
        //TODO: Fill input list 'r'
        return r;
    }

    // a logic step for the circuit component, gathers input power and sends output power
    stepCurrent(){
        
    }

    static getEmpty(){
        return new circuitComponent();
    }
}

class componentTerminal{
    constructor(){
        this.parentComponent = null;
        this.type = game.terminalType.closed;
        this.terminalDirection = side.none;
        this.powerBank = 0;
        this.terminalID = -1;
    }

    // the proper way to attach a terminal to a component
    attachToComponent(componentObj, dir = null){
        this.parentComponent = componentObj;
        if(!!dir) this.terminalDirection = dir;
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
}