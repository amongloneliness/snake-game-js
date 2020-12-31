'use strict'

const canvas = document.getElementById("main-game");
const ctx = canvas.getContext("2d");

/* ====== sprites and sounds ====== */
const pixelsOfBox = 32;
const groundImage = new Image();
const gameWinTitle = new Image();
const gameLoseTitle = new Image();
const foodImage = new Image();
const poisonImage = new Image();
const soundEatHrum = new Audio();
const soundEatHrum2 = new Audio();
const soundEatNyam = new Audio();
const soundGulp = new Audio();
const soundScore = new Audio();
const soundOfDeath = new Audio();
const soundOfWin = new Audio();

/* ====== sources of game files ====== */
groundImage.src = "snakeGameBackground.png";
gameWinTitle.src = "gameWin.png";
gameLoseTitle.src = "gameLose.png";
foodImage.src = "food1.png";
poisonImage.src = "poison1.png";
soundOfDeath.src = "sound/death.mp3";
soundScore.src = "sound/score.mp3";
soundEatHrum2.src = "sound/hrum2.mp3";
soundEatHrum.src = "sound/hrum.mp3";
soundEatNyam.src = "sound/nyam.mp3";
soundOfWin.src = "sound/win.mp3";
soundGulp.src = "sound/gulp.mp3";

/* ====== game objects and primitives ====== */
let gameScore = 0;
let keyOfKeyboard;
let indexAnimationFood = 0;
let indexAnimationPoison = 0;
let soundEatTemp = soundEatHrum;
let level = function () {
  if (gameScore >= 60) {
    return 2;
  } else {
    return 1;
  }
}

let ground = {
  groundSize: {
    x1: 2,
    x2: 15,
    y1: 5,
    y2: 13,
  },

  groundGeneratePositionOfItem: function () {
    let position = {
      x: Math.floor(Math.random() * this.groundSize.x2 + this.groundSize.x1) * pixelsOfBox,
      y: Math.floor(Math.random() * this.groundSize.y2 + this.groundSize.y1) * pixelsOfBox
    };

    for (let i = 0; i < snake.form.length; i++) {
      if (snake.form[i].x === position.x && snake.form[i].y === position.y) {
        return this.groundGeneratePositionOfItem();
        break;
      }
    }

    return position;
  }
}

let snake = {
  speed: 75,
  form: [{
    x: 9 * pixelsOfBox,
    y: 11 * pixelsOfBox,
    color: "#70ffd480"
  }],

  snakeDrawing: function () {
    for (let i = 0; i < this.form.length - 1; i++) {
      ctx.fillStyle = this.form[i].color;
      ctx.fillRect(this.form[i].x,
        this.form[i].y,
        pixelsOfBox,
        pixelsOfBox);
    }

    ctx.fillStyle = "#70ffd4";
    ctx.fillRect(this.form[this.form.length - 1].x,
      this.form[this.form.length - 1].y,
      pixelsOfBox,
      pixelsOfBox);
  },
  
  snakeIncreaseLength: function (snakeBlock) {
    this.form.push(snakeBlock);
    this.form.shift();
  },

  snakeControl: function (key) {
    let snakeX = this.form[this.form.length - 1].x;
    let snakeY = this.form[this.form.length - 1].y;

    if (key == "left") {
      snakeX -= pixelsOfBox;
    } else if (key == "right") {
      snakeX += pixelsOfBox;
    } else if (key == "down") {
      snakeY += pixelsOfBox;
    } else if (key == "up") {
      snakeY -= pixelsOfBox;
    }

    if (snakeX === 32) {
      snakeX = 512;
    } else if (snakeX  === 544) {
      snakeX  = 64;
    } else if (snakeY === 576) {
      snakeY = 160;
    } else if (snakeY === 128) {
      snakeY = 544;
    }

    return {
      x: snakeX, 
      y: snakeY,
      color: "#70ffd480"
    };
  },

  snakeDead: function () {
    for (let i = 0; i < snake.form.length - 1; i++) {
      if (this.form[snake.form.length - 1].x == this.form[i].x &&
          this.form[snake.form.length - 1].y == this.form[i].y) {
        this.snakeDrawing();
        soundOfDeath.play();
        ctx.drawImage(gameLoseTitle, 0, 0);
        clearInterval(game);
        break;
      }
    }
  },

  snakeWin: function () {
    if (gameScore >= 100) {
      soundOfWin.play();
      ctx.fillStyle = "gold";
      ctx.font = "30px Vernada";
      ctx.fillText(gameScore, pixelsOfBox * 3.5, pixelsOfBox * 2.2);
      ctx.drawImage(gameWinTitle, 0, 0);
      clearInterval(game);
    }
  }
}

let food = {
  foodPosition: ground.groundGeneratePositionOfItem(),

  foodType: {
    One: {
      imageSource: "food1.png",
      audioSource: "sound/hrum.mp3"
    },

    Two: {
      imageSource: "food2.png",
      audioSource: "sound/nyam.mp3"
    },

    Three: {
      imageSource: "food3.png",
      audioSource: "sound/hrum.mp3"
    },
    
    Four: {
      imageSource: "food4.png",
      audioSource: "sound/hrum2.mp3"
    },

    price: 1,

    foodTypeGenerate: function() {
      switch (Math.floor(Math.random() * 4 + 1)) {
        case 1:
          foodImage.src = this.One.imageSource;
          soundEatTemp = soundEatHrum;
          this.price = 2;
          break;
        case 2:
          foodImage.src = this.Two.imageSource;
          soundEatTemp = soundEatNyam;
          this.price = 2;
          break;
        case 3:
          foodImage.src = this.Three.imageSource;
          soundEatTemp = soundEatHrum;
          this.price = 1;
          break;
        case 4:
          foodImage.src = this.Four.imageSource;
          soundEatTemp = soundEatHrum2;
          this.price = 2;
        default:
          break;
      }
    }
  },

  eatFood: function () {
    if (snake.form[snake.form.length - 1].x === this.foodPosition.x &&
      snake.form[snake.form.length - 1].y === this.foodPosition.y) {
      soundEatTemp.play();
      gameScore += +this.foodType.price;

      snake.form.push({
        x: this.foodPosition.x,
        y: this.foodPosition.y,
        color: "#70ffd480"
      });

      this.foodType.foodTypeGenerate();
      this.foodPosition = ground.groundGeneratePositionOfItem();
    }
  }
}

