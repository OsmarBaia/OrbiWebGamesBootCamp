let order = [];
let clickedOrder = [];
let score = 0;

//0 - verde
//1 - vermelho
//2 - amarelo
//3 - azul

const green = document.querySelector(".green");
const red = document.querySelector(".red");
const yellow = document.querySelector(".yellow");
const blue = document.querySelector(".blue");

/**
 * It creates a random number between 0 and 3, adds it to the order array, and then lights up the
 * corresponding color
 */
let shuffleOrder = () => {
  let newColor = Math.floor(Math.random() * 4);
  order[order.length] = newColor;
  clickedOrder = [];

  for (let i in order) {
    let elementColor = createColorElement(order[i]);
    lightColor(elementColor, Number(i) + 1);
  }
};

/**
 * It takes an element and a number, and then adds the class 'selected' to the element after a delay of
 * the number multiplied by 500 milliseconds
 * @param element - the element that will be selected
 * @param number - the number of the button that was pressed
 */
let lightColor = (element, number) => {
  number = number * 500;
  setTimeout(() => {
    element.classList.add("selected");
  }, number - 250);

  setTimeout(() => {
    element.classList.remove("selected");
  });
};

/**
 * It checks if the order of the buttons clicked by the player is the same as the order of the buttons
 * that the computer generated. If it is, the player wins and the next level starts. If it isn't, the
 * game is over
 */
let checkOrder = () => {
  for (let i in clickedOrder) {
    if (clickedOrder[i] != order[i]) {
      gameOver();
      break;
    }
  }
  if (clickedOrder.length == order.length) {
    alert(`Pontuação: ${score}\nVocê acertou! Iniciando próximo nível!`);
    nextLevel();
  }
};

/**
 * When a color is clicked, add it to the clickedOrder array, add the selected class to the color
 * element, and after 250 milliseconds, remove the selected class and check the order
 * @param color - the color that was clicked
 */
let click = (color) => {
  clickedOrder[clickedOrder.length] = color;
  createColorElement(color).classList.add("selected");

  setTimeout(() => {
    createColorElement(color).classList.remove("selected");
    checkOrder();
  }, 250);
};

/**
 * If the color is 0, return green. If the color is 1, return red. If the color is 2, return yellow. If
 * the color is 3, return blue.
 * @param color - The color of the element to be created.
 * @returns A string of the color name.
 */
let createColorElement = (color) => {
  if (color == 0) {
    return green;
  } else if (color == 1) {
    return red;
  } else if (color == 2) {
    return yellow;
  } else if (color == 3) {
    return blue;
  }
};

/**
 * It shuffles the order of the buttons, and increases the score by 1
 */
let nextLevel = () => {
  score++;
  shuffleOrder();
};

/**
 * It displays an alert with the player's score, informs the player that they lost the game, and then
 * calls the playGame() function to start a new game
 */
let gameOver = () => {
  alert(
    `Pontuação: ${score}!\nVocê perdeu o jogo!\nClique em OK para iniciar um novo jogo`
  );
  order = [];
  clickedOrder = [];

  playGame();
};

/**
 * When the user clicks the play button, start a new game.
 */
let playGame = () => {
  alert("Bem vindo ao Gênesis! Iniciando novo jogo!");
  score = 0;

  nextLevel();
};

/* Assigning the click event to the colors. */
green.onclick = () => click(0);
red.onclick = () => click(1);
yellow.onclick = () => click(2);
blue.onclick = () => click(3);

/* Calling the playGame() function, which starts a new game. */
playGame();
