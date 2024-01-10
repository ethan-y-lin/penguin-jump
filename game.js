var walls1 = [{}];
var movingWalls = [{}];
var zombies = [];
var player = {};
class MovingWall {
  constructor(x1, y1, x2, y2, spd, typ, w, h) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.spd = spd;
    this.x = x1;
    this.y = y1;
    this.w = w;
    this.h = h;
    if (typ === "x") {
      this.x_dir = 1;
      this.y_dir = 0;
    } else if (typ === "y") {
      this.y_dir = 1;
      this.x_dir = 0;
    }
  }
  move() {
    if (this.x_dir === 1) {
      if (this.x < this.x2) {
        this.x += this.spd;
        if (this.x > this.x2) {
          this.x = this.x2;
        }
      } else if (this.x > this.x2) {
        this.x -= this.spd
        if (this.x < this.x2) {
          this.x = this.x2;
        }
      } else {
        this.x_dir = -1;
      }
    } else if (this.x_dir === -1) {
      if (this.x < this.x1) {
        this.x += this.spd;
        if (this.x > this.x1) {
          this.x = this.x1;
        }
      } else if (this.x > this.x1) {
        this.x -= this.spd
        if (this.x < this.x1) {
          this.x = this.x1;
        }
      } else {
        this.x_dir = 1;
      }
    }
    if (this.y_dir === 1) {
      if (this.y < this.y2) {
        this.y += this.spd;
        if (this.y > this.y2) {
          this.y = this.y2;
        }
      } else if (this.y > this.y2) {
        this.y -= this.spd
        if (this.y < this.y2) {
          this.y = this.y2;
        }
      } else {
        this.y_dir = -1;
      }
    } else if (this.y_dir === -1) {
      if (this.y < this.y1) {
        this.y += this.spd;
        if (this.y > this.y1) {
          this.y = this.y1;
        }
      } else if (this.y > this.y1) {
        this.y -= this.spd
        if (this.y < this.y1) {
          this.y = this.y1;
        }
      } else {
        this.y_dir = 1;
      }

    }
  }
}

