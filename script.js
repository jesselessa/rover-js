// Add year to footer
const year = document.querySelector(".year");
const date = new Date().getFullYear();
year.append(date);

// Select game elements
const grid = document.querySelector("#grid");
const roverInfo = document.querySelector("#roverInfo");
const moveInput = document.querySelector("#move");
const submit = document.querySelector(".submit");
const reset = document.querySelector(".reset");

const rover = {
  direction: "N",
  x: 0, // x = row index
  y: 0, // y = column index
};

// Initialize grid
for (let r = 0; r < 10; r++) {
  for (let c = 0; c < 10; c++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }
}

// Update grid with Rover's position
function updateGrid() {
  const cells = document.querySelectorAll(".cell");
  // Empty content for each cell
  cells.forEach((cell) => (cell.textContent = ""));

  // Calculate the index of the cell corresponding to current position of rover
  const roverCellIndex = rover.x * 10 + rover.y;
  cells[roverCellIndex].textContent = rover.direction;
}

// Update Rover's information
function updateRoverInfo() {
  roverInfo.innerHTML = `
        <p>Current position and direction of rover&nbsp;:</p>
        <p>- Position : ${rover.x}/${rover.y}</p>
        <p>- Direction : ${rover.direction}</p>        
      `;
}

// Handle user's move submission
function submitMove() {
  const move = moveInput.value.toLowerCase();
  pilotRover(move);
  updateGrid();
  updateRoverInfo();
}
submit.addEventListener("click", submitMove);

// Reset
function resetGridAndInfo() {
  rover.direction = "N";
  rover.x = 0;
  rover.y = 0;

  updateGrid();
  updateRoverInfo();
}
reset.addEventListener("click", resetGridAndInfo);

// Change Rover's directions
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

