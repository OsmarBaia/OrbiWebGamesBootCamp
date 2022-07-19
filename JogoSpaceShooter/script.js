const yourShip = document.querySelector(".player-shooter");
const playArea = document.querySelector("#main-play-area");
const aliensImg = [
  "img/monster-1.png",
  "img/monster-2.png",
  "img/monster-3.png",
];
const instructionsText = document.querySelector(".game-instructions");
const startButton = document.querySelector(".start-button");
let alienInterval;

/**
 * When the user presses the up arrow, the ship moves up. When the user presses the down arrow, the
 * ship moves down. When the user presses the spacebar, the ship fires a laser
 * @param event - The event object is a standard DOM event object. It contains information about the
 * user's interaction such as the x and y coordinates of the mouse pointer, whether a button is
 * pressed, and which key is pressed.
 */
function flyShip(event) {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    moveUp();
  } else if (event.key === "ArrowDown") {
    event.preventDefault();
    moveDown();
  } else if (event.key === " ") {
    event.preventDefault();
    fireLaser();
  }
}

/**
 * If the top position of the ship is 0px, then don't move it. Otherwise, move it up by 50px
 * @returns the top position of the ship.
 */
function moveUp() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue("top");
  if (topPosition === "0px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position -= 50;
    yourShip.style.top = `${position}px`;
  }
}

/**
 * If the ship is at the bottom of the screen, don't move it. Otherwise, move it down 50 pixels
 * @returns the top position of the ship.
 */
function moveDown() {
  let topPosition = getComputedStyle(yourShip).getPropertyValue("top");
  if (topPosition === "510px") {
    return;
  } else {
    let position = parseInt(topPosition);
    position += 50;
    yourShip.style.top = `${position}px`;
  }
}

/**
 * Create a laser element, add it to the play area, and then move it.
 */
function fireLaser() {
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

/**
 * It creates a new laser element, sets its position to be just above the ship, and returns the new
 * laser element
 * @returns the newLaser element.
 */
function createLaserElement() {
  let xPosition = parseInt(
    window.getComputedStyle(yourShip).getPropertyValue("left")
  );
  let yPosition = parseInt(
    window.getComputedStyle(yourShip).getPropertyValue("top")
  );
  let newLaser = document.createElement("img");
  newLaser.src = "img/shoot.png";
  newLaser.classList.add("laser");
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition - 10}px`;
  return newLaser;
}

/**
 * It moves the laser to the right until it reaches the end of the screen, and if it hits an alien, it
 * removes the alien from the screen
 * @param laser - the laser that is being moved
 */
function moveLaser(laser) {
  let laserInterval = setInterval(() => {
    let xPosition = parseInt(laser.style.left);
    let aliens = document.querySelectorAll(".alien");

    aliens.forEach((alien) => {
      //comparando se cada alien foi atingido, se sim, troca o src da imagem
      if (checkLaserCollision(laser, alien)) {
        alien.src = "img/explosion.png";
        alien.classList.remove("alien");
        alien.classList.add("dead-alien");
      }
    });

    if (xPosition === 340) {
      laser.remove();
    } else {
      laser.style.left = `${xPosition + 8}px`;
    }
  }, 10);
}

/**
 * It creates a new alien, adds it to the DOM, and then calls the moveAlien function to make it move
 */
function createAliens() {
  let newAlien = document.createElement("img");
  let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)]; //sorteio de imagens
  newAlien.src = alienSprite;
  newAlien.classList.add("alien");
  newAlien.classList.add("alien-transition");
  newAlien.style.left = "370px";
  newAlien.style.top = `${Math.floor(Math.random() * 330) + 30}px`;
  playArea.appendChild(newAlien);
  moveAlien(newAlien);
}

/**
 * Every 30 milliseconds, move the alien 4 pixels to the left, unless the alien is already at the left
 * edge of the screen, in which case the game is over.
 * @param alien - the alien that is moving
 */
function moveAlien(alien) {
  let moveAlienInterval = setInterval(() => {
    let xPosition = parseInt(
      window.getComputedStyle(alien).getPropertyValue("left")
    );
    if (xPosition <= 50) {
      if (Array.from(alien.classList).includes("dead-alien")) {
        alien.remove();
      } else {
        gameOver();
      }
    } else {
      alien.style.left = `${xPosition - 4}px`;
    }
  }, 30);
}

/**
 * If the laser is not off the screen and the laser is within the alien's x-coordinates, then if the
 * laser is within the alien's y-coordinates, return true, otherwise return false
 * @param laser - the laser object
 * @param alien - the alien that the laser is checking for collision with
 * @returns A boolean value.
 */

function checkLaserCollision(laser, alien) {
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  let laserBottom = laserTop - 20;
  let alienTop = parseInt(alien.style.top);
  let alienLeft = parseInt(alien.style.left);
  let alienBottom = alienTop - 30;
  if (laserLeft != 340 && laserLeft + 40 >= alienLeft) {
    if (laserTop <= alienTop && laserTop >= alienBottom) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

/* Adding an event listener to the start button. When the user clicks on the start button,
the playGame function is called. */
startButton.addEventListener("click", (event) => {
  playGame();
});

/**
 * When the start button is clicked, the start button and instructions text disappear, the flyShip
 * function is called when a key is pressed, and the createAliens function is called every 2 seconds
 */
function playGame() {
  startButton.style.display = "none";
  instructionsText.style.display = "none";
  window.addEventListener("keydown", flyShip);
  alienInterval = setInterval(() => {
    createAliens();
  }, 2000);
}

/**
 * It removes the event listener that allows the player to move the ship, clears the interval that
 * creates the aliens, removes all the aliens and lasers from the screen, and then displays a game over
 * message
 */
function gameOver() {
  window.removeEventListener("keydown", flyShip);
  clearInterval(alienInterval);
  let aliens = document.querySelectorAll(".alien");
  aliens.forEach((alien) => alien.remove());
  let lasers = document.querySelectorAll(".laser");
  lasers.forEach((laser) => laser.remove());
  setTimeout(() => {
    alert("game over!");
    yourShip.style.top = "250px";
    startButton.style.display = "block";
    instructionsText.style.display = "block";
  });
}
