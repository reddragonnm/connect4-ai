let board = [
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '']
]

let radius = 25;
let mult;
let off = 35;

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
  frameRate(10);

  mult = width / 7;

  skipButton = createButton("Skip turn");
  skipButton.mousePressed(() => {
    currentPlayer = ai;
  })

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
  maxDepth = Number(depthSel.value());
}

function draw() {
  background(200);

  let x = floor(map(mouseX, 0, width, 0, 7));
  let x2 = floor(map(pmouseX, 0, width, 0, 7));
  noStroke();
  fill(255, 255, 0);
  rect(x * mult, 0, mult, height);
  fill(255, 255, 0, 125);
  rect(x2 * mult, 0, mult, height);

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
      text('Human won!', width / 2, height / 2);
    else if (w == ai)
      text('AI won!', width / 2, height / 2);
    else if (w == 'tie')
      text('Tie!', width / 2, height / 2);

    gameOver = true;
  }
}

function showBoard() {
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

  let os = 0;
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 7; j++) {
      if (board[i][j] == '') os++;
    }
  }

  if (winner == null && os == 0)
    winner = 'tie';

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
