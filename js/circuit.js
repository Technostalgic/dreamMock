///		
///		code by Isaiah Smith
///		
///		https://technostalgic.tech	
///		twitter @technostalgicGM
///		

// initialize the global game object
var game = game || {};

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
}

class circuitComponent{
    constructor(){
    }

    static getEmpty(){
        return new circuitComponent();
    }
}