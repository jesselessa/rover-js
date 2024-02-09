// Constants
const MIN_GRID_SIZE = 8;
const MAX_GRID_SIZE = 10;

// Global variables related to game logic
const startButton = document.querySelector("#start");
const gameRules = document.querySelector("#game-rules");
const grid = document.querySelector("#board-grid");
const arrowGrid = document.querySelector("#arrow-grid");
const arrowButtons = document.querySelectorAll(".arrow");
const resetButton = document.createElement("div");
const roverInfo = document.querySelector("#rover-info");
const timer = document.querySelector("#timer");
let cells;

let gameStarted;
let alienFound;
let timerId; // ID returned by setTimeout

// Set rover object
const rover = {
  x: 0, // x = row index
  y: 0, // y = column index
  direction: "N",
};

// Display initial grid on loading page
displayInitialGrid();

function displayInitialGrid() {
  // Initialize states
  gameStarted = false;
  alienFound = false;
  timerId = undefined;

  initGrid();

  // Declare 'cells' here after DOM is loaded to prevent error message saying 'textContent' property has a value 'undefined' in updateGrid function
  cells = document.querySelectorAll(".cell");

  updateGridAndInfo(rover.x, rover.y);
  randomlyHideAlien();
}

// Handle click on start button
startButton.addEventListener("click", () => {
  if (!gameStarted) {
    // Game won (end of game)
    if (alienFound) {
      openModalAlert("Click on 'R' button to reset the grid.");
      return;
    }
    // Game lost (end of game) or not started yet
    else {
      // Game not started yet - Launch game
      if (!timerId) {
        gameStarted = true;
        startTimer();
      }
      // Game lost at delay expiration - Neutralize button
      else {
        openModalAlert("Click on 'R' button to reset the grid.");
        return;
      }
    }
  }
  // Game in progress
  else {
    openModalAlert("Game still in progress.");
  }
});

// Handle click on game rules button
gameRules.addEventListener("click", () => {
  openModalAlert(
    "<span>How to play ? *</span><br/><br/>Click on 'Start game' button to start piloting the rover by using the directional arrows, in order to find the alien hidden on Mars in less than 30 seconds.<br/><br/>Click on 'R' button to reset the grid.<br/><br/>You can turn the background music on/off by clicking on the loudspeaker icon.<br/><br/><span>*</span> <span  class='ux'>For a better user experience, it is recommended to play this game on tablet or computer.</span>"
  );
});

// Create a 30s timer
function startTimer() {
  const endTime = Date.now() + 30000;

  function updateTimer() {
    const now = Date.now();
    const timeLeft = endTime - now;
    const secondsLeft = Math.ceil(timeLeft / 1000);

    if (timeLeft <= 0) {
      if (!alienFound) {
        openModalAlert(
          "GAME OVER - You didn't find the alien within the deadline &#128125&nbsp;!"
        );

        gameStarted = false; // End game
      }

      // Update timer text
      timer.textContent = "0";
    }
    // Remaining time
    else {
      if (alienFound) {
        // Clear existing timer
        if (timerId) clearTimeout(timerId);

        openModalAlert(
          `CONGRATULATIONS - You've found an alien on Mars at position ${rover.x}/${rover.y} &#128125&#127881&nbsp;!`
        );

        // End game
        gameStarted = false;
      } else {
        // Update timer every second
        timerId = setTimeout(updateTimer, 1000);
        timer.textContent = secondsLeft;
      }
    }
  }

  // Start initial timer
  updateTimer();
}

// Get grid size depending on screen width
function getGridSize() {
  return window.innerWidth <= 485 ? MIN_GRID_SIZE : MAX_GRID_SIZE;
}

// Randomly hide alien under a grid cell except at position 0/0
function randomlyHideAlien() {
  const gridSize = getGridSize();
  let randomX, randomY;

  do {
    randomX = Math.floor(Math.random() * gridSize);
    randomY = Math.floor(Math.random() * gridSize);
  } while (randomX === 0 && randomY === 0);

  const randomIndex = randomX * gridSize + randomY;
  // Add 'has-alien' class to a random cell
  cells[randomIndex].classList.add("has-alien");
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
    pilotRover(direction.charAt(0)); // First letter of direction
  });
});

// Handle 'Reset' button
resetButton.classList.add("reset");
resetButton.textContent = "R";
arrowGrid.append(resetButton);

function resetGridAndInfo() {
  // Clear existing timer
  if (timerId) clearTimeout(timerId);

  // Reset states
  gameStarted = false;
  alienFound = false;
  timerId = undefined;

  // Initialize rover position and direction
  rover.x = 0;
  rover.y = 0;
  rover.direction = "N";

  // Reset timer to 30 seconds
  timer.textContent = "30";

  // Ensure position of alien image is renewed
  cells.forEach((cell) => {
    cell.classList.remove("has-alien");
  });

  randomlyHideAlien();
  updateGridAndInfo(rover.x, rover.y);
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

// Pilot the rover
function pilotRover(move) {
  if (!gameStarted) {
    // Game won (end of game)
    if (alienFound) {
      openModalAlert("Click on 'R' button to reset the grid.");
    }
    // Alien not found
    else {
      // Game not started yet
      if (!timerId) {
        openModalAlert("Click on 'Start Game' to start piloting the rover.");
      }
      // Game lost (end of game)
      else {
        openModalAlert("Click on 'R' button to reset the grid.");
      }
    }

    // Neutralize commands if 'gameStarted' is falsy
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
    // Custom modal - Remove closure buttons
    closeButtons.forEach((button) => (button.style.display = "none"));
    alertMessage.style.marginBottom = "0";

    openModalAlert("Please, turn your device.");

    // Force portrait mode
    screen.orientation.lock("portrait");
  } else {
    // Custom modal - In portrait mode, closure buttons reappear
    closeButtons.forEach((button) => (button.style.display = "block"));
    alertMessage.style.marginBottom = "20px";

    // Close modal automatically in portrait mode
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