class Chest {
  constructor (item, x, y, rarity){
    this.item = item;
    this.rarity = rarity;
    this.x = x;
    this.y = y;
    this.w = 25;
    this.h = 25;
  }
  draw (){
    if(this.rarity === "common"){
      fill(255,50,50);
    } else if(this.rarity === "rare"){
      fill(50,255,50);
    } else if (this.rarity === "epic"){
      fill(50,50,255);
    }
    rect (this.x - player.x + 250, this.y - player.y + 250, this.w, this.h);
  }
}

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
    this.hearts = 5;
    this.max_hearts = 5;
    this.gravity = 0;
    this.jumpHeight = 17;
    this.jumpSpeed = 5;
    this.boostMax = 13;
    this.boostSpeed = 0;
    this.hit = false;
    this.knocked = false;
    this.knockedSpeed = 0;
    this.knocked_x = 0;
    this.knocked_y = 0;
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
    this.hurt_image = loadImage("assets/Animations/penguin_hurt.png");
    this.main_image = loadImage("assets/Animations/penguin_walk01.png");
    this.currentImage = this.main_image;
    this.frame_delay = 5;
    this.animation_counter = 0;
  }
  playerHearts(){
    let x_pos = 400;
    for(let i = 0; i < this.hearts; i++){
      drawHeart(x_pos,450,2,color(255,0,0));
      x_pos += 20;
    }
    for(let j = 0; j < (this.max_hearts - this.hearts); j++){
      drawHeart(x_pos,450,2,color(0,0,0));
      x_pos += 20;
    }
  }
  drawPlayer() {
    if(this.hit){
      this.currentImage = this.hurt_image;
    }
    else if (this.pre_slide) {
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

  getKnockBack(spd, x, y) {
    this.knocked = true;
    this.knockedSpeed = spd;
    this.knocked_x = x;
    this.knocked_y = y;
  }
  knockBack() {
    for (var i = this.knockedSpeed; i > 0; i--) {
      if (placeFree(this.x + this.knocked_x * i, this.y + this.knocked_y * i, this.w, this.h, walls1)
        && placeFreeMovingWall(this.x + this.knocked_x * i, this.y + this.knocked_y * i, this.w, this.h, movingWalls)) {
        this.x += this.knocked_x * i;
        this.y += this.knocked_y * i;
        break;
      }
    }
    if(this.knockedSpeed === 1){
      this.knockedSpeed = 0;
      this.hit = false;
      this.knocked = false;
    }
    else if (this.knockedSpeed > 0) {
      this.knocked = true;
      this.knockedSpeed--;
    } 
  }
  movePlayer() {
    if (!this.hit){
      if (this.up && !(placeFree(this.x, this.y + 1, this.w, this.h, walls1))) {//jumping when you're on the ground
        this.jumpSpeed = this.jumpHeight;
        this.gravity = 0;
      } else if (this.up && !(placeFree(this.x, this.y + 1, this.w, this.h, movingWalls))) {
        this.jumpSpeed = this.jumpHeight;
        this.gravity = 0;
      }
      if ((this.right || this.left) && this.pre_slide) {
        this.boostSpeed = this.boostMax;
      }
    
      var dir = this.right - this.left;
      text("dir:", 150, 50);
      text(dir, 180, 50);

      for (var s = this.spd; s >= 0; s--) {
        if (placeFree(this.x + s * dir, this.y, this.w, this.h, walls1)
          && placeFreeMovingWall(this.x + s * dir, this.y, this.w, this.h, movingWalls)) {
          this.x += s * dir;
          break;
        }
      }
      if (this.boostSpeed > 0 || this.sliding) {
        this.playerBoost();
      }
    }
    if (this.jumpSpeed > 0) {
      this.playerJump();
    } else if (this.jumpSpeed <= 0) {
      this.playerFall();
      this.jumping = false;
    }
    if (this.knockedSpeed > 0) {
      this.knockBack();
    }
    this.movingWallCheck(movingWalls);
  };

  movingWallCheck(z) {
    var tempBelow = { x: this.x, y: this.y + 1, w: this.w, h: this.h };
    for (var i = 0; i < z.length; i++) {
      var tempWall = {
        x: z[i].x + z[i].spd * z[i].x_dir,
        y: z[i].y + z[i].spd * z[i].y_dir,
        w: z[i].w,
        h: z[i].h
      }
      if (collision(this, tempWall) || collision(this, z[i])) {
        this.getKnockBack(z[i].spd * 5, z[i].x_dir, z[i].y_dir);
        this.hit = true;
        this.hearts -= 1;
      } else
        if (collision(tempBelow, tempWall)) {
          if (placeFree(this.x + z[i].spd * z[i].x_dir, this.y + z[i].spd * z[i].y_dir, this.w, this.h, walls1)
            && placeFreeMovingWall(this.x + z[i].spd * z[i].x_dir, this.y + z[i].spd * z[i].y_dir, this.w, this.h, movingWalls)) {
            this.x += z[i].spd * z[i].x_dir;
            this.y += z[i].spd * z[i].y_dir;
          }
        }

    }
    return true;
  }
  playerFall() {

    if (placeFree(this.x, this.y + 1, this.w, this.h, walls1) === false ||
      placeFree(this.x, this.y + 1, this.w, this.h, movingWalls) === false) {
      console.log("on ground");
      this.gravity = 0;
      this.falling = false;
    } else {
      this.falling = true;
      this.gravity = this.gravity + 0.1;
    }

    for (var i = this.gravity; i > 0; i--) {
      if (placeFree(this.x, this.y + i, this.w, this.h, walls1) &&
        placeFreeMovingWall(this.x, this.y + i, this.w, this.h, movingWalls)) {
        this.y += i;
        break;
      }
    }
  };

  playerJump() {
    for (var i = this.jumpSpeed; i > 0; i--) {
      if (placeFree(this.x, this.y - i, this.w, this.h, walls1) &&
        placeFreeMovingWall(this.x, this.y - i, this.w, this.h, movingWalls)) {
        this.y -= i;
        break;
      }
    }
    if (this.jumpSpeed > 0 || !this.knocked) {
      this.jumping = true;
      this.jumpSpeed--;
    } else {
      this.jumping = false;
    }
  };
  playerBoost() {
    for (var i = this.boostSpeed; i > 0; i--) {
      if (placeFree(this.x + i * this.dir, this.y, this.w, this.h, walls1)
        && placeFreeMovingWall(this.x + i * this.dir, this.y, this.w, this.h, movingWalls)) {
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

function drawHeart (x,y,size, clr){
  fill(clr);
  rect(x,y,size,size);
    rect(x+size,y,size,size);
    rect(x-size*3,y,size,size);
    rect(x-size*2,y,size,size);
    for(var i = 0; i < 7;i++){
        rect(x-size*4+i*size,y+size,size,size);
    }
    for(var i = 0; i < 7;i++){
        rect(x-size*4+i*size,y+size*2,size,size);
    }
    for(var i = 0; i < 5;i++){
        rect(x-size*3+i*size,y+size*3,size,size);
    }
    for(var i = 0; i < 3;i++){
        rect(x-size*2+i*size,y+size*4,size,size);
    }
    rect(x-size,y+size*5,size,size);
}

class Zombie {
  constructor(x, y, num) {
    this.x = x;
    this.y = y;
    this.size = 0.4;
    this.dir = 0;
    this.w = 0.4 * 50;
    this.h = 0.4 * 150;
    this.spd = 1;
    this.jumpSpeed = 0.1;
    this.jumpHeight = 1;
    this.gravity = 0;
    this.legAngle1 = 40;
    this.legAngle2 = -40;
    this.legForward = true;
    this.walking = false;
    this.up = 0;
    this.down = 0;
    this.r = 0;
    this.l = 0;
    this.num = num;
    this.zombieAttack = 0;
    this.zombieAttackB = false;
    this.zombieAttackSpd = 5;
    this.zombieAttackSwitch = false;
    this.damage = 1;
    this.knockBack = 10;
    this.health = 100;
    this.counter = 30;
    this.hit = false;
  }
  zombieJump() {
    for (var i = this.jumpSpeed; i > 0; i -= 0.5) {
      if (placeFree(this.x, this.y - i - 32 * this.size, this.w, this.h, walls1)) {
        this.y -= i * 0.5;
        break;
      }
    }

    if (this.jumpSpeed > 0) {
      this.jumpSpeed -= 0.1;
    }
    if (!this.up || this.jumpSpeed <= 0) {
      this.jumpSpeed = 0;
      this.up = 0;
    }
  }
  zombieFall() {
    if (placeFree(this.x, this.y + 1, this.w, this.h, walls1) === false) {
      this.gravity = 0;
    } else {
      this.gravity = this.gravity + 0.1;

    }
    for (var i = this.gravity; i > 0; i--) {
      if (placeFree(this.x, this.y + i, this.w, this.h, walls1)) {
        this.y += i;
        break;
      }
    }
  }

  drawSelf() {
    var x = this.size * 25;
    var y = this.size * 25;
    noStroke();
    fill(102, 111, 232);
    rectMode(CENTER);
    push();
    translate(this.x - player.x + 250, this.y - player.y + 250);
    push();
    translate(this.size * 20 * this.dir + x, 30 * this.size + y);
    rotate(this.zombieAttack * this.dir);
    rect(0, 0, 40 * this.size * this.dir, 10 * this.size);
    pop();
    rect(x, 40 * this.size + y, 20 * this.size, 70 * this.size);
    fill(99, 125, 110);
    ellipse(x, y, 50 * this.size, 50 * this.size);
    fill(217, 150, 150);
    ellipse(10 * this.size + x, 5 * this.size + y, 10 * this.size, 10 * this.size);
    ellipse(10 * this.size + x, 5 * this.size + y, 10 * this.size, 10 * this.size);
    ellipse(x, 15 * this.size + y, 20 * this.size, 5 * this.size);
    push();
    translate(x, 72 * this.size + y);
    rotate(this.legAngle2);
    rect(0, 25 * this.size, 15 * this.size, 50 * this.size);
    pop();
    push();
    translate(x, 72 * this.size + y);
    rotate(this.legAngle1);
    rect(0, 25 * this.size, 15 * this.size, 50 * this.size);
    pop();
    pop();
    rectMode(CORNER);
  }

  move() {
    text(this.num - 1, this.x - 20, this.y);
    if (placeFree(this.x, this.y + 1, this.w, this.h, walls1) === false) {
      this.gravity = 0;
    }
    if (placeFree(this.x, this.y + 1, this.w, this.h, walls1)) {
      this.y -= 1;
    }
    if (this.up && !(placeFree(this.x, this.y + 1, this.w, this.h, walls1))) {
      this.jumpSpeed = this.jumpHeight;
    }

    var dir = this.r - this.l;
    var tempz = Array.from(zombies);
    tempz.splice(this.num - 1, 1);
    for (var s = this.spd; s >= 0; s--) {
      if (placeFree(this.x + s * dir, this.y, this.w, this.h, walls1) && placeFree(this.x + s * dir, this.y, this.w, this.h, tempz)) {
        this.x += s * dir;
        break;
      }
    }
    if (this.jumpSpeed > 0) {
      this.zombieJump(this);
    } else if (this.jumpSpeed <= 0) {
      this.zombieFall(this);
    }
  }
  moveToPlayer() {
    var zV = { x: this.x - 230 * this.size, y: this.y - 200 * this.size, w: 500 * this.size, h: 550 * this.size };
    if (collision(player, zV)) {
      if (player.y < this.y) {
        if (placeFree(this.x, this.y + 1, this.w, this.h, walls1) === false) {
          this.up = 1;
        }
      }
      if (player.x > this.x + 20) {
        this.dir = 1;
        this.r = 1;
        this.l = 0;
        this.walking = true;
      } else if (player.x < this.x - 20) {
        this.dir = -1;
        this.r = 0;
        this.l = 1;
        this.walking = true;
      } else {
        this.r = 0;
        this.l = 0;
        this.walking = false;
      }
    } else {
      this.r = 0;
      this.l = 0;
      this.walking = false;
    }
  }
  sight() {
    var zV = { vX: this.x - 230 * this.size, vY: this.y - 200 * this.size, vW: 500 * this.size, vH: 550 * this.size };
    fill(100, 100, 100, 50);
    push();
    translate(-player.x + 250, -player.y + 250);
    rect(zV.vX, zV.vY, zV.vW, zV.vH);
    pop();
  }
  walk() {
    if (this.legAngle1 > -40 && this.legForward === true && this.walking === true) {
      this.legAngle1 -= this.spd;
      this.legAngle2 += this.spd;
    } else if (this.legAngle1 <= -40 && this.walking === true || this.legForward === false & this.walking === true) {
      this.legForward = false;
      this.legAngle1 += this.spd;
      this.legAngle2 -= this.spd;
      if (this.legAngle1 >= 40 && this.walking === true) {
        this.legForward = true;
      }
    }
    if (this.walking === false && this.legAngle1 !== 0) {
      if (this.legAngle1 > 0) {
        this.legAngle1 -= this.spd;
        this.legAngle2 += this.spd;
      } else if (this.legAngle1 < 0) {
        this.legAngle1 += this.spd;
        this.legAngle2 -= this.spd;
      }
    }
  }
  attack() {
    var temp = { x: this.x - 8, y: this.y, w: this.w + 16, h: this.h };
    fill(200, 100, 100, 100);
    if (collision(player, temp)) {
      if (this.zombieAttack === 0) {
        player.hearts -= this.damage;
        player.hit = true;
        this.zombieAttackB = true;
        this.zombieAttackSwitch = false;
        this.zombieAttackSpd = 2;
        if(this.dir !== 0){
          player.getKnockBack(this.knockBack,this.dir, 0);
        }else {
          player.getKnockBack(this.knockBack, 0, 1);
        }
      }
    }
  }
  attackMotion() {
    if (this.zombieAttackB === true) {
      if (this.zombieAttack > -60 && this.zombieAttackSwitch === false) {
        this.zombieAttack -= 1.5 * this.zombieAttackSpd;
        this.zombieAttackSpd -= 0.05;
      } else {
        this.zombieAttackSwitch = true;
      }
      if (this.zombieAttack < 0 && this.zombieAttackSwitch === true) {
        this.zombieAttackSpd = 5;
        this.zombieAttack += 1 * this.zombieAttackSpd;
      }
      if (this.zombieAttack > 0) {
        this.zombieAttack = 0;
      }
      if (this.zombieAttack === 0) {
        this.zombieAttackB = false;
      }
    }
  }
  hitBox() {
    var temp = { x: this.x - 8, y: this.y, w: this.w + 16, h: this.h };
    fill(200, 100, 100, 50);
    push();
    translate(-player.x + 250, -player.y + 250);
    rect(temp.x, temp.y, temp.w, temp.h);
    pop();
  }
  healthBar() {
    stroke(0, 255, 0);
    fill(0, 0, 0, 0);
    push();
    translate(-player.x + 250, -player.y + 250);
    rect(this.x, this.y - 5, this.w, 3);
    noStroke();
    fill(0, 255, 0, 150);
    rect(this.x, this.y - 5, this.w / 100 * this.health, 3);
    pop();
    noStroke();
  }
  hitAction() {
    if (this.counter > 0) {
      this.counter--;
      var tempz = Array.from(zombies);
      tempz.splice(this.num - 1, 1);
      for (var i = 3; i > 0; i--) {
        if (placeFree(this.x - i * this.dir, this.y - 2, this.w, this.h, walls1) && placeFree(this.x - i * this.dir, this.y, this.w, this.h, tempz)) {
          this.x -= i * this.dir;
          break;
        }
      }
    }
  }
}

function doZombies() {
  for (var z = 0; z < zombies.length; z++) {
    zombies[z].hitBox();
    zombies[z].drawSelf();
    zombies[z].move();
    zombies[z].moveToPlayer();
    zombies[z].sight();
    zombies[z].walk();
    zombies[z].attack();
    zombies[z].attackMotion();
    zombies[z].healthBar();
    zombies[z].hitAction();
  }
}

function resetLevel() {
  walls1 = [{ x: 0, y: 475, w: 500, h: 25 },
  { x: 500, y: 400, w: 150, h: 400 },
  { x: 700, y: 0, w: 150, h: 400 },
  { x: 650, y: 775, w: 50, h: 25 },
  { x: 800, y: 675, w: 50, h: 25 },
  { x: 950, y: 450, w: 50, h: 25 },
  { x: 725, y: 525, w: 50, h: 25 },
  { x: 700, y: 400, w: 25, h: 150 },
  { x: 850, y: 300, w: 50, h: 25 },
  { x: 900, y: 150, w: 50, h: 25 },
  { x: 525, y: 50, w: 50, h: 25 },
  { x: -100, y: 50, w: 50, h: 25 },
  { x: -350, y: 50, w: 50, h: 25 },
  { x: 0, y: 300, w: 25, h: 200 },
  { x: 10, y: 400, w: 25, h: 25 }
  ];
  movingWalls = [
    new MovingWall(150, 150, 450, 150, 4, "x", 100, 25),
    new MovingWall(-50, 100, 150, 100, 4, "x", 100, 25)
  ]
  player = new Player(250, 250);
}

function drawLevel() {
  fill(94, 92, 237);
  for (var i = 0; i < walls1.length; i++) {
    if (walls1[i].x1 !== undefined) {
      walls1[i].move();
    }
    rect(walls1[i].x - player.x + 250,
      walls1[i].y - player.y + 250,
      walls1[i].w,
      walls1[i].h);
  }
  for (var j = 0; j < movingWalls.length; j++) {
    movingWalls[j].move();
    rect(movingWalls[j].x - player.x + 250,
      movingWalls[j].y - player.y + 250,
      movingWalls[j].w,
      movingWalls[j].h);
  }
}
function setup() {
  createCanvas(500, 500,document.getElementById(""));
  fill(SNOW_COLOR);
  noStroke();
  zombies.push(new Zombie(400, 200, 1))
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
  player.playerHearts();
  doZombies();
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
function placeFreeMovingWall(xNew, yNew, wNew, hNew, z) {
  var temp = { x: xNew, y: yNew, w: wNew, h: hNew };
  for (var i = 0; i < z.length; i++) {
    var tempWall = {
      x: z[i].x + z[i].spd * z[i].x_dir,
      y: z[i].y + z[i].spd * z[i].y_dir,
      w: z[i].w,
      h: z[i].h
    }
    if (collision(temp, tempWall)) {
      return false;
    }

  }
  return true;
}
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
  if (keyCode == 16) {
    player.getKnockBack(10, 1, 0);
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
const SNOWFLAKES_PER_LAYER = 20;
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
function drawBackground1() {
  background(0);
}
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

