import Game, { FLEET } from "../src/game";

// Fixed layout sirf battle-phase ke tests ke liye (random se test flaky hota)
// Har entry: [length, row], col 0 se horizontal
const LAYOUT = [[5, 0], [4, 2], [3, 4], [3, 6], [2, 8]];

const shipCells = [];
LAYOUT.forEach(([length, row]) => {
  for (let col = 0; col < length; col++) shipCells.push([row, col]);
});

function useFixedFleets(game) {
  [game.human, game.computer].forEach((player) => {
    player.gameboard.reset();
    LAYOUT.forEach(([length, row]) => {
      player.gameboard.placeShip(length, [row, 0], "horizontal");
    });
  });
  game.start();
}

describe("Game setup phase", () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  test("starts with a random computer fleet, an empty human board, not started", () => {
    expect(game.human.type).toBe("real");
    expect(game.computer.type).toBe("computer");
    expect(game.computer.gameboard.ships).toHaveLength(FLEET.length);
    expect(game.human.gameboard.ships).toHaveLength(0);
    expect(game.started).toBe(false);
    expect(game.winner).toBeNull();
  });

  test("nextShipLength follows the fleet order", () => {
    FLEET.forEach((length, i) => {
      expect(game.nextShipLength()).toBe(length);
      game.placeHumanShip([i * 2, 0], "horizontal");
    });
    expect(game.nextShipLength()).toBeNull();
  });

  test("placeHumanShip places the next ship where asked", () => {
    const ship = game.placeHumanShip([0, 0], "vertical");
    expect(ship.length).toBe(FLEET[0]);
    expect(game.human.gameboard.getShipAt([4, 0])).toBe(ship);
  });

  test("cannot start until the human fleet is complete", () => {
    expect(() => game.start()).toThrow();
  });

  test("randomizeHumanFleet completes the fleet so the game can start", () => {
    game.randomizeHumanFleet();
    expect(game.isFleetReady()).toBe(true);
    expect(() => game.start()).not.toThrow();
    expect(game.started).toBe(true);
  });

  test("resetHumanFleet clears the human board", () => {
    game.randomizeHumanFleet();
    game.resetHumanFleet();
    expect(game.human.gameboard.ships).toHaveLength(0);
  });

  test("fleet cannot be changed after the game starts", () => {
    game.randomizeHumanFleet();
    game.start();
    expect(() => game.randomizeHumanFleet()).toThrow();
    expect(() => game.resetHumanFleet()).toThrow();
  });

  test("playRound throws before the game starts", () => {
    expect(() => game.playRound([0, 0])).toThrow();
  });
});

describe("Game battle phase", () => {
  let game;

  beforeEach(() => {
    game = new Game();
    useFixedFleets(game);
  });

  test("playRound attacks the computer board, then the computer replies", () => {
    const result = game.playRound([0, 0]);
    expect(result.playerResult).toBe("hit");
    expect(game.computer.gameboard.isAttacked([0, 0])).toBe(true);
    expect(game.human.gameboard.attacked.size).toBe(1);
    expect(["hit", "miss"]).toContain(result.computerResult);
  });

  test("an illegal attack throws and the computer does not move", () => {
    game.playRound([9, 9]);
    const before = game.human.gameboard.attacked.size;
    expect(() => game.playRound([9, 9])).toThrow();
    expect(game.human.gameboard.attacked.size).toBe(before);
  });

  test("human wins when all computer ships are sunk", () => {
    let result;
    shipCells.forEach((cell) => {
      result = game.playRound(cell);
    });
    expect(result.winner).toBe(game.human);
    expect(game.winner).toBe(game.human);
  });

  test("computer wins when all human ships are sunk", () => {
    // human board ka har cell attack kar do, sirf [0,0] chhod ke.
    // Ab computer ke paas ek hi legal move bacha hai: [0,0]
    const board = game.human.gameboard;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (row !== 0 || col !== 0) board.receiveAttack([row, col]);
      }
    }

    const result = game.playRound([9, 9]); // miss
    expect(result.computerMove).toEqual([0, 0]);
    expect(result.winner).toBe(game.computer);
  });

  test("no more rounds can be played after the game is over", () => {
    shipCells.forEach((cell) => game.playRound(cell));
    expect(() => game.playRound([9, 9])).toThrow();
  });
});
