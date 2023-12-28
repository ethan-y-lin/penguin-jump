var walls1 = [{}];
var player = {};


class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.up = 0;
    this.down = 0;
    this.right = 0;
    this.left = 0;
    this.jumping = false;
    this.falling = false;
    this.pre_slide = false;
    this.sliding = false;
    this.post_slide = false;
    this.spd = 4;
    this.gravity = 0;
    this.jumpHeight = 17;
    this.jumpSpeed = 5;
    this.boostMax = 17;
    this.boostSpeed = 0;
    this.dir = 1;
    this.walk_animation = [];
    for (let i = 1; i < 5; i++) {
      let string = "penguin_walk0" + i.toString() + ".png";
      let img = loadImage("assets/Animations/" + string);
      this.walk_animation.push(img);
    }
    this.walk_counter = 0;
    this.jump_animation = [];
    for (let i = 1; i < 4; i++) {
      let string = "penguin_jump0" + i.toString() + ".png";
      let img = loadImage("assets/Animations/" + string);
      this.jump_animation.push(img);
    }
    this.slide_animation = [];
    for (let i = 1; i < 3; i++) {
      let string = "penguin_slide0" + i.toString() + ".png";
      let img = loadImage("assets/Animations/" + string);
      this.slide_animation.push(img);
    }
    this.main_image = loadImage("assets/Animations/penguin_walk01.png");
    this.currentImage = this.main_image;
    this.frame_delay = 5;
    this.animation_counter = 0;
  }

  drawPlayer() {
    if (this.pre_slide) {
      this.currentImage = this.slide_animation[0];
      if (this.animation_counter > this.frame_delay - 2) {
        this.pre_slide = false;
        this.sliding = true;
        this.animation_counter = 0;
      }
      this.animation_counter++;
    } else if (this.sliding) {
      this.currentImage = this.slide_animation[1];
    } else if (this.post_slide) {
      this.currentImage = this.slide_animation[0];
      if (this.animation_counter > this.frame_delay - 2) {
        this.post_slide = false;
        this.animation_counter = 0;
      }
      this.animation_counter++;
    }
    else if (this.jumpSpeed > this.jumpHeight / 2 && this.jumping) {
      this.currentImage = this.jump_animation[0];

    } else if (this.jumpSpeed > 0 && this.jumping || this.falling && this.gravity < 2) {
      this.currentImage = this.jump_animation[1];
    } else if (this.falling) {
      this.currentImage = this.jump_animation[2];
    }
    else if (this.right) {
      this.dir = 1;
      if (!this.falling && !this.jumping) {
        this.currentImage = this.walk_animation[this.walk_counter % 4];
        if (this.animation_counter > this.frame_delay) {
          this.walk_counter++;
          this.animation_counter = 0;
        }
        this.animation_counter++;
      }
    } else if (this.left) {
      this.dir = -1;
      if (!this.falling && !this.jumping) {
        this.currentImage = this.walk_animation[this.walk_counter % 4];
        if (this.animation_counter > this.frame_delay) {
          this.walk_counter++;
          this.animation_counter = 0;
        }
        this.animation_counter++;
      }
    } else if (!(placeFree(this.x, this.y + 1, this.w, this.h, walls1))) {
      this.walk_counter = 0;
      this.currentImage = this.main_image;
    }
    if (this.right) {
      this.dir = 1;
    } else if (this.left) {
      this.dir = -1;
    }
    if (this.dir === 1) {
      image(this.currentImage, 250, 250, this.w, this.h);
    } else if (this.dir === -1) {
      push();
      translate(250, 250);
      scale(-1, 1);
      image(this.currentImage, -this.w, 0, this.w, this.h);
      pop();
    }

  }

  movePlayer() {

    if (this.up && !(placeFree(this.x, this.y + 1, this.w, this.h, walls1))) {//jumping when you're on the ground
      this.jumpSpeed = this.jumpHeight;
    }
    if ((this.right || this.left) && this.pre_slide) {//jumping when you're on the ground
      this.boostSpeed = this.boostMax;
    }
    var dir = this.right - this.left;
    text("dir:", 150, 50);
    text(dir, 180, 50);

    for (var s = this.spd; s >= 0; s--) {
      if (placeFree(this.x + s * dir, this.y, this.w, this.h, walls1)) {
        this.x += s * dir;
        break;
      }
    }
    console.log(this.boostSpeed);
    if (this.boostSpeed > 0 || this.sliding) {
      this.playerBoost();
    }
    if (this.jumpSpeed > 0) {
      this.playerJump();
    } else if (this.jumpSpeed <= 0) {
      this.playerFall();
      this.jumping = false;
    }
  };

  playerFall() {

    if (placeFree(this.x, this.y + 1, this.w, this.h, walls1) === false) {
      this.gravity = 0;
      this.falling = false;
    } else {
      this.falling = true;
      this.gravity = this.gravity + 0.1;
    }

    for (var i = this.gravity; i > 0; i--) {
      if (placeFree(this.x, this.y + i, this.w, this.h, walls1)) {
        this.y += i;
        break;
      }
    }
  };

  playerJump() {
    for (var i = this.jumpSpeed; i > 0; i--) {
      if (placeFree(this.x, this.y - i, this.w, this.h, walls1)) {
        this.y -= i;
        break;
      }
    }
    if (this.jumpSpeed > 0) {
      this.jumping = true;
      this.jumpSpeed--;
    } else {
      this.jumping = false;
    }
  };
  playerBoost() {
    for (var i = this.boostSpeed; i > 0; i--) {
      if (placeFree(this.x + i * this.dir, this.y, this.w, this.h, walls1)) {
        this.x += i * this.dir;
        break;
      }
    }
    if (this.boostSpeed > 0) {
      this.sliding = true;
      this.boostSpeed--;
    } else {
      console.log("hi");
      this.sliding = false;
      this.post_slide = true;
    }
  };
}


