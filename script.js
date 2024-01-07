let i = 0;

class Piece {
  constructor(pos, player) {
    this.id = i++;
    this.pos = pos; // [row, column]
    this.player = player;
  }
  get color() {
    return ["black", "red"][this.player - 1];
  }
  setElement(elem) {
    this.element = elem;
  }
  directions() {
    return [
      // Up [left,right]
      [
        [this.pos[0] - 1, this.pos[1] - 1],
        [this.pos[0] + 1, this.pos[1] - 1],
      ],
      // Down [left,right]
      [
        [this.pos[0] - 1, this.pos[1] + 1],
        [this.pos[0] + 1, this.pos[1] + 1],
      ],
    ];
  }
}

let baseMatrix = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  null,
  null,
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
]
  .map((r) => r || new Array(8).map((_) => 0))
  .map((r, rId) =>
    r.map((p, cId) => ([1, 2].includes(p) ? new Piece([rId, cId], p) : null))
  );

class Checkers {
  constructor() {
    this.matrix = baseMatrix;
    this.moves = [];
  }
  get player() {
    return [1, 2][moves.length % 2];
  }
  makePlayerCursorAvailable() {
    this.forEachBox((game, [row, column]) => {
      let piece = game.matrix[row][column];
      if (piece) {
        if (piece.player !== game.player) piece.setAvailability(false);
      }
    });
  }
  startGrid() {
    let grid = document.getElementById("grid");
    this.forEachBox((game, [row, column]) => {
      let box = document.createElement("div");
      box.id = `box-${row}${column}`;
      box.className = "case color" + ((row - column) % 2 ? 2 : 1);
      box.setAttribute("ondrop", "drop(event)");
      box.setAttribute("ondragover", "allowDrop(event)");
      grid.appendChild(box);
    });
    return this;
  }
  placePieces() {
    // TODO: remove all pieces from every div before placing
    // TODO: only change what's necessary
    this.forEachBox((game, [row, column]) => {
      let piece = game.matrix[row][column];
      if (piece) {
        let elem = document.getElementById(`box-${row}${column}`);
        let pieceImg = document.createElement("img");
        pieceImg.src = `./${piece.color}.png`;
        pieceImg.id = `piece-${piece.id}`;
        pieceImg.setAttribute("draggable", true);
        pieceImg.setAttribute("ondragstart", "drag(event)");

        piece.setElement(pieceImg);
        elem.appendChild(pieceImg);
      }
    });
    return this;
  }
  forEachBox(func) {
    for (let row in Array.from(Array(8))) {
      for (let column in Array.from(Array(8))) {
        func(game, [row, column]);
      }
    }
  }
  movesForPiece([row, column]) {
    let piece = this.matrix[row][column];
    if (!piece)
      throw new Error(`No element at row ${row + 1} and column ${column + 1}`);
  }
  selectPiece([row, column]) {
    this.selectedPiece = [row, column];
  }
  //   canMoveDiagonally([row, column]) {
  //     let current = this.matrix[row][column];
  //     let isBlack = current === 1;
  //     let diagnals = [false, false];
  //     let leftCoor = this.boxDiagonalTo([row,column])[isBlack ? "down": "up"]["left"]
  //     let left = this.matrix[leftCoor[0]]?.[leftCoor[1]];
  //     if (typeof left !== "number") diagnals = false;
  //     else {
  //       if (!left) diagnals[0] = true;
  //       else if (left !== current) {
  //         let leftCoor2 = this.boxDiagonalTo(leftCoor)[isBlack ? "down": "up"]["left"];
  //         let left2 = this.matrix[leftCoor2[0]]?.[leftCoor2[1]]
  //         if(left2 === 0)
  //       }
  //     }
  // -- aprés jfait une boucle 2 elements -1 ** i (negatif/positif)
  //     let right = this.matrix[row + (isBlack ? 1 : -1)]?.[column + 1];
  //   }
}

let game = new Checkers();
game.startGrid().placePieces();

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

function allowDrop(ev) {
  console.log(ev)
  ev.preventDefault();
}
