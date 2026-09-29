import "../styles.css";
import Game from "./game";
import {
  renderBoard,
  getCellCoord,
  showPreview,
  clearPreview,
  setMessage,
  showSetupControls,
  setStartEnabled,
  setRotateLabel,
} from "./dom";

const playerBoardEl = document.getElementById("player-board");
const enemyBoardEl = document.getElementById("enemy-board");
const rotateBtn = document.getElementById("rotate");
const randomizeBtn = document.getElementById("randomize");
const resetBtn = document.getElementById("reset-fleet");
const startBtn = document.getElementById("start-game");
const newGameBtn = document.getElementById("new-game");

let game;
let orientation = "horizontal";

function setupMessage() {
  const length = game.nextShipLength();
  if (length === null) {
    return "Fleet ready! Press Start Game, or Reset / Randomize to change it.";
  }
  return `Place your ship of length ${length} (${orientation}). Click on your board.`;
}

function messageFor(result) {
  if (result.winner) {
    return result.winner === game.human
      ? "You win! All enemy ships are sunk."
      : "Computer wins! Your fleet is sunk.";
  }
  return `You: ${result.playerResult}. Computer: ${result.computerResult}.`;
}

function render() {
  const inSetup = !game.started;
  const over = game.winner !== null;

  renderBoard(playerBoardEl, game.human.gameboard, {
    showShips: true,
    interactive: inSetup && game.nextShipLength() !== null,
  });
  renderBoard(enemyBoardEl, game.computer.gameboard, {
    showShips: false,
    interactive: game.started && !over,
  });

  showSetupControls(inSetup);
  setStartEnabled(game.isFleetReady());
  setRotateLabel(orientation);

  if (inSetup) setMessage(setupMessage());
}

function startNewGame() {
  game = new Game();
  orientation = "horizontal";
  render();
}

// --- Setup phase: player board pe ships rakhna ---

playerBoardEl.addEventListener("mouseover", (event) => {
  clearPreview(playerBoardEl);

  const coord = getCellCoord(event);
  const length = game.nextShipLength();
  if (!coord || game.started || length === null) return;

  const board = game.human.gameboard;
  showPreview(
    playerBoardEl,
    board.getShipCoords(length, coord, orientation),
    board.canPlaceShip(length, coord, orientation)
  );
});

playerBoardEl.addEventListener("mouseleave", () => {
  clearPreview(playerBoardEl);
});

playerBoardEl.addEventListener("click", (event) => {
  const coord = getCellCoord(event);
  if (!coord || game.started) return;

  try {
    game.placeHumanShip(coord, orientation);
  } catch {
    setMessage("Ship doesn't fit there, try another spot.");
    return;
  }
  render();
});

rotateBtn.addEventListener("click", () => {
  orientation = orientation === "horizontal" ? "vertical" : "horizontal";
  render();
});

randomizeBtn.addEventListener("click", () => {
  game.randomizeHumanFleet();
  render();
});

resetBtn.addEventListener("click", () => {
  game.resetHumanFleet();
  render();
});

startBtn.addEventListener("click", () => {
  game.start();
  setMessage("Your turn: click a cell on the enemy board.");
  render();
});

// --- Battle phase: enemy board pe attack ---

enemyBoardEl.addEventListener("click", (event) => {
  const coord = getCellCoord(event);
  if (!coord || !game.started || game.winner) return;

  const result = game.playRound(coord);
  setMessage(messageFor(result));
  render();
});

newGameBtn.addEventListener("click", startNewGame);

startNewGame();
