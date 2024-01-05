// Add year to footer
const year = document.querySelector(".year");
const date = new Date().getFullYear();
year.append(date);

// Select game elements
const grid = document.querySelector("#grid");
const roverInfo = document.querySelector("#roverInfo");
const arrowGrid = document.querySelector("#arrowGrid");
const arrowButtons = document.querySelectorAll(".arrow");

// Set rover object
const rover = {
  direction: "N",
  x: 0, // x = row index
  y: 0, // y = column index
};

// Set size of grid
const GRID_SIZE = 10;

// Generate grid
function initGrid() {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      grid.appendChild(cell);
    }
  }
}
initGrid();

// Update grid with rover position
function updateGrid() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => (cell.textContent = ""));

  // Calculate index of cell corresponding to current position of rover
  const roverCellIndex = rover.x * GRID_SIZE + rover.y;
  cells[roverCellIndex].textContent = rover.direction;
}

// Update rover information
function updateRoverInfo() {
  roverInfo.innerHTML = `
        <p>CURRENT POSITION AND DIRECTION&nbsp;:</p>
        <p>- <span>Position :</span> ${rover.x}/${rover.y}</p>
        <p>- <span>Direction :</span> ${rover.direction}</p>        
      `;
}

// Update grid and info
function updateGridAndInfo(indexRow, indexColumn) {
  const isValidMove =
    indexRow >= 0 &&
    indexRow < GRID_SIZE &&
    indexColumn >= 0 &&
    indexColumn < GRID_SIZE;

  if (isValidMove) {
    updateGrid();
    updateRoverInfo();
  }
}

// Handle rover moves with arrow buttons
arrowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.classList[1]; // Extracts direction from class
    pilotRover(direction.charAt(0));
  });
});

// Reset button
const resetButton = document.createElement("div");

resetButton.classList.add("reset");
resetButton.innerHTML = "R";
arrowGrid.appendChild(resetButton);

function resetGridAndInfo() {
  rover.direction = "N";
  rover.x = 0;
  rover.y = 0;

  updateGridAndInfo(rover.x, rover.y);
}
resetButton.addEventListener("click", resetGridAndInfo);

// Rover directions
function turnLeft() {
  switch (rover.direction) {
    case "N":
      rover.direction = "W";
      break;
    case "W":
      rover.direction = "S";
      break;
    case "S":
      rover.direction = "E";
      break;
    case "E":
      rover.direction = "N";
      break;
    default:
      console.log("You can't execute that command.");
      return;
  }
}

function turnRight() {
  switch (rover.direction) {
    case "N":
      rover.direction = "E";
      break;
    case "E":
      rover.direction = "S";
      break;
    case "S":
      rover.direction = "W";
      break;
    case "W":
      rover.direction = "N";
      break;
    default:
      return;
  }
}

// Rover moves
function moveForward(rover) {
  switch (rover.direction) {
    case "N":
      if (rover.x === 0) {
        alert("You can't move forward.");
        return;
      }
      rover.x--;
      break;

    case "E":
      if (rover.y === GRID_SIZE - 1) {
        alert("You can't move forward.");
        return;
      }
      rover.y++;
      break;

    case "S":
      if (rover.x === GRID_SIZE - 1) {
        alert("You can't move forward.");
        return;
      }
      rover.x++;
      break;

    case "W":
      if (rover.y === 0) {
        alert("You can't move forward.");
        return;
      }
      rover.y--;
      break;

    default:
      return;
  }
}

function moveBackward(rover) {
  switch (rover.direction) {
    case "N":
      if (rover.x === GRID_SIZE - 1) {
        alert("You can't move backward.");
        return;
      }
      rover.x++;
      break;

    case "E":
      if (rover.y === 0) {
        alert("You can't move backward.");
        return;
      }
      rover.y--;
      break;

    case "S":
      if (rover.x === 0) {
        alert("You can't move backward.");
        return;
      }
      rover.x--;
      break;

    case "W":
      if (rover.y === GRID_SIZE - 1) {
        alert("You can't move backward.");
        return;
      }
      rover.y++;
      break;

    default:
      return;
  }
}

function pilotRover(move) {
  switch (move) {
    case "l":
      turnLeft();
      break;

    case "r":
      turnRight();
      break;

    case "f":
      moveForward(rover);
      break;

    case "b":
      moveBackward(rover);
      break;

    default:
      alert(
        "Invalid move. Use 'l' for left, 'r' for right, 'f' for forward and 'b' for backward."
      );
      return;
  }

  updateGridAndInfo(rover.x, rover.y);
}

function displayInitialGrid(rover) {
  updateGridAndInfo(rover.x, rover.y);
}

// Grid initial display
displayInitialGrid(rover);