function resetLevel() {
  walls1 = [{ x: 0, y: 475, w: 500, h: 25 }
  ];
  player = new Player(250, 250);
}

function drawLevel() {
  fill(94, 92, 237);
  for (var i = 0; i < walls1.length; i++) {
    rect(walls1[i].x - player.x + 250,
      walls1[i].y - player.y + 250,
      walls1[i].w,
      walls1[i].h);
  }
}
function setup() {
  createCanvas(750, 750);
  fill(SNOW_COLOR);
  noStroke();

  // Initialize the snowflakes with random positions
  for (let l = 0; l < LAYER_COUNT; l++) {
    SNOWFLAKES.push([]);
    for (let i = 0; i < SNOWFLAKES_PER_LAYER; i++) {
      SNOWFLAKES[l].push({
        x: random(width),
        y: random(height),
        mass: random(0.75, 1.25),
        l: l + 1
      });
    }
  }
  resetLevel();
}

function draw() {
  drawBackground();
  drawLevel();
  if (placeFree(player.x, player.y + 1, player.w, player.h, walls1) === false) {
    player.gravity = 0;
  }
  player.movePlayer();
  player.drawPlayer();
}


function collision(r1, r2) {
  if (r1.x + r1.w > r2.x &&
    r1.x < r2.x + r2.w &&
    r2.y + r2.h > r1.y &&
    r2.y < r1.y + r1.h) {
    return true;
  } else {
    return false;
  }
};

function placeFree(xNew, yNew, wNew, hNew, z) {
  var temp = { x: xNew, y: yNew, w: wNew, h: hNew };
  for (var i = 0; i < z.length; i++) {
    if (collision(temp, z[i])) {
      return false;
    }

  }
  return true;
};

function keyPressed() {
  if (keyCode == 32) {
    if (!player.sliding && (player.right || player.left)) {
      player.pre_slide = true;
    }
  }
  if (keyCode == 87 || keyCode == 38) {
    player.up = 1;
  }
  if (keyCode == 83 || keyCode == 40) {
    player.down = 1;
  }
  if (keyCode == 68 || keyCode == 39) {
    player.right = 1;
  }
  if (keyCode == 65 || keyCode == 37) {
    player.left = 1;
  }

}

function keyReleased() {
  if (keyCode == 87 || keyCode == 38) {
    player.up = 0;
  }
  if (keyCode == 83 || keyCode == 40) {
    player.down = 0;
  }
  if (keyCode == 68 || keyCode == 39) {
    player.right = 0;
  }
  if (keyCode == 65 || keyCode == 37) {
    player.left = 0;
  }

}

