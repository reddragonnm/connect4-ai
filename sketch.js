let board = [
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '']
]

let human = 'r';
let ai = 'b';
let currentPlayer = human;

let depthSel;
let maxDepth = 5;
let minimaxMode;
let minimaxNormal = true;

let gameOver = false;

function setup() {
  createCanvas(500, 450);

  createP('Depth: ');
  depthSel = createSelect();
  for (let i = 2; i < 9; i++) {
    depthSel.option(i);
  }
  depthSel.selected(5);
  depthSel.changed(depthChangeEvent);

  createP('Minimax Mode: ');
  minimaxMode = createSelect();
  minimaxMode.option('Normal');
  minimaxMode.option('Alpha Beta Pruning');
  minimaxMode.selected('Normal');
  minimaxMode.changed(minimaxModeChange);
}

function minimaxModeChange() {
  let t = minimaxMode.value();
  minimaxNormal = (t == 'Normal');
}

function depthChangeEvent() {
  maxDepth = depthSel.value();
}

function draw() {
  background(200);

  showBoard();
  manageWin();

  if (currentPlayer == ai && !gameOver) {
    aiMove();
    currentPlayer = human;
  }
}

function mousePressed() {
  let colN = floor(map(mouseX, 0, width, 0, 7));
  let rowN = getAvailableRow(colN);

  if (currentPlayer == human && rowN != null && !gameOver && 0 < mouseX && mouseX < width && 0 < mouseY && mouseY < height) {
    board[rowN][colN] = human;
    currentPlayer = ai;
  }
}

function manageWin() {
  let w = checkWin();
  if (w != null) {
    textAlign(CENTER);
    textSize(50);
    fill(0);
    if (w == human)
      text('Human won!', width/2, height/2);
    else if (w == ai)
      text('AI won!', width/2, height/2);
    else if (w == 'tie')
      text('Tie!', width/2, height/2);

    gameOver = true;
  }
}

function showBoard() {
  let mult = width/7;
  let off = 35;
  let radius = 25;

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      let t = board[i][j];

      if (t == '')
        fill(255);
      else if (t == 'r')
        fill(255, 0, 0)
      else if (t == 'b')
        fill(0, 0, 255);

      stroke(0);
      strokeWeight(2);
      circle(
        j * mult + off,
        i * mult + off,
        radius * 2
      );
    }
  }
}

function setOf(arr) {
  let newArr = [];
  for (let i of arr) {
      if (!newArr.includes(i))
        newArr.push(i);
  }
  return newArr;
}

function same4(arr) {
  for (let i of arr) {
    if (i == '') return false;
  }

  if (arr.length != 4)
    throw `same4: arr length is not 4 - [${arr}]`;

  return (setOf(arr).length == 1);
}

function checkWin() {
  let winner;

  // Horizontal
  for (let row of board) {
    for (let j = 0; j < 4; j++) {
      if (same4(row.slice(j, j + 4)))
        winner = row[j];
    }
  }

  // Vertical
  for (let i = 0; i < 7; i++) {
    let row = [];
    for (let r of board) {
      row.push(r[i]);
    }

    for (let j = 0; j < 3; j++) {
      if (same4(row.slice(j, j + 4)))
        winner = row[j];
    }
  }

  // Diagonal
  for (let j = 0; j < 4; j++) {
    // upper diagonal
    for (let i = 3; i < 6; i++) {
      let d = [];
      for (let k = 0; k < 4; k++) {
        d.push(board[i - k][j + k]);
      }

      if (same4(d)) {
        winner = d[0];
      }
    }

    // lower diagonal
    for (let i = 0; i < 3; i++) {
      let d = [];
      for (let k = 0; k < 4; k++) {
        d.push(board[i + k][j + k]);
      }

      if (same4(d)) {
        winner = d[0];
      }
    }
  }

  return winner;
}

function getAvailableRow(col) {
  let row;

  for (let i = 0; i < 6; i++) {
    if (board[i][col] == '')
      row = i;
  }

  return row;
}
