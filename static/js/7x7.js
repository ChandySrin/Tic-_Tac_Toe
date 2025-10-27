const xPlayer = document.getElementById('xPlayer');
const oPlayer = document.getElementById('oPlayer');
const titleHeader = document.getElementById('titleHeader');
const boardDiv = document.getElementById('board7x7');
const restartBtn = document.getElementById('restartBtn');
const winSound = document.getElementById('winSound');
const tieSound = document.getElementById('tieSound');

let currentPlayer = null;
let gameBoard = [];
let gameActive = false;
const size = 7; // 7x7 board

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

    gameBoard[index] = currentPlayer;
    boardDiv.children[index].textContent = currentPlayer;

    if (checkWin(index)) {
        titleHeader.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        playSound(winSound);
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

    // Check row
    if (Array.from({ length: size }, (_, i) => gameBoard[row * size + i]).every(v => v === currentPlayer)) return true;

    // Check column
    if (Array.from({ length: size }, (_, i) => gameBoard[i * size + col]).every(v => v === currentPlayer)) return true;

    // Check main diagonal (only if last cell is on diagonal)
    if (row === col) {
        if (Array.from({ length: size }, (_, i) => gameBoard[i * size + i]).every(v => v === currentPlayer)) return true;
    }

    // Check anti-diagonal
    if (row + col === size - 1) {
        if (Array.from({ length: size }, (_, i) => gameBoard[i * size + (size - 1 - i)]).every(v => v === currentPlayer)) return true;
    }

    return false;
}