// Define Rover's moves
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
      if (rover.y === 9) {
        alert("You can't move forward.");
        return;
      }
      rover.y++;
      break;

    case "S":
      if (rover.x === 9) {
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
      if (rover.x === 9) {
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
      if (rover.y === 9) {
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

function updateGridAndInfo(indexRow, indexColumn) {
  // Check if move is valid
  const isValidMove =
    indexRow >= 0 && indexRow < 10 && indexColumn >= 0 && indexColumn < 10;

  if (isValidMove) {
    // Update grid with new position and direction
    updateGrid();
  }
  return;
}

function displayInitialGrid(rover) {
  rover.direction = "N";
  updateGrid();
  updateRoverInfo();
}

// Initial display
displayInitialGrid(rover);

// TODO - Comment former code and uncomment below if you want to play Rover game with console using Prompt library
// // Use "prompt" library
// const prompt = require("prompt");

// const grid = [
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
//   [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
// ];

// // Rover's initial state
// const rover = {
//   direction: "N",
//   x: 0, // x = row index
//   y: 0, // y = column index
//   travelLog: [],
// };

// // Change Rover's directions
// function turnLeft(rover) {
//   switch (rover.direction) {
//     case "N":
//       rover.direction = "W";
//       break;
//     case "W":
//       rover.direction = "S";
//       break;
//     case "S":
//       rover.direction = "E";
//       break;
//     case "E":
//       rover.direction = "N";
//       break;
//     default:
//       console.log("You can't execute that command.");
//       return;
//   }

//   grid[rover.x][rover.y] = rover.direction; // Update grid with Rover's new position and direction
// }

// function turnRight(rover) {
//   switch (rover.direction) {
//     case "N":
//       rover.direction = "E";
//       break;
//     case "E":
//       rover.direction = "S";
//       break;
//     case "S":
//       rover.direction = "W";
//       break;
//     case "W":
//       rover.direction = "N";
//       break;
//     default:
//       return;
//   }

//   grid[rover.x][rover.y] = rover.direction;
// }

// // Define Rover's moves
// function moveForward(rover) {
//   switch (rover.direction) {
//     case "N":
//       if (rover.x === 0) {
//         console.log("You can't move forward.");
//         return false;
//       }

//       rover.x--;
//       return true;

//     case "E":
//       if (rover.y === grid.length - 1) {
//         console.log("You can't move forward.");
//         return false;
//       }
//       rover.y++;
//       return true;

//     case "S":
//       if (rover.x === grid[0].length - 1) {
//         console.log("You can't move forward.");
//         return false;
//       }
//       rover.x++;
//       return true;

//     case "W":
//       if (rover.y === 0) {
//         console.log("You can't move forward.");
//         return false;
//       }
//       rover.y--;
//       return true;

//     default:
//       return false;
//   }
// }

// function moveBackward(rover) {
//   switch (rover.direction) {
//     case "N":
//       if (rover.x === grid[0].length - 1) {
//         console.log("You can't move backward.");
//         return false;
//       }
//       rover.x++;

//       return true;

//     case "E":
//       if (rover.y === 0) {
//         console.log("You can't move backward.");
//         return false;
//       }
//       rover.y--;

//       return true;

//     case "S":
//       if (rover.x === 0) {
//         console.log("You can't move backward.");
//         return false;
//       }
//       rover.x--;
//       return true;

//     case "W":
//       if (rover.y === grid.length - 1) {
//         console.log("You can't move backward.");
//         return false;
//       }
//       rover.y++;
//       return true;

//     default:
//       return false;
//   }
// }

// function updateGridAndHistory(prevX, prevY, newX, newY, direction) {
//   // Check if move is valid
//   const isValidMove =
//     newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length;

//   if (isValidMove) {
//     // Delete former position on grid
//     grid[prevX][prevY] = " ";

//     // Update grid with Rover's new position and direction
//     grid[newX][newY] = direction;

//     // Update history if there is a move
//     if (prevX !== newX || prevY !== newY) {
//       rover.travelLog.push(`Moved from ${prevX}/${prevY} to ${newX}/${newY}.`);
//     }
//   } else {
//     console.log("Invalid move.");
//   }
// }

// // Display initial state of grid
// function displayInitialGrid() {
//   // Update grid with initial direction
//   grid[rover.x][rover.y] = rover.direction;

//   console.table(grid);
//   console.log("Rover's initial position and direction:");
//   console.log(`- Position: ${rover.x}/${rover.y}`);
//   console.log(`- Direction: ${rover.direction}\n`);
// }

// // Pilot Rover and log its moves
// function pilotRover(str) {
//   // Save current position in order to restore it in case of invalid move
//   const prevX = rover.x;
//   const prevY = rover.y;

//   switch (str) {
//     case "l":
//       turnLeft(rover);
//       break;

//     case "r":
//       turnRight(rover);
//       rover.travelLog.push("You have turned right.");
//       break;

//     case "f":
//       if (moveForward(rover)) {
//         rover.travelLog.push("You have moved forward.");
//       } else {
//         console.log("You can't execute that command.");
//         return;
//       }
//       break;

//     case "b":
//       if (moveBackward(rover)) {
//         rover.travelLog.push("You have moved backward.");
//       } else {
//         console.log("You can't execute that command.");
//         return;
//       }
//       break;

//     default:
//       console.log("You can't execute that command.");
//       return;
//   }

//   // Update grid and history
//   updateGridAndHistory(prevX, prevY, rover.x, rover.y, rover.direction);

//   // Display grid after every move
//   console.table(grid);

//   // Display Rover's information
//   console.log("Rover's current position and direction:");
//   console.log(`- Position: ${rover.x}/${rover.y}`);
//   console.log(`- Direction: ${rover.direction}\n`);
//   console.log(`Your Rover's history: \n${rover.travelLog.join("\n")}`);
// }

// // Define validation schema
// const schema = {
//   properties: {
//     move: {
//       description:
//         "What's Rover's next move? (Use 'l' for left, 'r' for right, 'f' for forward, 'b' for backward)",
//       type: "string",
//       pattern: /^[lrfb]+$/,
//       message: "Invalid input. Please use 'l', 'r', 'f', or 'b'.",
//     },
//   },
// };

// // Get user's input
// function getInput() {
//   return new Promise((resolve, reject) => {
//     prompt.get(schema, (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result.move);
//       }
//     });
//   });
// }

// // Handle move received by user in console
// async function handleInput(move) {
//   // Log results
//   console.log("Command-line input received:", move);

//   // Pilot Rover with user's input
//   pilotRover(move);

//   // Wait for next user input
//   await getUserInput();
// }

// // Keep prompting user
// async function getUserInput() {
//   try {
//     const userInput = await getInput();

//     handleInput(userInput);
//   } catch (error) {
//     console.error("Error getting user input:", error.message);
//   }
// }

// // Start prompt
// prompt.start();

// // Display initial state of grid
// displayInitialGrid();

// // Call first input
// getUserInput();
