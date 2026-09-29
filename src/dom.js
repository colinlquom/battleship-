export function renderBoard(container, board, { showShips, interactive }) {
  container.replaceChildren();

  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "cell";
      cell.dataset.row = row;
      cell.dataset.col = col;

      const ship = board.getShipAt([row, col]);

      if (board.isAttacked([row, col])) {
        cell.classList.add(ship ? "hit" : "miss");
        cell.disabled = true;
      } else {
        if (showShips && ship) cell.classList.add("ship");
        if (!interactive) cell.disabled = true;
      }

      container.appendChild(cell);
    }
  }
}

export function getCellCoord(event) {
  const cell = event.target.closest(".cell");
  if (!cell) return null;
  return [Number(cell.dataset.row), Number(cell.dataset.col)];
}

export function showPreview(container, coords, valid) {
  coords.forEach(([row, col]) => {
    const cell = container.querySelector(
      `[data-row="${row}"][data-col="${col}"]`
    );
    if (cell) cell.classList.add(valid ? "preview-ok" : "preview-bad");
  });
}

export function clearPreview(container) {
  container
    .querySelectorAll(".preview-ok, .preview-bad")
    .forEach((cell) => cell.classList.remove("preview-ok", "preview-bad"));
}

export function setMessage(text) {
  document.getElementById("message").textContent = text;
}

export function showSetupControls(visible) {
  document.getElementById("setup-controls").hidden = !visible;
}

export function setStartEnabled(enabled) {
  document.getElementById("start-game").disabled = !enabled;
}

export function setRotateLabel(orientation) {
  document.getElementById("rotate").textContent = `Rotate (${orientation})`;
}
