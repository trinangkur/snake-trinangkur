const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

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

const areCellsEqual = (cellOne, cellTwo) =>
  cellOne.every((ordinate, index) => ordinate === cellTwo[index]);

class Game {
  constructor(snake, ghostSnake, food) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.previousFood = [0, 0];
  }
  getCurrentStat() {
    return {
      snake: this.snake,
      ghostSnake: this.ghostSnake,
      food: this.food,
      previousFood: this.previousFood
    };
  }

  hasEatenFood() {
    return areCellsEqual(this.snake.head, this.food.position);
  }

  update() {
    this.snake.move();
    this.ghostSnake.move();
    if (this.hasEatenFood()) {
      this.previousFood = this.food.position;
      const newFoodCol = Math.floor(Math.random() * 100);
      const newFoodRow = Math.floor(Math.random() * 60);
      this.food = new Food(newFoodCol, newFoodRow);
      this.snake.eatFood();
    }
  }
  turnGhostSnake() {
    let x = Math.random() * 100;
    if (x > 50) {
      this.ghostSnake.turnLeft();
    }
  }
  turnSnake(direction) {
    this.snake['turn' + direction]();
  }
}

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const getGrid = () => document.getElementById(GRID_ID);
const getCellId = (colId, rowId) => colId + '_' + rowId;

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
  const { snake, ghostSnake, food, previousFood } = game.getCurrentStat();
  drawSnake(snake);
  eraseTail(snake);
  drawSnake(ghostSnake);
  eraseTail(ghostSnake);
  eraseFood(previousFood);
  drawFood(food);
};

const animateGridItems = game => {
  game.update();
  draw(game);
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(5, 5);

  const game = new Game(snake, ghostSnake, food);
  setup(game);

  setInterval(animateGridItems, 300, game);
  setInterval(() => {
    game.turnGhostSnake();
  }, 500);
};
