// Use "prompt" library
const prompt = require("prompt");

const grid = [
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
  [" ", " ", " ", " ", " ", " ", " ", " ", " ", " "],
];

const rover = {
  direction: "N",
  x: 0, // x = row index
  y: 0, // y = column index
  travelLog: [],
};

// Change Rover's directions
function turnLeft(rover) {
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

  grid[rover.x][rover.y] = rover.direction; // Update grid with Rover's new position and direction
}

function turnRight(rover) {
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

  grid[rover.x][rover.y] = rover.direction;
}

// Define Rover's moves
function moveForward(rover) {
  switch (rover.direction) {
    case "N":
      if (rover.x === 0) {
        console.log("You can't move forward.");
        return false;
      }

      rover.x--;
      return true;

    case "E":
      if (rover.y === grid.length - 1) {
        console.log("You can't move forward.");
        return false;
      }
      rover.y++;
      return true;

    case "S":
      if (rover.x === grid[0].length - 1) {
        console.log("You can't move forward.");
        return false;
      }
      rover.x++;
      return true;

    case "W":
      if (rover.y === 0) {
        console.log("You can't move forward.");
        return false;
      }
      rover.y--;
      return true;

    default:
      return false;
  }
}

function moveBackward(rover) {
  switch (rover.direction) {
    case "N":
      if (rover.x === grid[0].length - 1) {
        console.log("You can't move backward.");
        return false;
      }
      rover.x++;
      return true;

    case "E":
      if (rover.y === 0) {
        console.log("You can't move backward.");
        return false;
      }
      rover.y--;
      return true;

    case "S":
      if (rover.x === 0) {
        console.log("You can't move backward.");
        return false;
      }
      rover.x--;
      return true;

    case "W":
      if (rover.y === grid.length - 1) {
        console.log("You can't move backward.");
        return false;
      }
      rover.y++;
      return true;

    default:
      return false;
  }
}

function updateGridAndHistory(prevX, prevY, newX, newY, direction) {
  // Check if move is valid
  const isValidMove =
    newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length;

  if (isValidMove) {
    // Delete former position on grid
    grid[prevX][prevY] = " ";

    // Update grid with Rover's new position and direction
    grid[newX][newY] = direction;

    // Update history if there is a move
    if (prevX !== newX || prevY !== newY) {
      rover.travelLog.push(`Moved from ${prevX}/${prevY} to ${newX}/${newY}.`);
    }
  } else {
    console.log("Invalid move.");
  }
}

// Pilot Rover and log its moves
function pilotRover(str) {
  // Save current position in order to restore it in case of invalid move
  const prevX = rover.x;
  const prevY = rover.y;

  switch (str) {
    case "l":
      turnLeft(rover);
      break;

    case "r":
      turnRight(rover);
      rover.travelLog.push("You have turned right.");
      break;

    case "f":
      if (moveForward(rover)) {
        rover.travelLog.push("You have moved forward.");
      } else {
        console.log("You can't execute that command.");
        return;
      }
      break;

    case "b":
      if (moveBackward(rover)) {
        rover.travelLog.push("You have moved backward.");
      } else {
        console.log("You can't execute that command.");
        return;
      }
      break;

    default:
      console.log("You can't execute that command.");
      return;
  }

  // Update grid and history
  updateGridAndHistory(prevX, prevY, rover.x, rover.y, rover.direction);

  // Display grid after every move
  console.table(grid);

  // Display Rover's information
  console.log("Rover's current position and direction:");
  console.log(`- Position: ${rover.x}/${rover.y}`);
  console.log(`- Direction: ${rover.direction}\n`);
  console.log(`Your Rover's history: \n${rover.travelLog.join("\n")}`);
}

// Define validation schema
const schema = {
  properties: {
    move: {
      description:
        "What's Rover's next move? (Use 'l' for left, 'r' for right, 'f' for forward, 'b' for backward)",
      type: "string",
      pattern: /^[lrfb]+$/,
      message: "Invalid input. Please use 'l', 'r', 'f', or 'b'.",
    },
  },
};

// Get user's input
async function getInput() {
  return new Promise((resolve, reject) => {
    prompt.get(schema, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result.move);
      }
    });
  });
}

// Handle user's input
function handleInput(move) {
  // Log results
  console.log("Command-line input received:", move);

  // Pilot Rover with user's input
  pilotRover(move);

  getUserInput();
}

// Keep prompting user
async function getUserInput() {
  try {
    const userInput = await getInput();

    handleInput(userInput);
  } catch (error) {
    console.error("Error getting user input:", error.message);
  }
}

// Start prompt
prompt.start();

// Call first input
getUserInput();
