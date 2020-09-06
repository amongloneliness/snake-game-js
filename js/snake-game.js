const canvas = document.getElementById("main-game");
const ctx = canvas.getContext("2d");

/* ====== sprites and audios ====== */
const ground = new Image();
const foodImg = new Image();
const effect_1Img = new Image();
const effect_2Img = new Image();
const hrum_sound = new Audio();
const score_sound = new Audio();
const death_sound = new Audio();
const win_sound = new Audio();
const gulp_sound = new Audio();

ground.src = "snake-game-background.png";
foodImg.src = "food-1.png";
death_sound.src = "sound/death.mp3";
score_sound.src = "sound/score.mp3";
hrum_sound.src = "sound/hrum.mp3";
win_sound.src = "sound/win.mp3";
gulp_sound.src = "sound/gulp.mp3";

// size-of-one-block
let box = 32;
// score-counter
let score = 0;
let score_add = 0;
// speed of game
let speed = 115;
let speed_add = 0;

// key-of-keyboard
let key;

function Food_generation() {
  let number_food = Math.floor(Math.random() * 3 + 1);
  foodImg.src = "food-" + number_food + ".png";
  if (number_food == 1 || number_food == 2) {
    score_add = 2;
  } else {
    score_add = 1;
  }
  return {
    x: Math.floor((Math.random() * 15 + 2)) * box,
    y: Math.floor((Math.random() * 13 + 5)) * box
  };
}

function Effect1_generation() {
  let number_food = 4 + Math.floor(Math.random() * 2);
  effect_1Img.src = "food-" + number_food + ".png";
  if (number_food % 2 == 0) {
    speed_add = 5;
  } else {
    speed_add = -5;
  }
  return {
    x: Math.floor((Math.random() * 15 + 2)) * box,
    y: Math.floor((Math.random() * 13 + 5)) * box
  };
}

function Effect2_generation() {
  effect_2Img.src = "food-6.png";
  return {
    x: Math.floor((Math.random() * 15 + 2)) * box,
    y: Math.floor((Math.random() * 13 + 5)) * box
  };
}

let food = Food_generation();
let effect_1 = Effect1_generation();
let effect_2 = Effect2_generation();

let snake = [];
snake[0] = {
  x: 9 * box,
  y: 11 * box
};

document.addEventListener("keydown", direction);

function direction(event) {
  setTimeout(function () {
    if ((event.keyCode == 37 || event.keyCode == 65) && key != "right") {
      key = "left";
    }
    else if ((event.keyCode == 38 || event.keyCode == 87) && key != "down") {
      key = "up";
    }
    else if ((event.keyCode == 39 || event.keyCode == 68) && key != "left") {
      key = "right";
    }
    else if ((event.keyCode == 40 || event.keyCode == 83) && key != "up") {
      key = "down";
    }
    if (event.keyCode == 32) {
      window.location.reload();
    }
  }, 1);
}

function eatTail(head, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (head.x == arr[i].x && head.y == arr[i].y) {
      Death();
    }
  }
}

function Death() {
  death_sound.play();
  clearInterval(game);
  ctx.fillText("Game Over", box * 10, box * 2.2);
  setTimeout("window.location.reload()", 1000);
}
function Win() {
  win_sound.play();
  clearInterval(game);
  ctx.fillStyle = "gold";
  ctx.fillText("You Win!", box * 10, box * 2.2);
}

function Update() {
  // ====== difficult of game
  let level = { a: score > -1, b: score > 40, c: score > 80, win: score >= 100};
  // ====== draw objects
  if (level.a) {
    ctx.drawImage(ground, 0, 0);
    ctx.drawImage(foodImg, food.x, food.y);
  }
  if (level.b) {
    ctx.drawImage(effect_1Img, effect_1.x, effect_1.y);
  }
  if (level.c) {
    ctx.drawImage(effect_2Img, effect_2.x, effect_2.y);
  }
  if (level.win) {
    Win();
  }
  // ====== draw player: <snake>
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "#70ffd4" : "#5abd9f" + (100 - i);
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "white";
  ctx.font = "30px Vernada";
  ctx.fillText(score, box * 3.5, box * 2.2);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (snakeX == food.x && snakeY == food.y) {
    hrum_sound.pause();
    hrum_sound.play();

    score += score_add;

    if (score % 10 == 0) {
      score_sound.play();
    }

    if (score > 80) {
      effect_1 = Effect1_generation();
      effect_2 = Effect2_generation();
    }

    food = Food_generation();
  } else if (level.b && snakeX == effect_1.x && snakeY == effect_1.y) {
    effect_1 = Effect1_generation();
    gulp_sound.play();
    score--;
    speed += speed_add;
  } else if (level.c && snakeX == effect_2.x && snakeY == effect_2.y) {
    effect_2 = Effect2_generation();
    gulp_sound.play();
    score -= 20;
  } else {
    snake.pop();
  }

  /* ====== death of player ====== */
  if (snakeX < box * 2 || snakeX > box * 16 ||
    snakeY < box * 5 || snakeY > box * 17) {
    Death();
  }

  if (key == "left") {
    snakeX -= box;
  }
  if (key == "right") {
    snakeX += box;
  } 
  if (key == "up") {
    snakeY -= box;
  }
  if (key == "down") {
    snakeY += box;
  }

  let new_snake_head = {
    x: snakeX,
    y: snakeY
  };

  eatTail(new_snake_head, snake);

  snake.unshift(new_snake_head);
}

let game = setInterval(Update, speed);