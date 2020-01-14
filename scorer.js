class Scorer {
  constructor() {
    this.currentScore = 0;
  }

  increaseBy(point) {
    this.currentScore += point;
  }

  get score() {
    return this.currentScore;
  }
}
