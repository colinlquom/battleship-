import Player from "../src/player";
import Gameboard from "../src/gameboard";

describe("Player", () => {
  test("has a type and its own gameboard", () => {
    const player = new Player("real");
    expect(player.type).toBe("real");
    expect(player.gameboard).toBeInstanceOf(Gameboard);
  });

  test("each player has a separate gameboard", () => {
    const a = new Player("real");
    const b = new Player("computer");
    expect(a.gameboard).not.toBe(b.gameboard);
  });

  test("attack sends the attack to the enemy board", () => {
    const human = new Player("real");
    const enemy = new Player("computer");
    enemy.gameboard.placeShip(2, [0, 0], "horizontal");

    expect(human.attack(enemy.gameboard, [0, 0])).toBe("hit");
    expect(human.attack(enemy.gameboard, [5, 5])).toBe("miss");
  });

  test("getRandomMove only returns legal moves and never repeats", () => {
    const cpu = new Player("computer");
    const enemy = new Gameboard();

    for (let i = 0; i < 100; i++) {
      const move = cpu.getRandomMove(enemy);
      expect(() => cpu.attack(enemy, move)).not.toThrow();
    }

    expect(enemy.attacked.size).toBe(100);
    expect(() => cpu.getRandomMove(enemy)).toThrow();
  });
});
