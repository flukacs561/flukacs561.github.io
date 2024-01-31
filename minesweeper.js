// TODO
// stop the game when won

const numRows = 10;
const numCols = 10;
const numMines = 3;

const gameBoard = document.getElementById("gameBoard");
let board = [];

function gameWon() {
	return board.flatMap(row => (row.filter(field => (!field.isMine && !field.revealed)))).length == 0
}

function initializeBoard() {
  // Initialize an empty board
  for (let i = 0; i < numRows; i++) {
    board[i] = Array.from({ length: numCols }, () => ({
      isMine: false,
      revealed: false,
      count: 0,
    }));
  }

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const row = getRandomIndex(numRows);
    const col = getRandomIndex(numCols);

    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate counts for each cell
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (!board[i][j].isMine) {
        board[i][j].count = countMinesNearby(i, j);
      }
    }
  }
}

function getRandomIndex(max) {
  return Math.floor(Math.random() * max);
}

function countMinesNearby(row, col) {
  let count = 0;

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const ni = row + dx;
      const nj = col + dy;

      if (
        ni >= 0 &&
        ni < numRows &&
        nj >= 0 &&
        nj < numCols &&
        board[ni][nj].isMine
      ) {
        count++;
      }
    }
  }

  return count;
}

function revealCell(row, col) {
  if (isInvalidCell(row, col)) {
    return;
  }

  const cell = board[row][col];

  if (cell.revealed) {
    return;
  }

  cell.revealed = true;

  if (cell.isMine) {
    handleGameOver();
  } else if (cell.count === 0) {
    revealAdjacentCells(row, col);
	 if (gameWon()) {
	 	console.log(gameWon())
	 	alert("You won!");
	 }
  } else if (gameWon()) {
		alert("You won!");
	}

  renderBoard();
}

function isInvalidCell(row, col) {
  return (
    row < 0 ||
    row >= numRows ||
    col < 0 ||
    col >= numCols ||
    board[row][col].revealed
  );
}

function revealAdjacentCells(row, col) {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      revealCell(row + dx, col + dy);
    }
  }
}

function handleGameOver() {
  // Handle game over logic here
  alert("Game Over! You stepped on a mine.");
	initializeBoard();
	renderBoard();
}

function renderBoard() {
  gameBoard.innerHTML = "";

  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const cell = createCellElement(i, j);
      gameBoard.appendChild(cell);
    }
    gameBoard.appendChild(document.createElement("br"));
  }
}

function createCellElement(row, col) {
  const cell = document.createElement("div");
  cell.className = "cell";

  if (board[row][col].revealed) {
    cell.classList.add("revealed");

    if (board[row][col].isMine) {
      cell.classList.add("mine");
      cell.textContent = "!!!!";
    } else if (board[row][col].count > 0) {
      cell.textContent = board[row][col].count;
    }
  }

  cell.addEventListener("click", () => revealCell(row, col));

  return cell;
}

// Initialize and render the initial state of the board
initializeBoard();
renderBoard();

