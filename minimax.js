let scores = {
  ai: 1000000,
  human: -1000000,
  tie: 0
};

function evalArr(arr) {
  let aiP = 0;
  let humanP = 0;
  let emptyP = 0;

  for (let i of arr) {
    if (i == ai) aiP++;
    if (i == human) humanP++;
    if (i == "") emptyP++;
  }

  if (aiP == 3 && emptyP == 1) return 100;
  if (aiP == 2 && emptyP == 2) return 10;
  if (aiP == 1 && emptyP == 3) return 1;

  if (humanP == 3 && emptyP == 1) return -100;
  if (humanP == 2 && emptyP == 2) return -10;
  if (humanP == 1 && emptyP == 3) return -1;

  return 0;
}

function evalStaticBoard() {
  let score = 0;

  for (let row of board) {
    for (let j = 0; j < 4; j++) {
      score += evalArr(row.slice(j, j + 4));
    }
  }

  // Vertical
  for (let i = 0; i < 7; i++) {
    let row = [];
    for (let r of board) {
      row.push(r[i]);
    }

    for (let j = 0; j < 3; j++) {
      score += evalArr(row.slice(j, j + 4));
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

      score += evalArr(d);
    }

    // lower diagonal
    for (let i = 0; i < 3; i++) {
      let d = [];
      for (let k = 0; k < 4; k++) {
        d.push(board[i + k][j + k]);
      }

      score += evalArr(d);
    }
  }

  return score;
}

function aiMove() {
  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < 7; i++) {
    let j = getAvailableRow(i);
    if (j != null && board[j][i] == "") {
      board[j][i] = ai;

      let score;
      if (minimaxNormal) {
        score = minimax(board, maxDepth, false);
      } else {
        score = minimaxABP(board, maxDepth, false, -Infinity, Infinity);
      }

      board[j][i] = "";

      if (score >= bestScore) {
        bestScore = score;
        bestMove = {
          i,
          j
        };
      }
    }
  }

  if (bestMove != null) board[bestMove.j][bestMove.i] = ai;
}

function minimax(board, depth, isMaximizing) {
  let nMoves = maxDepth - depth + 1;

  let r = checkWin();
  if (r != null) {
    if (r == human) {
      return scores.human + 20 * nMoves;
    } else if (r == ai) {
      return scores.ai - 20 * nMoves;
    } else if (r == "tie") {
      return scores.tie;
    }
  }

  if (depth == 0) {
    return evalStaticBoard() - 20 * nMoves;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 7; i++) {
      let j = getAvailableRow(i);
      if (j != null && board[j][i] == "") {
        board[j][i] = ai;
        let score = minimax(board, depth - 1, false);
        board[j][i] = "";

        bestScore = max(bestScore, score);
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < 7; i++) {
      let j = getAvailableRow(i);
      if (j != null && board[j][i] == "") {
        board[j][i] = human;
        let score = minimax(board, depth - 1, true);
        board[j][i] = "";

        bestScore = min(bestScore, score);
      }
    }

    return bestScore;
  }
}

function minimaxABP(board, depth, isMaximizing, alpha, beta) {
  let nMoves = maxDepth - depth + 1;

  let r = checkWin();
  if (r != null) {
    if (r == human) {
      return scores.human + 20 * nMoves;
    } else if (r == ai) {
      return scores.ai - 20 * nMoves;
    } else if (r == "tie") {
      return scores.tie;
    }
  }

  if (depth == 0) {
    return evalStaticBoard() - 20 * nMoves;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 7; i++) {
      let j = getAvailableRow(i);
      if (j != null && board[j][i] == "") {
        board[j][i] = ai;
        let score = minimaxABP(board, depth - 1, false, alpha, beta);
        board[j][i] = "";

        bestScore = max(bestScore, score);
        alpha = max(alpha, bestScore);
        if (beta <= alpha) break;
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < 7; i++) {
      let j = getAvailableRow(i);
      if (j != null && board[j][i] == "") {
        board[j][i] = human;
        let score = minimaxABP(board, depth - 1, true, alpha, beta);
        board[j][i] = "";

        bestScore = min(bestScore, score);
        beta = min(beta, bestScore);
        if (beta <= alpha) break;
      }
    }

    return bestScore;
  }
}