let poison = {
  poisonPosition: ground.groundGeneratePositionOfItem(),
  poisonType: {
    One: {
      imageSource: "poison1.png"
    },

    Two: {
      imageSource: "poison2.png"
    },

    Three: {
      imageSource: "poison3.png"
    },

    poisonEffect: 1,

    poisonTypeGenerate: function () {
      switch (Math.floor(Math.random() * 3 + 1)) {
        case 1:
          poisonImage.src = this.One.imageSource;
          this.poisonEffect = 1;
          break;
        case 2:
          poisonImage.src = this.Two.imageSource;
          this.poisonEffect = 2;
          break;
        case 3:
          poisonImage.src = this.Three.imageSource;
          this.poisonEffect = 3;
          break;
        default:
          break;
      }
    }
  },

  poisonUseEffect: function () {
    switch (this.poisonType.poisonEffect) {
      case 1:
        if (snake.speed > 30) {
          snake.speed -= 5;
          clearInterval(game);
          game = setInterval(UpdateGame, snake.speed);
        }
        break;
      case 2:
        if (snake.speed < 90) {
          snake.speed += 10;
          clearInterval(game);
          game = setInterval(UpdateGame, snake.speed);
        }
        break;
      case 3:
        gameScore -= 20;
        snake.form.splice(0, 3);
        break;
      default:
        break;
    }
  },

  drinkPoison: function () {
    if (snake.form[snake.form.length - 1].x === this.poisonPosition.x &&
      snake.form[snake.form.length - 1].y === this.poisonPosition.y) {
      soundGulp.play();
      this.poisonUseEffect();

      this.poisonType.poisonTypeGenerate();
      this.poisonPosition = ground.groundGeneratePositionOfItem();
    }
  }
}

function UpdateGame() {
  let lvl = level();
  ctx.drawImage(groundImage, 0, 0);
  DrawingElements();
  
  ctx.fillStyle = "white";
  ctx.font = "30px Vernada";
  ctx.fillText(gameScore, pixelsOfBox * 3.5, pixelsOfBox * 2.2);

  snake.snakeDrawing();
  snake.snakeIncreaseLength(snake.snakeControl(keyOfKeyboard));
  snake.snakeDead();
  snake.snakeWin();
  UseElements(lvl);
}

document.addEventListener("keydown", direction);

// controls
function direction(event) {
  switch (event.keyCode) {
    case 37:
    case 65:
      if (snake.form.length == 1 || (snake.form[snake.form.length - 1].x <= snake.form[snake.form.length - 2].x &&
        (snake.form[snake.form.length - 1].x != 64 || snake.form[snake.form.length - 2].x != 512))) {
        keyOfKeyboard = "left";
      }
      break;
    case 38:
    case 87:
      if (snake.form.length == 1 || (snake.form[snake.form.length - 1].y <= snake.form[snake.form.length - 2].y &&
        (snake.form[snake.form.length - 1].y != 160 || snake.form[snake.form.length - 2].y != 544))) {
        keyOfKeyboard = "up";
      }
      break;
    case 39:
    case 68:
      if (snake.form.length == 1 || (snake.form[snake.form.length - 1].x >= snake.form[snake.form.length - 2].x &&
        (snake.form[snake.form.length - 1].x != 512 || snake.form[snake.form.length - 2].x != 64))) {
        keyOfKeyboard = "right";
      }
      break;
    case 40:
    case 83:
      if (snake.form.length == 1 || (snake.form[snake.form.length - 1].y >= snake.form[snake.form.length - 2].y &&
        (snake.form[snake.form.length - 1].y != 544 || snake.form[snake.form.length - 2].y != 160))) {
        keyOfKeyboard = "down";
      }
      break;
    case 32:
      window.location.reload();
      break;
    default:
      break;
  }
}

function DrawingElements() {
  switch (level()) {
    case 2:
      PoisonAnimation();
      ctx.drawImage(poisonImage, indexAnimationPoison, 0, 32, 32, poison.poisonPosition.x, poison.poisonPosition.y, 32, 32);
    case 1:
      FoodAnimation();
      ctx.drawImage(foodImage, indexAnimationFood, 0, 32, 32, food.foodPosition.x, food.foodPosition.y, 32, 32);
      break;
    default:
      break;
  }
}

function PoisonAnimation() {
  if (indexAnimationPoison < poisonImage.width - 32) {
    indexAnimationPoison += 32;
  } else {
    indexAnimationPoison = 0;
  }
}

function FoodAnimation() {
  if (indexAnimationFood < foodImage.width - 32) {
    indexAnimationFood += 32;
  } else {
    indexAnimationFood = 0;
  }
}

function UseElements(lvl) {
  switch (lvl) {
    case 2:
      poison.drinkPoison();
    case 1:
      food.eatFood();
      break;
    default:
      break;
  }
}

let game = setInterval(UpdateGame, snake.speed);