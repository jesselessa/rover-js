// Set grid size
const GRID_SIZE = 10; // 10x10 grid

// Global variables related to game logic
const startButton = document.querySelector("#start");
const gameRules = document.querySelector("#game-rules");
const grid = document.querySelector("#board-grid");
const arrowGrid = document.querySelector("#arrow-grid");
const arrowButtons = document.querySelectorAll(".arrow");
const roverInfo = document.querySelector("#rover-info");
const timer = document.querySelector("#timer");
let cells;

let gameStarted;
let alienFound;
let timerId; // ID returned by setTimeout

// =======================
// CREATE AND UPDATE GRID
// =======================

// Initialize rover state
const rover = {
  x: 0, // x = row index
  y: 0, // y = column index
  direction: "N",
};

// Display initial grid on loading page
displayInitialGrid();

function displayInitialGrid() {
  // Initialize game states
  gameStarted = false;
  alienFound = false;
  timerId = undefined;

  initGrid();

  // Declare 'cells' here after DOM is loaded to prevent error message saying 'textContent' property has a value 'undefined' in updateGrid function
  cells = document.querySelectorAll(".cell");

  updateGridAndInfo(rover.x, rover.y);
  randomlyHideAlien();
}

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

// Update grid with rover position
function updateGrid() {
  // Clear all cells content (remove text or images)
  cells.forEach((cell) => (cell.innerHTML = ""));

  // Get the current cell where the rover is located
  const roverCellIndex = rover.x * GRID_SIZE + rover.y;
  const roverCell = cells[roverCellIndex];

  // If the rover is on a cell with an alien, display the alien image
  if (roverCell.classList.contains("has-alien")) {
    alienFound = true;
    // Display the alien image
    roverCell.innerHTML =
      '<img src="./images/alien.png" class="alien" alt="alien" />';
  } else {
    // Display the rover image
    roverCell.innerHTML = `<img src="./images/mars-rover.png" class="rover" alt="rover" />`;

    // Apply rotation based on the rover direction
    const roverImg = roverCell.querySelector(".rover"); // Select the rover image element from the current cell where it is located

    let rotation = 0;

    switch (rover.direction) {
      case "N":
        rotation = 0; // Facing North (default)
        break;
      case "E":
        rotation = 90; // East
        break;
      case "S":
        rotation = 180; // South
        break;
      case "W":
        rotation = 270; // West
        break;
    }

    // Apply CSS transform to rotate the image smoothly
    roverImg.style.transform = `rotate(${rotation}deg)`;
    roverImg.style.transition = "transform 0.3s ease";
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

// Randomly hide alien under a grid cell except at position 0/0
//! Note : index of a cell in a 2D grid => index = x * m + y (where x = row index, y = column index, n = number of rows and m = number of columns)
function randomlyHideAlien() {
  let randomX, randomY;

  do {
    randomX = Math.floor(Math.random() * GRID_SIZE);
    randomY = Math.floor(Math.random() * GRID_SIZE);
  } while (randomX === 0 && randomY === 0); // Prevent alien to be at starting position (same as rover initial position)

  const randomIndex = randomX * GRID_SIZE + randomY;
  // Add 'has-alien' class to a random cell
  cells[randomIndex].classList.add("has-alien");
}

// =======================
// CREATE AND START TIMER
// =======================

function startTimer() {
  const endTime = Date.now() + 30000; // 30 seconds from now

  // Update timer every second
  function updateTimer() {
    const now = Date.now();
    const timeLeft = endTime - now;
    const secondsLeft = Math.ceil(timeLeft / 1000);

    if (timeLeft <= 0) {
      if (!alienFound) {
        openModalAlert(
          "GAME OVER - You didn't find the alien within the deadline &#128125&nbsp;!" // Unicode for alien emoji
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
          `CONGRATULATIONS - You've found an alien on Mars at position ${rover.x}/${rover.y} &#128125&#127881&nbsp;!` // Unicode for alien and party popper emojis
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

// =======================
// GAME CONTROLS
// =======================

// Handle click on 'Start game' button
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

        // Enable keyboard controls + focus for arrow keys
        document.body.setAttribute("tabindex", "0"); // Make body focusable and able to capture keyboard events
        document.body.focus();
        window.addEventListener("keydown", handleKeyboard);
      }
      // Game lost at delay expiration - Neutralize 'Start game' button
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

// Handle click on 'Game rules' button
gameRules.addEventListener("click", () => {
  openModalAlert(
    "<span>How to play ?</span><br/><br/>Click on the 'Start game' button to start piloting the rover by using the directional arrows with your mouse or your keyboard in order to find the alien hidden on Mars in less than 30\u00a0seconds.<br/><br/>Click on the 'R' button to reset the grid and the rover position.<br/><br/>You can turn the background music on/off by clicking on the loudspeaker icon."
  );
});

// Handle 'Reset' button
const resetButton = document.createElement("div");
resetButton.classList.add("reset");
resetButton.textContent = "R";
arrowGrid.append(resetButton);
resetButton.addEventListener("click", resetGridAndInfo);

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

  // Disable keyboard controls
  window.removeEventListener("keydown", handleKeyboard); // Prevent keys to remain active when the game is over
}

// === Mouse Controls ===
arrowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.classList[1]; // Extracts direction from 2nd class on button (1st one being 'arrow')
    pilotRover(direction.charAt(0)); // First letter of direction
  });
});

// === Keyboard controls ===
function handleKeyboard(event) {
  switch (event.key) {
    case "ArrowUp":
      pilotRover("f");
      break;
    case "ArrowDown":
      pilotRover("b");
      break;
    case "ArrowLeft":
      pilotRover("l");
      break;
    case "ArrowRight":
      pilotRover("r");
      break;
    default:
      return;
  }
  event.preventDefault(); // Prevent default behavior (scrolling)
}

//=== Rover directions and moves ===
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
  switch (rover.direction) {
    case "N":
      if (rover.x === 0) {
        openModalAlert("You can't move forward&nbsp;!");
        return;
      }
      rover.x--;
      break;

    case "E":
      if (rover.y === GRID_SIZE - 1) {
        openModalAlert("You can't move forward&nbsp;!");
        return;
      }
      rover.y++;
      break;

    case "S":
      if (rover.x === GRID_SIZE - 1) {
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
  switch (rover.direction) {
    case "N":
      if (rover.x === GRID_SIZE - 1) {
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
      if (rover.y === GRID_SIZE - 1) {
        openModalAlert("You can't move backward&nbsp;!");
        return;
      }
      rover.y++;
      break;

    default:
      return;
  }
}

//=== Pilot the rover ===
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

// =======================
// MODAL ALERT AND SCREEN SIZE
// =======================

const modalContainer = document.querySelector("#modal-container");
const alertMessage = document.querySelector(".alert-message");
const closeButtons = document.querySelectorAll(".close-button");
const okButton = document.querySelector(".ok");

function openModalAlert(message) {
  modalContainer.style.display = "block";
  alertMessage.innerHTML = message;
  okButton.textContent = "OK";

  closeButtons.forEach((button) =>
    button.addEventListener("click", closeModalAlert)
  );
}

function closeModalAlert() {
  modalContainer.style.display = "none";
}

// Handle screen size for PC-only gameplay
function handleScreenSize() {
  const isTooSmall = window.innerWidth < 1153;
  const appContainer = document.getElementById("app");

  if (isTooSmall) {
    // Remove close buttons so user cannot bypass the restriction
    closeButtons.forEach((button) => (button.style.display = "none"));
    alertMessage.style.marginBottom = "0";

    // Display message
    openModalAlert(
      "This game is only available on PC. Please, use a larger screen."
    );
  } else {
    // Restore close buttons when screen is wide enough
    closeButtons.forEach((button) => (button.style.display = "block"));
    alertMessage.style.marginBottom = "20px";

    // Close modal automatically when conditions are met
    closeModalAlert();
  }
}

// Trigger the check on page load and on resize
window.addEventListener("load", handleScreenSize);
window.addEventListener("resize", handleScreenSize);

// =======================
// BACKGROUND MUSIC
// =======================

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
updateCaption(); // Update caption on page load

toggleDiv.addEventListener("click", handleMusicBg);
window.addEventListener("resize", updateCaption);

//======================
// FOOTER - CURRENT YEAR
//======================

const year = document.querySelector(".year");
const date = new Date().getFullYear();
year.append(date);
