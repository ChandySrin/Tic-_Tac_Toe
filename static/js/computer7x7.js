const boardDiv = document.getElementById('board7x7');
const titleHeader = document.getElementById('titleHeader');
const restartBtn = document.getElementById('restartBtn');
const winSound = document.getElementById('winSound');
const tieSound = document.getElementById('tieSound');

let size = 7; // 7x7 grid
let currentPlayer = "X"; // player always X
let computer = "O";
let gameBoard = Array(size * size).fill('');
let gameActive = true;

// ✅ Create 7x7 board
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

  playSound(clickSound);

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
  boardDiv.style.pointerEvents = "none"; // disable player input
  setTimeout(computerMove, 800); // small delay
}

// ✅ Computer move (Smart AI)
function computerMove() {
  // Try to win
  let move = findWinningMove(computer);
  if (move === null) {
    // Try to block player
    move = findWinningMove(currentPlayer);
  }
  // Otherwise, random move
  if (move === null) {
    const available = gameBoard.map((v, i) => v === '' ? i : null).filter(v => v !== null);
    move = available[Math.floor(Math.random() * available.length)];
  }

  playSound(clickSound);

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

// ✅ Update board visually
function updateBoard() {
  document.querySelectorAll('.cell').forEach((cell, i) => {
    cell.textContent = gameBoard[i];
  });
}

// ✅ Check if player wins (5 in a row for 7x7)
function checkWin(player) {
  const needed = 5; // 5 in a row to win

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (
        checkDirection(r, c, 0, 1, player, needed) || // horizontal
        checkDirection(r, c, 1, 0, player, needed) || // vertical
        checkDirection(r, c, 1, 1, player, needed) || // diagonal down-right
        checkDirection(r, c, 1, -1, player, needed)   // diagonal down-left
      ) {
        return true;
      }
    }
  }
  return false;
}

// Helper: check 5 in a row
function checkDirection(r, c, dr, dc, player, needed) {
  for (let i = 0; i < needed; i++) {
    const row = r + i * dr;
    const col = c + i * dc;
    if (row < 0 || col < 0 || row >= size || col >= size) return false;
    if (gameBoard[row * size + col] !== player) return false;
  }
  return true;
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

// ✅ Restart button
restartBtn.addEventListener('click', () => {
  gameBoard = Array(size * size).fill('');
  gameActive = true;
  createBoard();
});

function launchConfetti() {
  const duration = 2 * 1000; // 2 seconds
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 6,
      startVelocity: 20,
      spread: 360,
      ticks: 60,
      origin: {
        x: Math.random(),
        y: Math.random() - 0.2
      }
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
