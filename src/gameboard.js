import Ship from "./ship";

const key = ([row, col]) => `${row},${col}`;
const randomInt = (max) => Math.floor(Math.random() * max);

export default class Gameboard {
  constructor() {
    this.size = 10;
    this.reset();
  }

  reset() {
    this.ships = [];
    this.grid = new Map();
    this.attacked = new Set();
    this.missedAttacks = [];
  }

  isInBounds([row, col]) {
    return row >= 0 && row < this.size && col >= 0 && col < this.size;
  }

  getShipCoords(length, [row, col], orientation = "horizontal") {
    const coords = [];
    for (let i = 0; i < length; i++) {
      coords.push(
        orientation === "horizontal" ? [row, col + i] : [row + i, col]
      );
    }
    return coords;
  }

  canPlaceShip(length, start, orientation = "horizontal") {
    return this.getShipCoords(length, start, orientation).every(
      (coord) => this.isInBounds(coord) && !this.grid.has(key(coord))
    );
  }

  placeShip(length, start, orientation = "horizontal") {
    if (!this.canPlaceShip(length, start, orientation)) {
      throw new Error("Cannot place ship there");
    }

    const ship = new Ship(length);
    this.getShipCoords(length, start, orientation).forEach((coord) =>
      this.grid.set(key(coord), ship)
    );
    this.ships.push(ship);
    return ship;
  }

  placeFleetRandomly(lengths) {
    this.reset();

    lengths.forEach((length) => {
      let placed = false;
      while (!placed) {
        const orientation = Math.random() < 0.5 ? "horizontal" : "vertical";
        const start = [randomInt(this.size), randomInt(this.size)];
        if (this.canPlaceShip(length, start, orientation)) {
          this.placeShip(length, start, orientation);
          placed = true;
        }
      }
    });
  }

  getShipAt(coord) {
    return this.grid.get(key(coord)) || null;
  }

  isAttacked(coord) {
    return this.attacked.has(key(coord));
  }

  receiveAttack(coord) {
    if (!this.isInBounds(coord)) {
      throw new Error("Attack is out of bounds");
    }
    if (this.attacked.has(key(coord))) {
      throw new Error("Coordinate already attacked");
    }

    this.attacked.add(key(coord));

    const ship = this.getShipAt(coord);
    if (ship) {
      ship.hit();
      return "hit";
    }

    this.missedAttacks.push(coord);
    return "miss";
  }

  allSunk() {
    return this.ships.length > 0 && this.ships.every((ship) => ship.isSunk());
  }
}
