const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

const areCellsEqual = (cellOne, cellTwo) =>
  cellOne.every((ordinate, index) => ordinate === cellTwo[index]);

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.deltas[this.heading];
  }

  turnLeft() {
    this.heading = (this.heading + 1) % 4;
  }
  turnRight() {
    this.heading = (this.heading + 3) % 4;
  }
}

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  get head() {
    const head = this.positions[this.positions.length - 1];
    return head.slice();
  }

  get location() {
    return this.positions.slice();
  }

  get species() {
    return this.type;
  }

  turnLeft() {
    this.direction.turnLeft();
  }

  turnRight() {
    this.direction.turnRight();
  }

  move() {
    const [headX, headY] = this.positions[this.positions.length - 1];
    this.previousTail = this.positions.shift();

    const [deltaX, deltaY] = this.direction.delta;

    this.positions.push([headX + deltaX, headY + deltaY]);
  }

  eatFood() {
    this.positions.unshift(this.previousTail);
  }

  hasReachedFood(position) {
    return areCellsEqual(this.head, position);
  }

  hasEatenItself() {
    const restBody = this.positions.slice(0, this.positions.length - 1);
    return restBody.some(part => areCellsEqual(part, this.head));
  }

  hasTouched(boundary) {
    const touchedVertically =
      this.head[0] < 0 || this.head[0] > boundary.colNum;
    const touchedHorizontally =
      this.head[1] < 0 || this.head[1] > boundary.rowNum;
    return touchedHorizontally || touchedVertically;
  }
}

class Food {
  constructor(colId, rowId) {
    this.colId = colId;
    this.rowId = rowId;
  }

  get position() {
    return [this.colId, this.rowId];
  }
}

class Scorer {
  constructor() {
    this.currentScore = 0;
  }

  increase() {
    this.currentScore++;
  }

  get score() {
    return this.currentScore;
  }
}

class Game {
  constructor(snake, ghostSnake, food, boundary) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.previousFood = [0, 0];
    this.boundary = boundary;
    this.scorer = new Scorer();
  }

  getCurrentStat() {
    return {
      snake: this.snake,
      ghostSnake: this.ghostSnake,
      food: this.food,
      previousFood: this.previousFood,
      score: this.scorer.score
    };
  }

  generateFood() {
    this.previousFood = this.food.position;
    const newFoodCol = Math.floor(Math.random() * this.boundary.colNum);
    const newFoodRow = Math.floor(Math.random() * this.boundary.rowNum);
    this.food = new Food(newFoodCol, newFoodRow);
  }

  update() {
    this.snake.move();
    this.ghostSnake.move();
    if (this.snake.hasReachedFood(this.food.position)) {
      this.snake.eatFood();
      this.generateFood();
      this.scorer.increase();
    }
  }

  guideGhostSnake() {
    let x = Math.random() * 100;
    if (x > 50) {
      this.ghostSnake.turnLeft();
    }
  }

  turnSnake(direction) {
    this.snake['turn' + direction]();
  }

  isOver() {
    return this.snake.hasEatenItself() || this.snake.hasTouched(this.boundary);
  }
}

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';
const SCORE_BOARD_ID = 'scoreBoard';

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;
const getScoreBoard = () => document.getElementById(SCORE_BOARD_ID);

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const eraseFood = function(food) {
  let [colId, rowId] = food;
  const cell = getCell(colId, rowId);
  cell.classList.remove('food');
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const drawFood = function(food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const viewScore = function(score) {
  const scoreBoard = getScoreBoard();
  scoreBoard.innerText = `score : ${score}`;
};

const handleKeyPress = (game, event) => {
  const directions = { ArrowLeft: 'Left', ArrowRight: 'Right' };
  const direction = directions[event.key];
  direction && game.turnSnake(direction);
};

const attachEventListeners = game => {
  document.body.onkeydown = () => handleKeyPress(game, event);
};

const initSnake = () => {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), 'snake');
};

const initGhostSnake = () => {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(SOUTH), 'ghost');
};

const setup = game => {
  const { snake, ghostSnake, food } = game.getCurrentStat();
  attachEventListeners(game);
  createGrids();

  drawSnake(snake);
  drawSnake(ghostSnake);
  drawFood(food);
};

const draw = function(game) {
  const {
    snake,
    ghostSnake,
    food,
    previousFood,
    score
  } = game.getCurrentStat();
  drawSnake(snake);
  eraseTail(snake);
  drawSnake(ghostSnake);
  eraseTail(ghostSnake);
  eraseFood(previousFood);
  drawFood(food);
  viewScore(score);
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(5, 5);

  const game = new Game(snake, ghostSnake, food, {
    colNum: NUM_OF_COLS - 1,
    rowNum: NUM_OF_ROWS - 1
  });
  setup(game);

  const mainGame = setInterval(() => {
    game.update();
    if (game.isOver()) {
      clearInterval(mainGame);
      clearInterval(ghostSnakeTurner);
      alert('game over');
      return;
    }
    draw(game);
  }, 200);
  const ghostSnakeTurner = setInterval(() => {
    game.guideGhostSnake();
  }, 500);
};
