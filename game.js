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
      snake: this.snake.getStat(),
      ghostSnake: this.ghostSnake.getStat(),
      food: this.food.getStat(),
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
