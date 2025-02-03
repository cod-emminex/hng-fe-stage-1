// script.js
class ColorGame {
  constructor() {
    this.score = 0;
    this.colors = [];
    this.targetColor = '';
    this.setupElements();
    this.setupEventListeners();
    this.startNewGame();
  }

  setupElements() {
    this.colorBox = document.querySelector('[data-testid="colorBox"]');
    this.gameStatus = document.querySelector('[data-testid="gameStatus"]');
    this.scoreElement = document.querySelector('[data-testid="score"]');
    this.colorOptions = document.querySelector('.color-options');
    this.newGameButton = document.querySelector('[data-testid="newGameButton"]');
  }

  setupEventListeners() {
    this.newGameButton.addEventListener('click', () => this.startNewGame());
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
    if (guessedColor === this.targetColor) {
      this.score++;
      this.scoreElement.textContent = this.score;
      this.gameStatus.textContent = 'Correct! Well done!';
      this.gameStatus.className = 'game-status correct';
      setTimeout(() => this.startNewGame(), 1500);
    } else {
      this.gameStatus.textContent = 'Wrong! Try again!';
      this.gameStatus.className = 'game-status wrong';
    }
  }

  startNewGame() {
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
