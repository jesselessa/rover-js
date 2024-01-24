// Constants
const MIN_GRID_SIZE = 8;
const MAX_GRID_SIZE = 10;

// Select game elements
const startButton = document.querySelector("#start");
const gameRules = document.querySelector("#game-rules");
const grid = document.querySelector("#board-grid");
const arrowGrid = document.querySelector("#arrow-grid");
const arrowButtons = document.querySelectorAll(".arrow");
const resetButton = document.createElement("div");
const roverInfo = document.querySelector("#rover-info");
const alienImg = document.querySelector(".alien");
const timer = document.getElementById("timer");

// Set rover object
const rover = {
  x: 0, // x = row index
  y: 0, // y = column index
  direction: "N",
};

// Other global variables
let firstGridDisplay;
let gridReset;
let gameStarted;
let alienFound;
let cells;
let timerId; // ID returned by setTimeout

// Display initial grid on loading page
displayInitialGrid();

function displayInitialGrid() {
  // Initialize game state
  firstGridDisplay = true;
  gridReset = false;
  gameStarted = false;
  alienFound = false;

  initGrid();

  // Declare cells inside function after DOM is loaded to prevent error message saying 'textContent' property in updateGrid function has a value 'undefined'
  cells = document.querySelectorAll(".cell");

  updateGridAndInfo(rover.x, rover.y);
  randomlyHideAlien();
}

// Handle click on start button
startButton.addEventListener("click", () => {
  if (!gameStarted) {
    // Neutralise button after game win to force use of reset button
    if (alienFound) {
      openModalAlert("Click on 'R' button to reset the grid.");
      return;
    }
    // Alien not found - Game not started yet or lost
    else {
      // Reset states and launch timer
      gameStarted = true;
      gridReset = false;
      startTimer();
    }
  }
  //  If game has already started
  else {
    openModalAlert("Game still in progress.");
  }
});

// Handle click on game rules button
gameRules.addEventListener("click", () => {
  openModalAlert(
    "<span>How to play ? *</span><br/><br/>Click on 'Start game' button to start piloting the rover by using the directional arrows, in order to find the alien hidden on Mars in less than 30 seconds.<br/><br/>Click on 'R' button to reset the grid.<br/><br/>You can turn the background music on/off by clicking on the loudspeaker icon.<br/><br/><span>*</span> <span  class='ux'>For a better user experience, it is recommended to play this game on a computer.</span>"
  );
});

// Create a 30s-game timer
function startTimer() {
  const endTime = Date.now() + 30000;

  function updateTimer() {
    const now = Date.now();
    const timeLeft = endTime - now;
    const secondsLeft = Math.ceil(timeLeft / 1000);

    if (timeLeft <= 0) {
      if (!alienFound) {
        openModalAlert(
          "GAME OVER - You didn't find the alien within the deadline &#128125&nbsp;!<br/> Click on 'R' button to reset the grid."
        );

        gameStarted = false; // End game
      }

      timer.textContent = "0";
    } else {
      // if (alienFound) gameStarted = false;
      timer.textContent = secondsLeft;

      // Update timer every second
      timerId = setTimeout(updateTimer, 1000);
    }
  }

  // Start initial timer
  updateTimer();
}

// Randomly hide alien image under a grid cell
function randomlyHideAlien() {
  const randomIndex = Math.floor(Math.random() * cells.length);

  cells.forEach((cell, index) => {
    if (index === randomIndex) {
      cell.classList.add("has-alien");
    }
  });
}

