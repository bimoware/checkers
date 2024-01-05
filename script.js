let grid = document.getElementById('grid')
for(let row in Array.from(Array(8))){
    for(let column in Array.from(Array(8))){
        console.log(row,column)
        let box = document.createElement('div')
        box.id = `${row}${column}`
        box.className = "case color"+(((row - column) %2) ? 2 : 1);
        grid.appendChild(box)
    }
}

class Checkers {
    constructor(){
        this.matrix = [
            [0,1,0,1 ,0,1,0,1],
            [1,0,1,0 ,1,0,1,0],
            [0,1,0,1 ,0,1,0,1],
            null,
            null,
            [0,2,0,2 ,0,2,0,2],
            [2,0,2,0 ,2,0,2,0],
            [0,2,0,2 ,0,2,0,2],
        ]
        
    }
}