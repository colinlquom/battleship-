import Gameboard from "./gameboard";

export default class Player {
  constructor(type = "real") {
    this.type = type;
    this.gameboard = new Gameboard();
  }

  attack(enemyBoard, coord) {
    return enemyBoard.receiveAttack(coord);
  }

  getRandomMove(enemyBoard) {
    const options = [];

    for (let row = 0; row < enemyBoard.size; row++) {
      for (let col = 0; col < enemyBoard.size; col++) {
        if (!enemyBoard.isAttacked([row, col])) {
          options.push([row, col]);
        }
      }
    }

    if (options.length === 0) {
      throw new Error("No legal moves left");
    }

    return options[Math.floor(Math.random() * options.length)];
  }
}
