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
