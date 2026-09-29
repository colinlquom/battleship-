import Gameboard from "../src/gameboard";

describe("Gameboard", () => {
  let board;

  beforeEach(() => {
    board = new Gameboard();
  });

  test("places a ship horizontally", () => {
    const ship = board.placeShip(3, [0, 0], "horizontal");
    expect(board.getShipAt([0, 0])).toBe(ship);
    expect(board.getShipAt([0, 2])).toBe(ship);
    expect(board.getShipAt([0, 3])).toBeNull();
  });

  test("places a ship vertically", () => {
    const ship = board.placeShip(3, [2, 4], "vertical");
    expect(board.getShipAt([2, 4])).toBe(ship);
    expect(board.getShipAt([4, 4])).toBe(ship);
    expect(board.getShipAt([5, 4])).toBeNull();
  });

  test("returns null for an empty cell", () => {
    expect(board.getShipAt([5, 5])).toBeNull();
  });

    test("throws if the ship goes out of bounds", () => {
    expect(() => board.placeShip(3, [0, 8], "horizontal")).toThrow();
    expect(() => board.placeShip(3, [8, 0], "vertical")).toThrow();
  });

  test("throws if the ship overlaps another ship", () => {
    board.placeShip(3, [0, 0], "horizontal");
    expect(() => board.placeShip(2, [0, 1], "vertical")).toThrow();
  });

  test("a failed placement leaves the board unchanged", () => {
    expect(() => board.placeShip(3, [0, 8], "horizontal")).toThrow();
    expect(board.getShipAt([0, 8])).toBeNull();
  });
	  test("receiveAttack registers a hit on the ship", () => {
    const ship = board.placeShip(2, [0, 0], "horizontal");
    expect(board.receiveAttack([0, 0])).toBe("hit");
    expect(ship.hits).toBe(1);
  });

  test("receiveAttack returns miss when no ship is there", () => {
    board.placeShip(2, [0, 0], "horizontal");
    expect(board.receiveAttack([5, 5])).toBe("miss");
  });

  test("records missed attacks", () => {
    board.receiveAttack([5, 5]);
    board.receiveAttack([2, 3]);
    expect(board.missedAttacks).toEqual([[5, 5], [2, 3]]);
  });

  test("does not record a hit as a miss", () => {
    board.placeShip(2, [0, 0], "horizontal");
    board.receiveAttack([0, 0]);
    expect(board.missedAttacks).toEqual([]);
  });

  test("throws when the same coordinate is attacked twice", () => {
    board.receiveAttack([1, 1]);
    expect(() => board.receiveAttack([1, 1])).toThrow();
  });

  test("throws when attacking outside the board", () => {
    expect(() => board.receiveAttack([10, 0])).toThrow();
  });
  
    test("allSunk is false while some ship is still afloat", () => {
    board.placeShip(2, [0, 0], "horizontal");
    board.placeShip(1, [5, 5], "horizontal");
    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);
    expect(board.allSunk()).toBe(false);
  });

  test("allSunk is true once every ship is sunk", () => {
    board.placeShip(2, [0, 0], "horizontal");
    board.placeShip(1, [5, 5], "horizontal");
    board.receiveAttack([0, 0]);
    board.receiveAttack([0, 1]);
    board.receiveAttack([5, 5]);
    expect(board.allSunk()).toBe(true);
  });

  test("allSunk is false on a board with no ships", () => {
    expect(board.allSunk()).toBe(false);
  });
  
    test("isAttacked reports whether a coordinate was attacked", () => {
    expect(board.isAttacked([3, 3])).toBe(false);
    board.receiveAttack([3, 3]);
    expect(board.isAttacked([3, 3])).toBe(true);
  });
  
	  test("getShipCoords lists the cells a ship would cover", () => {
    expect(board.getShipCoords(3, [1, 1], "horizontal")).toEqual([
      [1, 1],
      [1, 2],
      [1, 3],
    ]);
    expect(board.getShipCoords(2, [1, 1], "vertical")).toEqual([
      [1, 1],
      [2, 1],
    ]);
  });

  test("canPlaceShip is true for a free spot", () => {
    expect(board.canPlaceShip(3, [0, 0], "horizontal")).toBe(true);
  });

  test("canPlaceShip is false out of bounds or on top of another ship", () => {
    board.placeShip(3, [0, 0], "horizontal");
    expect(board.canPlaceShip(3, [0, 8], "horizontal")).toBe(false);
    expect(board.canPlaceShip(2, [0, 1], "vertical")).toBe(false);
  });

  test("reset clears ships and attacks", () => {
    board.placeShip(2, [0, 0], "horizontal");
    board.receiveAttack([0, 0]);
    board.receiveAttack([5, 5]);
    board.reset();
    expect(board.ships).toHaveLength(0);
    expect(board.getShipAt([0, 0])).toBeNull();
    expect(board.isAttacked([0, 0])).toBe(false);
    expect(board.missedAttacks).toEqual([]);
  });

  test("placeFleetRandomly places every ship without overlap", () => {
    board.placeFleetRandomly([5, 4, 3, 3, 2]);
    expect(board.ships.map((ship) => ship.length)).toEqual([5, 4, 3, 3, 2]);

    let occupied = 0;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (board.getShipAt([row, col])) occupied++;
      }
    }
    expect(occupied).toBe(17); // 5+4+3+3+2, overlap hota toh kam aata
  });

  test("placeFleetRandomly replaces any earlier fleet", () => {
    board.placeFleetRandomly([5, 4, 3, 3, 2]);
    board.placeFleetRandomly([5, 4, 3, 3, 2]);
    expect(board.ships).toHaveLength(5);
  });
});
