let i = 0;

class Piece {
  constructor(pos, player) {
    this.id = i++;
    this.pos = pos; // [row, column]
    this.player = player;
    /**
     * @type {HTMLElement}
     */
    this.element = null;
  }
  get color() {
    return ["black", "red"][this.player - 1];
  }
  setPlayer(player) {
    this.element.src = `./${["red", "black"][player - 1]}.png`;
    this.player = [2, 1][player - 1];
  }
  setElement(elem) {
    this.element = elem;
  }
  getDirections() {
    return [
      // Up [left,right]
      [
        [this.pos[0] - 1, this.pos[1] - 1],
        [this.pos[0] - 1, this.pos[1] + 1],
      ],
      // Down [left,right]
      [
        [this.pos[0] + 1, this.pos[1] - 1],
        [this.pos[0] + 1, this.pos[1] + 1],
      ],
    ];
  }
  delete() {
    this.element.remove();
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

// ---

class Checkers {
  constructor() {
    this.matrix = baseMatrix;
    this.moves = [];
  }
  get player() {
    return [1, 2][this.moves.length % 2];
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
      box.className = `case ${(row - column) % 2 ? "color" : ""}`;
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
        pieceImg.setAttribute("onclick", "clicked(event)");
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
  getBoxOf([row, column]) {
    return document.querySelector("#box-" + row + column);
  }
  get allPieces() {
    return this.matrix.flat().filter(Boolean);
  }
  arePositionsEqual(pos1, pos2) {
    return pos1.every((p, i) => p == pos2[i]);
  }
  showShadow(multiplePos) {
    /**
     * @type {HTMLDivElement}
     */
    this.forEachBox((game, pos) => {
      let elem = this.getBoxOf(pos);
      console.log({ pos, elem, multiplePos });
      if (!elem) return;
      if (multiplePos.some((p) => this.arePositionsEqual(p, pos))) {
        console.log("✅✅✅✅✅✅✅✅✅ Ajouter le shadow");
        elem.className = elem.className.replace(" shadow", "") + " shadow";
      } else {
        console.log("----");
        elem.className = elem.className.replace(" shadow", "");
      }
    });
  }
  getMovesFor([row, column]) {
    // Temporary
    return this.matrix[row][column].getDirections();
  }
  showMovesFor([row, column]) {
    this.showShadow(this.getMovesFor([row, column]));
  }
  getPieceFor(img) {
    return this.matrix.flat().find((p) => p?.element.id === img.id);
  }
  delete(piece) {
    piece.delete();
    this.matrix[piece.pos[0]][piece.pos[1]] = null;
  }
}

let game = new Checkers();
game.startGrid().placePieces();

function drag(ev) {
  let img = ev.target;
  game.showMovesFor(game.getPieceFor(img).pos);
  ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("text");
  ev.target.appendChild(document.getElementById(data));
}

function allowDrop(ev) {
  let dropElem = ev.toElement;
  if (!["color", "case"].every((c) => dropElem.className.includes(c))) return;
  if (dropElem.children.length) return;
  return ev.preventDefault();
}

function clicked(ev) {
  let elem = ev.target
  let piece = game.getPieceFor(ev.target);
  if (piece) {
    // Piece
    let { player } = piece;
    if (player === 1) piece.setPlayer(2);
    if (player === 2) game.delete(piece);
  } else {
    // Case
    let [row,column] = elem.id.split('-').split('').map(Number); 
    piece = new Piece([row,column],1)
    elem.appendChild(piece)
    game.matrix[row][column] = piece;
  }
}
