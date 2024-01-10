// Constants
const MIN_GRID_SIZE = 8;
const MAX_GRID_SIZE = 10;

// Select game elements
const grid = document.querySelector("#board-grid");
const arrowGrid = document.querySelector("#arrow-grid");
const arrowButtons = document.querySelectorAll(".arrow");
const roverInfo = document.querySelector("#rover-info");

// const pokemonInfo = document.querySelector(".pokemon-info");

// Rover object
const rover = {
  direction: "N",
  x: 0, // x = row index
  y: 0, // y = column index
};

// Display initial grid
displayInitialGrid();

function displayInitialGrid() {
  initGrid();
  updateGridAndInfo(rover.x, rover.y);
}

// Get grid size depending on screen width
function getGridSize() {
  return window.innerWidth <= 475 ? MIN_GRID_SIZE : MAX_GRID_SIZE;
}

// Generate grid
function initGrid() {
  const gridSize = getGridSize();

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      grid.appendChild(cell);
    }
  }
}

// Update grid with rover position
function updateGrid() {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => (cell.textContent = ""));

  // Calculate index of cell corresponding to current position of rover
  const gridSize = getGridSize();
  const roverCellIndex = rover.x * gridSize + rover.y;
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
  const gridSize = getGridSize();

  const isValidMove =
    indexRow >= 0 &&
    indexRow < gridSize &&
    indexColumn >= 0 &&
    indexColumn < gridSize;

  if (isValidMove) {
    updateGrid();
    updateRoverInfo();
  }
}

// Handle rover moves with arrow buttons
arrowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.classList[1]; // Extracts direction from class (2 classes on button :'arrow' & '[direction_name]')
    pilotRover(direction.charAt(0)); // First letter of direction
  });
});

// Reset grid and info
const resetButton = document.createElement("div");
resetButton.classList.add("reset");
resetButton.textContent = "R";
arrowGrid.append(resetButton);

const resetGridAndInfo = () => {
  rover.direction = "N";
  rover.x = 0;
  rover.y = 0;

  updateGridAndInfo(rover.x, rover.y);
};

resetButton.addEventListener("click", resetGridAndInfo);

// Rover directions and moves
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

function moveForward(rover) {
  const gridSize = getGridSize();

  switch (rover.direction) {
    case "N":
      if (rover.x === 0) {
        openAlertModal("You can't move forward&nbsp;!");
        return;
      }
      rover.x--;
      break;

    case "E":
      if (rover.y === gridSize - 1) {
        openAlertModal("You can't move forward&nbsp;!");
        return;
      }
      rover.y++;
      break;

    case "S":
      if (rover.x === gridSize - 1) {
        openAlertModal("You can't move forward&nbsp;!");
        return;
      }
      rover.x++;
      break;

    case "W":
      if (rover.y === 0) {
        openAlertModal("You can't move forward&nbsp;!");
        return;
      }
      rover.y--;
      break;

    default:
      return;
  }
}

function moveBackward(rover) {
  const gridSize = getGridSize();

  switch (rover.direction) {
    case "N":
      if (rover.x === gridSize - 1) {
        openAlertModal("You can't move backward&nbsp;!");
        return;
      }
      rover.x++;
      break;

    case "E":
      if (rover.y === 0) {
        openAlertModal("You can't move backward&nbsp;!");
        return;
      }
      rover.y--;
      break;

    case "S":
      if (rover.x === 0) {
        openAlertModal("You can't move backward&nbsp;!");
        return;
      }
      rover.x--;
      break;

    case "W":
      if (rover.y === gridSize - 1) {
        openAlertModal("You can't move backward&nbsp;!");
        return;
      }
      rover.y++;
      break;

    default:
      return;
  }
}

// Rover driving
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
      return;
  }

  updateGridAndInfo(rover.x, rover.y);
}

// Add year to footer
const year = document.querySelector(".year");
const date = new Date().getFullYear();
year.append(date);

// Handle alert message
const modalContainer = document.querySelector("#modal-container");
const alertMessage = document.querySelector(".alert-message");
const closeButtons = document.querySelectorAll(".close-button");

function openAlertModal(message) {
  modalContainer.style.display = "block";
  alertMessage.innerHTML = message;

  closeButtons.forEach((button) =>
    button.addEventListener("click", closeAlertModal)
  );
}

function closeAlertModal() {
  modalContainer.style.display = "none";
}

// Handle orientation change depending on screen width
function handleOrientationChange() {
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isSmallScreen = window.innerWidth <= 1000;

  if (isLandscape && isSmallScreen) {
    // Custom modal
    closeButtons.forEach((button) => (button.style.display = "none"));
    alertMessage.style.marginBottom = "0";

    openAlertModal("Landscape mode is not allowed.");
    // Force portrait mode
    screen.orientation.lock("portrait");
  } else {
    // Custom modal
    closeButtons.forEach((button) => (button.style.display = "block"));
    alertMessage.style.marginBottom = "20px";

    // In portrait mode, close modal
    closeAlertModal();
  }
}

window.addEventListener("orientationchange", handleOrientationChange);
// Force message to appear as soon as screen width changes
window.addEventListener("resize", handleOrientationChange);

// Handle background music
const backgroundMusic = document.querySelector("#background-music");
const toggleDiv = document.querySelector("#toggle");
const toggleMusicBtn = document.querySelector("#toggle-music");
const caption = document.querySelector("figcaption");

function handleMusicBg() {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    toggleMusicBtn.src = "./images/sound-off.png";
    updateCaption();
  } else {
    backgroundMusic.pause();
    toggleMusicBtn.src = "./images/sound-on.png";
    updateCaption();
  }
}

function updateCaption() {
  if (window.innerWidth <= 700) {
    caption.textContent = "";
  } else {
    caption.textContent = backgroundMusic.paused ? "Sound on" : "Sound off";
  }
}
updateCaption(); // Actualize caption on loading page

toggleDiv.addEventListener("click", handleMusicBg);
window.addEventListener("resize", updateCaption);
