class Food {
  constructor(colId, rowId, type) {
    this.colId = colId;
    this.rowId = rowId;
    this.type = type;
  }

  get point() {
    const types = { normalFood: 1, specialFood: 5 };
    return types[this.type];
  }

  get position() {
    return [this.colId, this.rowId];
  }

  getStat() {
    return { position: this.position, type: this.type };
  }
}
