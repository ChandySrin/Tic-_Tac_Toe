const xPlayer = document.getElementById('xPlayer');
const oPlayer = document.getElementById('oPlayer');
const titleHeader = document.getElementById('titleHeader');
const cells = document.querySelectorAll('.cell');
const restartBtn = document.getElementById('restartBtn');
const winSound = document.getElementById('winSound');
const tieSound = document.getElementById('tieSound');
let currentPlayer = null;
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;

// Winning combinations (indices of cells)
const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

// Player selection
xPlayer.addEventListener('click', () => startGame('X'));
oPlayer.addEventListener('click', () => startGame('O'));

// Start game with chosen player
function startGame(player) {
  currentPlayer = player;
  gameActive = true;
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.pointerEvents = 'auto';
  });
  xPlayer.classList.remove('active');
  oPlayer.classList.remove('active');
  if (player === 'X') {
    xPlayer.classList.add('active');
  } else {
    oPlayer.classList.add('active');
  }
  titleHeader.textContent = `Player ${currentPlayer}'s Turn`;
}

// Handle cell click
cells.forEach((cell, index) => {
  cell.addEventListener('click', () => handleCellClick(index));
});

function handleCellClick(index) {
  if (!gameActive || gameBoard[index] !== '') return;

  gameBoard[index] = currentPlayer;
  cells[index].textContent = currentPlayer;

  if (checkWin()) {
    titleHeader.textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    cells.forEach(cell => cell.style.pointerEvents = 'none');
    playSound(winSound); // Play win sound
    return;
  }

  if (checkTie()) {
    titleHeader.textContent = "It's a Tie!";
    gameActive = false;
    cells.forEach(cell => cell.style.pointerEvents = 'none');
    playSound(tieSound); // Play tie sound
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  xPlayer.classList.toggle('active');
  oPlayer.classList.toggle('active');
  titleHeader.textContent = `Player ${currentPlayer}'s Turn`;
}

// Check for a win
function checkWin() {
  return winCombos.some(combo => {
    return combo.every(index => gameBoard[index] === currentPlayer);
  });
}

// Check for a tie
function checkTie() {
  return gameBoard.every(cell => cell !== '');
}

// Play sound
function playSound(audioElement) {
  audioElement.currentTime = 0; // Reset to start
  audioElement.play().catch(error => {
    console.log('Error playing sound:', error);
  });
}

// Restart game
restartBtn.addEventListener('click', () => {
  gameActive = false;
  currentPlayer = null;
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.style.pointerEvents = 'auto';
  });
  xPlayer.classList.remove('active');
  oPlayer.classList.remove('active');
  titleHeader.textContent = 'Choose';
});

