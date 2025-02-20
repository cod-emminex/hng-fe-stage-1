// script.js
class ColorGame {
  constructor() {
    this.score = 0;        // Score starts at 0
    this.lives = 3;        // Separate lives counter
    this.highScore = this.getHighScore();
    this.colors = [];
    this.targetColor = '';
    this.gameActive = true;
    this.setupElements();
    this.setupEventListeners();
    this.updateScoreDisplay();
    this.updateLivesDisplay();  // New method to update lives
    this.updateHighScoreDisplay();
    this.startNewGame();
  }

  setupElements() {
    this.colorBox = document.querySelector('[data-testid="colorBox"]');
    this.gameStatus = document.querySelector('[data-testid="gameStatus"]');
    this.scoreElement = document.querySelector('[data-testid="score"]');
    this.colorOptions = document.querySelector('.color-options');
    this.newGameButton = document.querySelector('[data-testid="newGameButton"]');

    // Create lives display
    if (!document.querySelector('[data-testid="lives"]')) {
      const livesDiv = document.createElement('div');
      livesDiv.setAttribute('data-testid', 'lives');
      livesDiv.className = 'lives-container';
      document.querySelector('.game-controls').insertBefore(livesDiv, this.scoreElement);
    }
    this.livesElement = document.querySelector('[data-testid="lives"]');

    // Create high score element
    if (!document.querySelector('[data-testid="highScore"]')) {
      const highScoreDiv = document.createElement('div');
      highScoreDiv.setAttribute('data-testid', 'highScore');
      highScoreDiv.className = 'high-score';
      document.querySelector('.game-controls').appendChild(highScoreDiv);
    }
    this.highScoreElement = document.querySelector('[data-testid="highScore"]');
  }

  setupEventListeners() {
    this.newGameButton.addEventListener('click', () => {
      this.resetGame();
    });
  }

  getHighScore() {
    return parseInt(localStorage.getItem('colorGameHighScore')) || 0;
  }

  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('colorGameHighScore', this.score.toString());
      this.updateHighScoreDisplay();
    }
  }

  updateHighScoreDisplay() {
    this.highScoreElement.textContent = `High Score: ${this.highScore}`;
  }

  updateScoreDisplay() {
    this.scoreElement.textContent = `Score: ${this.score}`;
    this.scoreElement.classList.add('score-pulse');
    setTimeout(() => this.scoreElement.classList.remove('score-pulse'), 500);
  }

  updateLivesDisplay() {
    this.livesElement.innerHTML = '';
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('i');
      heart.className = i < this.lives ? 'fas fa-heart' : 'far fa-heart';
      heart.classList.add('heart-icon');
      if (i < this.lives) {
        heart.classList.add('heart-beat');
      }
      this.livesElement.appendChild(heart);
    }
  }

  generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
  }

  generateColors() {
    this.colors = [];
    for (let i = 0; i < 6; i++) {
      this.colors.push(this.generateRandomColor());
    }
    this.targetColor = this.colors[Math.floor(Math.random() * 6)];
  }

  createColorButtons() {
    this.colorOptions.innerHTML = '';
    this.colors.forEach((color) => {
      const button = document.createElement('button');
      button.setAttribute('data-testid', 'colorOption');
      button.className = 'color-option';
      button.style.backgroundColor = color;
      button.addEventListener('click', () => this.checkGuess(color));
      this.colorOptions.appendChild(button);
    });
  }

  checkGuess(guessedColor) {
    if (!this.gameActive) return;

    const clickedButton = Array.from(this.colorOptions.children)
      .find(button => button.style.backgroundColor === guessedColor);

    if (guessedColor === this.targetColor) {
      this.score++;
      this.updateHighScore();
      this.updateScoreDisplay();
      this.gameStatus.textContent = 'Correct! Well done!';
      this.gameStatus.className = 'game-status correct';
      this.animateCorrectGuess(clickedButton);
      setTimeout(() => this.startNewGame(), 1500);
    } else {
      this.lives--;
      this.updateLivesDisplay();
      this.animateWrongGuess(clickedButton);

      if (this.lives <= 0) {
        this.gameOver();
      } else {
        this.gameStatus.textContent = 'Wrong! Try again!';
        this.gameStatus.className = 'game-status wrong';
      }
    }
  }

  animateCorrectGuess(button) {
    button.classList.add('correct-guess');
    this.colorBox.classList.add('correct-target');
    setTimeout(() => {
      button.classList.remove('correct-guess');
      this.colorBox.classList.remove('correct-target');
    }, 1000);
  }

  animateWrongGuess(button) {
    button.classList.add('wrong-guess');
    setTimeout(() => button.classList.remove('wrong-guess'), 1000);
  }

  gameOver() {
    this.gameActive = false;
    this.gameStatus.textContent = 'Game Over! Click New Game to try again!';
    this.gameStatus.className = 'game-status game-over';
    this.colorOptions.classList.add('game-over-fade');
    this.gameStatus.classList.add('shake-animation');
  }

  resetGame() {
    this.score = 0;    // Reset score to 0
    this.lives = 3;    // Reset lives to 3
    this.gameActive = true;
    this.updateScoreDisplay();
    this.updateLivesDisplay();
    this.colorOptions.classList.remove('game-over-fade');
    this.startNewGame();

    this.colorBox.classList.add('reset-animation');
    setTimeout(() => this.colorBox.classList.remove('reset-animation'), 500);
  }

  startNewGame() {
    if (!this.gameActive) return;

    this.generateColors();
    this.createColorButtons();
    this.colorBox.style.backgroundColor = this.targetColor;
    this.gameStatus.textContent = '';
    this.gameStatus.className = 'game-status';
  }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
  new ColorGame();
});
