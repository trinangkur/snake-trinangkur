class Game {
  constructor(snake, ghostSnake, food, boundary) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.previousFood = new Food(0, 0, 'normalFood');
    this.boundary = boundary;
    this.scorer = new Scorer();
  }

  getCurrentStat() {
    return {
      snake: this.snake.getStat(),
      ghostSnake: this.ghostSnake.getStat(),
      food: this.food.getStat(),
      previousFood: this.previousFood,
      score: this.scorer.score
    };
  }

  generateFood() {
    this.previousFood = this.food.getStat();
    const newFoodCol = Math.floor(Math.random() * this.boundary.colNum);
    const newFoodRow = Math.floor(Math.random() * this.boundary.rowNum);
    const foodType = this.scorer.score % 4 ? 'normalFood' : 'specialFood';
    this.food = new Food(newFoodCol, newFoodRow, foodType);
  }

  update() {
    this.snake.move();
    this.ghostSnake.wrap(this.boundary);
    if (this.snake.hasReachedFood(this.food.position)) {
      this.snake.eatFood();
      this.scorer.increaseBy(this.food.point);
      this.generateFood();
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