// Get grid size depending on screen width
function getGridSize() {
  return window.innerWidth <= 485 ? MIN_GRID_SIZE : MAX_GRID_SIZE;
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
  cells.forEach((cell) => (cell.textContent = ""));

  // Calculate index of cell depending on rover current position
  const gridSize = getGridSize();
  const roverCellIndex = rover.x * gridSize + rover.y;
  const roverCell = cells[roverCellIndex];
  roverCell.textContent = rover.direction;

  // Check if rover is on a cell with alien
  if (roverCell.classList.contains("has-alien")) {
    alienFound = true; // User won

    // Display image
    roverCell.innerHTML =
      '<img src="./images/alien.png" class="alien" alt="alien" />';

    // Clear existing timer
    clearTimeout(timerId);

    openModalAlert(
      `CONGRATULATIONS - You've found an alien on Mars at position ${rover.x}/${rover.y} &#128125&#127881&nbsp;!</br>Click on 'R' button to reset the grid.`
    );

    // End game
    gameStarted = false;
  }
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
    const direction = button.classList[1]; // Extracts direction from 2nd class on button (1st one being 'arrow')
    pilotrover(direction.charAt(0)); // First letter of direction
  });
});

// Handle 'Reset' button
resetButton.classList.add("reset");
resetButton.textContent = "R";
arrowGrid.append(resetButton);

function resetGridAndInfo() {
  // Reset states
  firstGridDisplay = false;
  gridReset = true;
  gameStarted = false;
  alienFound = false;

  // Clear existing timer and reset it to 30 seconds
  clearTimeout(timerId);
  timer.textContent = "30";

  // Initialize rover position and direction
  rover.x = 0;
  rover.y = 0;
  rover.direction = "N";

  // Update grid and hide alien
  updateGridAndInfo(rover.x, rover.y);
  randomlyHideAlien();
}
resetButton.addEventListener("click", resetGridAndInfo);

// rover directions and moves
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
        openModalAlert("You can't move forward&nbsp;!");
        return;
      }
      rover.x--;
      break;

    case "E":
      if (rover.y === gridSize - 1) {
        openModalAlert("You can't move forward&nbsp;!");
        return;
      }
      rover.y++;
      break;

    case "S":
      if (rover.x === gridSize - 1) {
        openModalAlert("You can't move forward&nbsp;!");
        return;
      }
      rover.x++;
      break;

    case "W":
      if (rover.y === 0) {
        openModalAlert("You can't move forward&nbsp;!");
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
        openModalAlert("You can't move backward&nbsp;!");
        return;
      }
      rover.x++;
      break;

    case "E":
      if (rover.y === 0) {
        openModalAlert("You can't move backward&nbsp;!");
        return;
      }
      rover.y--;
      break;

    case "S":
      if (rover.x === 0) {
        openModalAlert("You can't move backward&nbsp;!");
        return;
      }
      rover.x--;
      break;

    case "W":
      if (rover.y === gridSize - 1) {
        openModalAlert("You can't move backward&nbsp;!");
        return;
      }
      rover.y++;
      break;

    default:
      return;
  }
}

// Rover driving
function pilotrover(move) {
  // Neutralize arrow buttons if gameStarted set to 'false'
  if (!gameStarted) {
    // Game won
    if (alienFound) {
      openModalAlert("Click on 'R' button to reset the grid.");
    }
    // Alien not found - Game not started yet or lost
    else {
      // Check if timer has been launched or not
      if ((firstGridDisplay && !timerId) || (gridReset && !timerId)) {
        openModalAlert("Click on 'Start game' to start piloting the rover.");
      } else {
        openModalAlert("Click on 'R' button to reset the grid.");
      }
    }
    return;
  }

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

function openModalAlert(message) {
  modalContainer.style.display = "block";
  alertMessage.innerHTML = message;

  closeButtons.forEach((button) =>
    button.addEventListener("click", closeModalAlert)
  );
}

function closeModalAlert() {
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

    openModalAlert("Landscape mode is not allowed.");
    // Force portrait mode
    screen.orientation.lock("portrait");
  } else {
    // Custom modal
    closeButtons.forEach((button) => (button.style.display = "block"));
    alertMessage.style.marginBottom = "20px";

    // In portrait mode, close modal
    closeModalAlert();
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
