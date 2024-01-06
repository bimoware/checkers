class Checkers {
  constructor() {
    this.matrix = [
      [0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 0, 1, 0],
      [0, 1, 0, 1, 0, 1, 0, 1],
      null,
      null,
      [0, 2, 0, 2, 0, 2, 0, 2],
      [2, 0, 2, 0, 2, 0, 2, 0],
      [0, 2, 0, 2, 0, 2, 0, 2],
    ].map((r) => r || new Array(8).map((_) => 0));
    this.moves = 0;
  }
  get playersTurn() {
    return [1, 2][moves % 2];
  }
  startGrid() {
    let grid = document.getElementById("grid");
    this.forEachBox((game,row, column) => {
      let box = document.createElement("div");
      box.id = `${row}${column}`;
      box.className = "case color" + ((row - column) % 2 ? 2 : 1);
      grid.appendChild(box);
    });
    return this;
  }
  placePieces() {
    // TODO: remove all pieces from every div before placing
    // TODO: only change what's necessary
    this.forEachBox((game, row, column) => {
      let thisPosition = game.matrix[row][column];
      if (thisPosition) {
        let elem = document.getElementById(`${row}${column}`);
        let piece = document.createElement("img");
        piece.src = "./" + ["noir", "rouge"][thisPosition - 1] + ".png";
        elem.appendChild(piece);
      }
    });
    return this;
  }
  forEachBox(func) {
    for (let row in Array.from(Array(8))) {
      for (let column in Array.from(Array(8))) {
        func(game,row, column);
      }
    }
  }
}

let game = new Checkers();
game.startGrid().placePieces();