/* eslint-disable no-undef, no-unused-vars */

// Tweakable parameters
const SNOW_COLOR = "snow";
const SNOWFLAKES_PER_LAYER = 50;
const MAX_SIZE = 10;
const GRAVITY = 0.5;
const LAYER_COUNT = 4;

const SKY_COLOR = "skyblue";
const SKY_SPACE = 0.4;
const SKY_AMP = 150;
const SKY_ZOOM = 0.0025;
const SKY_LAYER_OFFSET = 3;

const WIND_SPEED = 1;
const WIND_CHANGE = 0.0025;

const SUN_COLOR = "#FFF2AD";
const SUN_GLOW = 100;
const SUN_RADIUS = 150;

const RIDGE_TOP_COLOR = "#BCCEDD";
const RIDGE_BOT_COLOR = "#7E9CB9";
const RIDGE_STEP = 4;
const RIDGE_AMP = 250;
const RIDGE_ZOOM = 0.005;

const SNOWFLAKES = [];

// Will run every frame (refreshes many times per second)
function drawBackground() {
  background(SKY_COLOR);
  const skyHeight = round(height * SKY_SPACE);

  for (let i = 1; i < LAYER_COUNT; i++) {
    drawRidge(
      i,
      (i * skyHeight) / LAYER_COUNT,
      SKY_AMP,
      SKY_ZOOM,
      SKY_COLOR,
      SUN_COLOR,
      SKY_LAYER_OFFSET
    );
  }

  drawSun(width / 2, skyHeight - RIDGE_AMP / 2);

  // Iterate through the layers of snowflakes
  for (let l = 0; l < SNOWFLAKES.length; l++) {
    const SNOWLAYER = SNOWFLAKES[l];

    // Draw a ridge for each layer of snow
    const layerPosition = l * ((height - skyHeight) / LAYER_COUNT);
    drawRidge(
      l,
      skyHeight + layerPosition,
      RIDGE_AMP,
      RIDGE_ZOOM,
      RIDGE_TOP_COLOR,
      RIDGE_BOT_COLOR,
      0
    );

    // Draw each snowflake
    for (let i = 0; i < SNOWLAYER.length; i++) {
      const snowflake = SNOWLAYER[i];
      ellipse(snowflake.x, snowflake.y, (snowflake.l * MAX_SIZE) / LAYER_COUNT);
      updateSnowflake(snowflake);
    }
  }
}

// Draw a simple sun
function drawSun(x, y) {
  fill(SUN_COLOR);
  drawingContext.shadowBlur = SUN_GLOW;
  drawingContext.shadowColor = SUN_COLOR;
  ellipse(x, y, SUN_RADIUS * 2);
  drawingContext.shadowBlur = 0;
}

// Compute and draw a ridge
function drawRidge(l, y, amp, zoom, c1, c2, coff) {
  // Choose a color for the ridge based on its height
  const FILL = lerpColor(color(c1), color(c2), l / (LAYER_COUNT - 1 + coff));
  fill(FILL);

  beginShape();
  // Iterate through the width of the canvas
  for (let x = 0; x <= width; x += RIDGE_STEP) {
    const noisedY = noise(x * zoom, y);
    vertex(x, y - noisedY * amp);
  }
  vertex(width, height);
  vertex(0, height);
  endShape(CLOSE);
  fill(SNOW_COLOR);
}

// Helper function to prepare a given snowflake for the next frame
function updateSnowflake(snowflake) {
  const diameter = (snowflake.l * MAX_SIZE) / LAYER_COUNT;
  if (snowflake.y > height + diameter) snowflake.y = -diameter;
  else snowflake.y += GRAVITY * snowflake.l * snowflake.mass;

  // Get the wind speed at the given layer and area of the page
  const wind =
    noise(snowflake.l, snowflake.y * WIND_CHANGE, frameCount * WIND_CHANGE) -
    0.5;
  if (snowflake.x > width + diameter) snowflake.x = -diameter;
  else if (snowflake.x < -diameter) snowflake.x = width + diameter;
  else snowflake.x += wind * WIND_SPEED * snowflake.l;
}
