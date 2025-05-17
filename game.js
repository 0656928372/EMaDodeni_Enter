const imagePaths = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg'];
let images = [...imagePaths, ...imagePaths];
let grid = document.getElementById('gameGrid');
let statusEl = document.getElementById('status');
let scoreEl = document.getElementById('scores');
let timerEl = document.getElementById('timer');
let matchSound = document.getElementById('matchSound');
let flipSound = document.getElementById('flipSound');

let firstCard = null;
let secondCard = null;
let lock = false;
let matchedPairs = 0;
let currentPlayer = 1;
let scores = { 1: 0, 2: 0 };
let countdown;
let timeLeft = 10;

function setupGame() {
  grid.innerHTML = '';
  images = [...imagePaths, ...imagePaths].sort(() => 0.5 - Math.random());
  firstCard = null;
  secondCard = null;
  lock = false;
  matchedPairs = 0;
  currentPlayer = 1;
  scores = { 1: 0, 2: 0 };
  updateScores();
  statusEl.textContent = `Player ${currentPlayer}'s Turn`;

  images.forEach(img => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = img;
    card.innerHTML = `<img src="images/${img}" alt="">`;
    card.addEventListener('click', () => handleClick(card));
    grid.appendChild(card);
  });

  previewStart();
  startTimer();
}

function previewStart() {
  const cards = Array.from(document.querySelectorAll('.card')).sort(() => 0.5 - Math.random()).slice(0, 2);
  cards.forEach(card => card.classList.add('revealed'));
  setTimeout(() => {
    cards.forEach(card => card.classList.remove('revealed'));
  }, 1000);
}

function handleClick(card) {
  if (lock || card.classList.contains('matched') || card === firstCard) return;

  flipSound.play();
  card.classList.add('revealed');

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    lock = true;

    const match = firstCard.dataset.image === secondCard.dataset.image;
    setTimeout(() => {
      if (match) {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        scores[currentPlayer]++;
        matchedPairs++;
        matchSound.play();
      } else {
        firstCard.classList.remove('revealed');
        secondCard.classList.remove('revealed');
        switchPlayer();
      }
      updateScores();
      resetTurn();
      if (matchedPairs === imagePaths.length) endGame();
    }, 1000);
  }
}

function switchPlayer() {
  clearInterval(countdown);
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  statusEl.textContent = `Player ${currentPlayer}'s Turn`;
  startTimer();
}

function resetTurn() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

function updateScores() {
  scoreEl.textContent = `P1: ${scores[1]} | P2: ${scores[2]}`;
}

function startTimer() {
  timeLeft = 10;
  timerEl.textContent = `Timer: ${timeLeft}s`;
  countdown = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `Timer: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      switchPlayer();
    }
  }, 1000);
}

function endGame() {
  clearInterval(countdown);
  if (scores[1] > scores[2]) {
    statusEl.textContent = 'Game Over - Player 1 Wins!';
  } else if (scores[2] > scores[1]) {
    statusEl.textContent = 'Game Over - Player 2 Wins!';
  } else {
    statusEl.textContent = "Game Over - It's a Tie!";
  }
}

function restartGame() {
  clearInterval(countdown);
  setupGame();
}

setupGame();