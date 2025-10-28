const boardDiv = document.getElementById('board5x5');
const titleHeader = document.getElementById('titleHeader');
const restartBtn = document.getElementById('restartBtn');
const winSound = document.getElementById('winSound');
const tieSound = document.getElementById('tieSound');

let size = 5; // 5x5 grid
let currentPlayer = "X"; // player is X
let computer = "O";
let gameBoard = Array(size * size).fill('');
let gameActive = true;

// ✅ Create 5x5 grid
function createBoard() {
  boardDiv.innerHTML = '';
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', () => playerMove(i));
    boardDiv.appendChild(cell);
  }
  titleHeader.textContent = "Your Turn (X)";
}
createBoard();

// ✅ Player move
function playerMove(index) {
  if (!gameActive || gameBoard[index] !== '') return;

  gameBoard[index] = currentPlayer;
  updateBoard();

  if (checkWin(currentPlayer)) {
    titleHeader.textContent = "You Win!";
    playSound(winSound);
    gameActive = false;
    return;
  }

  if (checkTie()) {
    titleHeader.textContent = "It's a Tie!";
    playSound(tieSound);
    gameActive = false;
    return;
  }

  titleHeader.textContent = "Computer's Turn...";
  boardDiv.style.pointerEvents = "none";
  setTimeout(computerMove, 700);
}

// ✅ Smart computer (AI tries to win or block)
function computerMove() {
  let move = findWinningMove(computer);
  if (move === null) {
    move = findWinningMove(currentPlayer);
  }
  if (move === null) {
    const available = gameBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    move = available[Math.floor(Math.random() * available.length)];
  }

  gameBoard[move] = computer;
  updateBoard();

  if (checkWin(computer)) {
    titleHeader.textContent = "Computer Wins!";
    playSound(winSound);
    gameActive = false;
    boardDiv.style.pointerEvents = "auto";
    return;
  }

  if (checkTie()) {
    titleHeader.textContent = "It's a Tie!";
    playSound(tieSound);
    gameActive = false;
    boardDiv.style.pointerEvents = "auto";
    return;
  }

  titleHeader.textContent = "Your Turn (X)";
  boardDiv.style.pointerEvents = "auto";
}

// ✅ Update the grid
function updateBoard() {
  document.querySelectorAll('.cell').forEach((cell, i) => {
    cell.textContent = gameBoard[i];
  });
}

// ✅ Check if someone wins (need 4 in a row)
function checkWin(player) {
  const needed = 4;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (
        checkDirection(r, c, 0, 1, player, needed) || // horizontal
        checkDirection(r, c, 1, 0, player, needed) || // vertical
        checkDirection(r, c, 1, 1, player, needed) || // diagonal ↘
        checkDirection(r, c, 1, -1, player, needed)   // diagonal ↙
      ) {
        return true;
      }
    }
  }
  return false;
}

// Helper: check direction
function checkDirection(r, c, dr, dc, player, needed) {
  for (let i = 0; i < needed; i++) {
    const row = r + i * dr;
    const col = c + i * dc;
    if (row < 0 || col < 0 || row >= size || col >= size) return false;
    if (gameBoard[row * size + col] !== player) return false;
  }
  return true;
}

// ✅ Check for tie
function checkTie() {
  return gameBoard.every(cell => cell !== '');
}

// ✅ Find winning or blocking move
function findWinningMove(player) {
  for (let i = 0; i < gameBoard.length; i++) {
    if (gameBoard[i] === '') {
      gameBoard[i] = player;
      if (checkWin(player)) {
        gameBoard[i] = '';
        return i;
      }
      gameBoard[i] = '';
    }
  }
  return null;
}

// ✅ Play sound
function playSound(audioElement) {
  audioElement.currentTime = 0;
  audioElement.play().catch(err => console.log("Sound Error:", err));
}

// ✅ Restart button
restartBtn.addEventListener('click', () => {
  gameBoard = Array(size * size).fill('');
  gameActive = true;
  createBoard();
});
