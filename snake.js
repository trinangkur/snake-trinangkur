const areCellsEqual = (cellOne, cellTwo) =>
  cellOne.every((ordinate, index) => ordinate === cellTwo[index]);

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

  getStat() {
    return {
      location: this.positions,
      species: this.type,
      previousTail: this.previousTail
    };
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
