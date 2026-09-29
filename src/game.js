import Player from "./player";

export const FLEET = [5, 4, 3, 3, 2];

export default class Game {
  constructor() {
    this.human = new Player("real");
    this.computer = new Player("computer");
    this.winner = null;
    this.started = false;
    this.computer.gameboard.placeFleetRandomly(FLEET);
  }

  assertSetup() {
    if (this.started) {
      throw new Error("Game already started");
    }
  }

  nextShipLength() {
    return FLEET[this.human.gameboard.ships.length] ?? null;
  }

  placeHumanShip(coord, orientation) {
    this.assertSetup();
    const length = this.nextShipLength();
    if (length === null) {
      throw new Error("Fleet is already complete");
    }
    return this.human.gameboard.placeShip(length, coord, orientation);
  }

  randomizeHumanFleet() {
    this.assertSetup();
    this.human.gameboard.placeFleetRandomly(FLEET);
  }

  resetHumanFleet() {
    this.assertSetup();
    this.human.gameboard.reset();
  }

  isFleetReady() {
    return this.human.gameboard.ships.length === FLEET.length;
  }

  start() {
    if (!this.isFleetReady()) {
      throw new Error("Place all ships first");
    }
    this.started = true;
  }

  playRound(coord) {
    if (!this.started) {
      throw new Error("Game has not started");
    }
    if (this.winner) {
      throw new Error("Game is over");
    }

    const playerResult = this.human.attack(this.computer.gameboard, coord);

    if (this.computer.gameboard.allSunk()) {
      this.winner = this.human;
      return { playerResult, computerMove: null, computerResult: null, winner: this.winner };
    }

    const computerMove = this.computer.getRandomMove(this.human.gameboard);
    const computerResult = this.computer.attack(this.human.gameboard, computerMove);

    if (this.human.gameboard.allSunk()) {
      this.winner = this.computer;
    }

    return { playerResult, computerMove, computerResult, winner: this.winner };
  }
}
