let grid = document.getElementById('grid')
for(let row in Array.from(Array(8))){
    for(let column in Array.from(Array(8))){
        console.log(row,column)
        let box = document.createElement('div')
        box.className = "case"
        box.innerText = "e"
        grid.appendChild(box)
    }
}