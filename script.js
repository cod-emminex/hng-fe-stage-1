// script.js
class ColorGame {
  constructor() {
    this.score = 3; // Start with 3 points
    this.highScore = this.getHighScore();
    this.colors = [];
    this.targetColor = '';
    this.gameActive = true;
    this.setupElements();
    this.setupEventListeners();
    this.updateScoreDisplay();
    this.updateHighScoreDisplay();
    this.startNewGame();
  }

  setupElements() {
    this.colorBox = document.querySelector('[data-testid="colorBox"]');
    this.gameStatus = document.querySelector('[data-testid="gameStatus"]');
    this.scoreElement = document.querySelector('[data-testid="score"]');
    this.colorOptions = document.querySelector('.color-options');
    this.newGameButton = document.querySelector('[data-testid="newGameButton"]');

    // Create high score element if it doesn't exist
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
    this.scoreElement.textContent = `Lives: ${this.score}`;
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
    this.colors.forEach((color, index) => {
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

    if (guessedColor === this.targetColor) {
      this.score++;
      this.updateHighScore();
      this.updateScoreDisplay();
      this.gameStatus.textContent = 'Correct! Well done!';
      this.gameStatus.className = 'game-status correct';
      setTimeout(() => this.startNewGame(), 1500);
    } else {
      this.score--;
      this.updateScoreDisplay();

      if (this.score <= 0) {
        this.gameOver();
      } else {
        this.gameStatus.textContent = 'Wrong! Try again!';
        this.gameStatus.className = 'game-status wrong';
      }
    }
  }

  gameOver() {
    this.gameActive = false;
    this.gameStatus.textContent = 'Game Over! Click New Game to try again!';
    this.gameStatus.className = 'game-status game-over';
    this.colorOptions.style.opacity = '0.5';
    this.colorOptions.style.pointerEvents = 'none';
  }

  resetGame() {
    this.score = 3;
    this.gameActive = true;
    this.updateScoreDisplay();
    this.colorOptions.style.opacity = '1';
    this.colorOptions.style.pointerEvents = 'auto';
    this.startNewGame();
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
