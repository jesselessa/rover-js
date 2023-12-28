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
  x: 0,
  y: 0,
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
  }

  grid[rover.x][rover.y] = rover.direction; // Update grid with new direction
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
      console.log("You can't execute that command");
  }

  grid[rover.x][rover.y] = rover.direction;
}

// Define Rover's moves
function moveForward(rover) {
  grid[rover.x][rover.y] = " "; // Delete former position on grid

  switch (rover.direction) {
    case "N":
      if (rover.x === 0) {
        console.log("You can't move forward.");
        return;
      }
      rover.x--;
      break;
    case "E":
      if (rover.y === grid.length - 1) {
        console.log("You can't move forward.");
        return;
      }
      rover.y++;
      break;
    case "S":
      if (rover.x === grid[0].length - 1) {
        console.log("You can't move forward.");
        return;
      }
      rover.x++;
      break;
    case "W":
      if (rover.y === 0) {
        console.log("You can't move forward.");
        return;
      }
      rover.y--;
      break;
    default:
      console.log("You can't execute that command.");
      return;
  }

  console.log("You can move forward.");
  grid[rover.x][rover.y] = rover.direction; // Update grid with new direction
}

function moveBackward(rover) {
  grid[rover.x][rover.y] = " ";

  switch (rover.direction) {
    case "N":
      if (rover.x === grid[0].length - 1) {
        console.log("You can't move backward.");
        return;
      }
      rover.x++;
      break;
    case "E":
      if (rover.y === 0) {
        console.log("You can't move backward.");
        return;
      }
      rover.y--;
      break;
    case "S":
      if (rover.x === 0) {
        console.log("You can't move backward.");
        return;
      }
      rover.x--;
      break;
    case "W":
      if (rover.y === grid.length - 1) {
        console.log("You can't move backward.");
        return;
      }
      rover.y++;
      break;
    default:
      console.log("You can't execute that command.");
      return;
  }

  console.log("You can move backward.");
  grid[rover.x][rover.y] = rover.direction;
}

// Pilot Rover and log its moves
function pilotRover(str) {
  switch (str) {
    case "l":
      turnLeft(rover);
      rover.travelLog.push("You have turned left.");
      break;
    case "r":
      turnRight(rover);
      rover.travelLog.push("You have turned right.");
      break;
    case "f":
      moveForward(rover);
      rover.travelLog.push("You have moved forward.");
      break;
    case "b":
      moveBackward(rover);
      rover.travelLog.push("You have moved backward.");
      break;
    default:
      console.log("You can't execute that command.");
      return;
  }

  // Display grid after every move
  console.table(grid);
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
  console.log("Command-line input received:");
  console.log("move:", move);

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
