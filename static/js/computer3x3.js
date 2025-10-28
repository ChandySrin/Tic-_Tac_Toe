const boardDiv = document.getElementById('board');
const titleHeader = document.getElementById('titleHeader');
const restartBtn = document.getElementById('restartBtn');
const winSound = document.getElementById('winSound');
const tieSound = document.getElementById('tieSound');

let size = 3;
let currentPlayer = "X";
let computer = "O";
let gameBoard = Array(size * size).fill('');
let gameActive = true;

// ✅ Create 3x3 board
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
  setTimeout(computerMove, 600);
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
    playSound(loseSound);
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

// ✅ Update board display
function updateBoard() {
  document.querySelectorAll('.cell').forEach((cell, i) => {
    cell.textContent = gameBoard[i];
  });
}

// ✅ Win check for 3 in a row
function checkWin(player) {
  const winPatterns = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // cols
    [0,4,8], [2,4,6]           // diagonals
  ];
  return winPatterns.some(pattern => pattern.every(i => gameBoard[i] === player));
}

// ✅ Check tie
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

// ✅ Restart
restartBtn.addEventListener('click', () => {
  gameBoard = Array(size * size).fill('');
  gameActive = true;
  createBoard();
});
