const xPlayer = document.getElementById('xPlayer');
const oPlayer = document.getElementById('oPlayer');
const titleHeader = document.getElementById('titleHeader');
const boardDiv = document.getElementById('board5x5');
const restartBtn = document.getElementById('restartBtn');
const winSound = document.getElementById('winSound');
const tieSound = document.getElementById('tieSound');
const clickSound = document.getElementById('clickSound');


let currentPlayer = null;
let gameBoard = [];
let gameActive = false;
const size = 5; // 5x5 board
const winLength = 4;

// Start game with player selection
xPlayer.addEventListener('click', () => startGame('X'));
oPlayer.addEventListener('click', () => startGame('O'));

function startGame(player) {
  currentPlayer = player;
  gameActive = true;
  gameBoard = Array(size * size).fill('');
  boardDiv.innerHTML = '';

  // Create cells dynamically
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', () => handleCellClick(i));
    boardDiv.appendChild(cell);
  }

  xPlayer.classList.remove('active');
  oPlayer.classList.remove('active');
  if (player === 'X') xPlayer.classList.add('active');
  else oPlayer.classList.add('active');

  titleHeader.textContent = `Player ${currentPlayer}'s Turn`;
}

function handleCellClick(index) {
  if (!gameActive || gameBoard[index] !== '') return;

  playSound(clickSound)

  gameBoard[index] = currentPlayer;
  boardDiv.children[index].textContent = currentPlayer;

  if (checkWin(index)) {
    titleHeader.textContent = `🎉 Player ${currentPlayer} Wins! 🎉`;
    gameActive = false;
    playSound(winSound);

    launchConfetti();

    // 🎉 Add winner flash & confetti
    document.querySelector('main').classList.add('win-flash');
    launchConfetti();

    return;
  }

  if (gameBoard.every(cell => cell !== '')) {
    titleHeader.textContent = "It's a Tie!";
    gameActive = false;
    playSound(tieSound);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  xPlayer.classList.toggle('active');
  oPlayer.classList.toggle('active');
  titleHeader.textContent = `Player ${currentPlayer}'s Turn`;
}

// Play sound
function playSound(audioElement) {
  audioElement.currentTime = 0;
  audioElement.play().catch(() => { });
}

// Restart game
restartBtn.addEventListener('click', () => {
  gameActive = false;
  currentPlayer = null;
  gameBoard = [];
  boardDiv.innerHTML = '';
  xPlayer.classList.remove('active');
  oPlayer.classList.remove('active');
  titleHeader.textContent = 'Choose';
});

// Check win (simplified: horizontal, vertical, diagonal)
function checkWin(lastIndex) {
  const row = Math.floor(lastIndex / size);
  const col = lastIndex % size;
  const winLength = 4; // ✅ Need 4 in a row to win

  // Helper function to count continuous cells in one direction
  function countDirection(rStep, cStep) {
    let count = 0;
    let r = row + rStep;
    let c = col + cStep;
    while (
      r >= 0 &&
      r < size &&
      c >= 0 &&
      c < size &&
      gameBoard[r * size + c] === currentPlayer
    ) {
      count++;
      r += rStep;
      c += cStep;
    }
    return count;
  }

  // Check all four main directions
  const directions = [
    [0, 1],   // Horizontal →
    [1, 0],   // Vertical ↓
    [1, 1],   // Diagonal ↘
    [1, -1],  // Diagonal ↙
  ];

  // Check each direction pair (forward + backward)
  for (const [rStep, cStep] of directions) {
    const total = 1 + countDirection(rStep, cStep) + countDirection(-rStep, -cStep);
    if (total >= winLength) return true;
  }

  return false;
}

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
