# Battleship

A browser-based Battleship game built as part of [The Odin Project](https://www.theodinproject.com/) JavaScript curriculum. You play against a computer opponent, and the game logic was built test-first (TDD) with Jest.

## Features

- Place your fleet manually with a live hover preview (green = valid, red = invalid), rotate ships between horizontal and vertical, or randomize and reset your layout
- The computer places its ships randomly
- Turn-based play: click a cell on the enemy board to attack, and the computer replies with a random legal move (it never shoots the same cell twice)
- Hits and misses are shown on both boards, and the enemy fleet stays hidden until it is hit
- The game ends when one side's ships are all sunk
- New Game button to start over at any time

## Tech stack

- JavaScript (ES modules)
- Jest + Babel for unit testing
- Webpack (dev server, production build, `html-webpack-plugin`, `css-loader`, `style-loader`)

## Getting started

```bash
git clone https://github.com/<your-username>/battleship.git
cd battleship
npm install
npm run dev
```

The dev server runs at `http://localhost:8080`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the webpack dev server |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm test` | Run all Jest tests |
| `npm run test:watch` | Run Jest in watch mode |

## Project structure

```
.
├── index.html
├── styles.css
├── babel.config.js
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
├── src/
│   ├── ship.js        # Ship: length, hits, isSunk()
│   ├── gameboard.js   # Gameboard: placement, attacks, misses, allSunk()
│   ├── player.js      # Player: own gameboard, real or computer moves
│   ├── game.js        # Game: setup phase, turns, winner
│   ├── dom.js         # DOM rendering helpers (no game logic)
│   └── index.js       # Wires the game and the DOM together
└── tests/
    ├── ship.test.js
    ├── gameboard.test.js
    ├── player.test.js
    └── game.test.js
```

## How it is built

The game logic (`ship`, `gameboard`, `player`, `game`) contains no DOM code and is fully covered by unit tests. `dom.js` only draws what the game state says, and `index.js` connects the two. Keeping these layers separate means the logic can be tested without a browser.

## Possible improvements

- Smarter computer that targets cells adjacent to a hit
- Drag and drop ship placement
- Two-player mode with a "pass device" screen

## Credits

Project idea from [The Odin Project](https://www.theodinproject.com/).
