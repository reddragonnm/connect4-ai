let scores = {
  ai: 1,
  human: -1,
  tie: 0
};

function aiMove() {

  let bestScore = -Infinity;
  let bestMove;

  for (let i = 0; i < 7; i++) {
    let j = getAvailableRow(i);
    if (j != null && board[j][i] == '') {
      board[j][i] = ai;

      let score;
      if (minimaxNormal) {
        score = minimax(board, maxDepth, false);
      }
      else {
        score = minimaxABP(board, maxDepth, false, -Infinity, Infinity);
      }

      board[j][i] = '';

      if (score >= bestScore) {
        bestScore = score;
        bestMove = {i, j};
      }
    }
  }

  if (bestMove != null) board[bestMove.j][bestMove.i] = ai;
}

function minimax(board, depth, isMaximizing) {
  let r = checkWin();
  if (r != null) {
    if (r == human)
      return scores.human;
    else if (r == ai)
      return scores.ai;
    else if (r == 'tie')
      return scores.tie;
  }

  if (depth == 0) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 7; i++) {
      let j = getAvailableRow(i);
      if (j != null && board[j][i] == '') {

        board[j][i] = ai;
        let score = minimax(board, depth - 1, false);
        board[j][i] = '';

        bestScore = max(bestScore, score);
      }
    }

    return bestScore;
  }
  else {
    let bestScore = Infinity;

    for (let i = 0; i < 7; i++) {
      let j = getAvailableRow(i);
      if (j != null && board[j][i] == '') {
        board[j][i] = human;
        let score = minimax(board, depth - 1, true);
        board[j][i] = '';

        bestScore = min(bestScore, score);
      }
    }

    return bestScore;
  }
}

function minimaxABP(board, depth, isMaximizing, alpha, beta) {
  let r = checkWin();
  if (r != null) {
    if (r == human)
      return scores.human;
    else if (r == ai)
      return scores.ai;
    else if (r == 'tie')
      return scores.tie;
  }

  if (depth == 0) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 7; i++) {
      let j = getAvailableRow(i);
      if (j != null && board[j][i] == '') {
        board[j][i] = ai;
        let score = minimaxABP(board, depth - 1, false, alpha, beta);
        board[j][i] = '';

        bestScore = max(bestScore, score);
        alpha = max(alpha, bestScore);
        if (beta <= alpha)
          break;
      }
    }

    return bestScore;
  }
  else {
    let bestScore = Infinity;

    for (let i = 0; i < 7; i++) {
      let j = getAvailableRow(i);
      if (j != null && board[j][i] == '') {
        board[j][i] = human;
        let score = minimaxABP(board, depth - 1, true, alpha, beta);
        board[j][i] = '';

        bestScore = min(bestScore, score);
        beta = min(beta, bestScore);
        if (beta <= alpha)
          break;
      }
    }

    return bestScore;
  }
}
