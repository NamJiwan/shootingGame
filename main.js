let canvas;
let ctx;
canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);
let score = 0;
let BulletList = [];
function Bullet() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.x = spaceshipX + 22;
    this.y = spaceshipY;
    this.alive = true;
    BulletList.push(this);
  };
  this.update = function () {
    this.y -= 7;
  };
  this.checkHit = function () {
    for (let i = 0; i < enemyList.length; i++) {
      if (this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 60) {
        score++;
        this.alive = false;
        enemyList.splice(i, 1);
      }
    }
  };
}

function generateRandomValue(min, max) {
  let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNum;
}
let enemyList = [];
function Enemy() {
  this.x = 0;
  this.y = 0;
  this.init = function () {
    this.y = 0;
    this.x = generateRandomValue(0, canvas.width - 32);
    enemyList.push(this);
  };
  this.update = function () {
    this.y += 3;
    if (this.y >= canvas.height - 32) {
      gameOver = true;
    }
  };
}

let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
let gameOver = false;
let spaceshipX = canvas.width / 2 - 30;
let spaceshipY = canvas.height - 60;
function loadImage() {
  backgroundImage = new Image();
  backgroundImage.src = 'images/background.jpg';

  spaceshipImage = new Image();
  spaceshipImage.src = 'images/space.png';

  bulletImage = new Image();
  bulletImage.src = 'images/bullet.png';

  enemyImage = new Image();
  enemyImage.src = 'images/enemy.png';

  gameOverImage = new Image();
  gameOverImage.src = 'images/game.jpg';
}

//방향키 누르면
let keysDown = {};
function setupKeyboardListener() {
  document.addEventListener('keydown', function (event) {
    keysDown[event.keyCode] = true;
  });
  document.addEventListener('keyup', function (event) {
    delete keysDown[event.keyCode];

    if (event.keyCode == 32) {
      createBullet();
    }
  });
}

function createBullet() {
  let b = new Bullet();
  b.init();
}

function createEnemy() {
  const interval = setInterval(function () {
    let e = new Enemy();
    e.init();
  }, 1000);
}

function update() {
  if (39 in keysDown) {
    spaceshipX += 5;
  }
  if (37 in keysDown) {
    spaceshipX -= 5;
  }
  if (spaceshipX <= 0) {
    spaceshipX = 0;
  }
  if (spaceshipX >= canvas.width - 60) {
    spaceshipX = canvas.width - 60;
  }
  for (let i = 0; i < BulletList.length; i++) {
    if (BulletList[i].alive) {
      BulletList[i].update();
      BulletList[i].checkHit();
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    enemyList[i].update();
  }
}

function render() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  ctx.fillText('Score :' + score, 20, 20);
  ctx.fillStyle = 'white';
  ctx.font = '20px,Arial';
  for (let i = 0; i < BulletList.length; i++) {
    if (BulletList[i].alive) {
      ctx.drawImage(bulletImage, BulletList[i].x, BulletList[i].y);
    }
  }
  for (let i = 0; i < enemyList.length; i++) {
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main() {
  if (!gameOver) {
    update();
    render();
    requestAnimationFrame(main);
  } else {
    ctx.drawImage(gameOverImage, 10, 100, 380, 380);
  }
}
loadImage();
setupKeyboardListener();
createEnemy();
main();

//방향키 누르면
//우주선 xy 좌표가 바뀌고
// 다시 render 그려준다

// 총알만들기
// 1. 스페이스바를 누르면 총알 발사
// 2. 총알이 발사 = 총알의 y 값이 --, 총알의 x값은? 스페이스바를 누른 순간의 우주선의 x좌료
// 3. 발사된 총알들은 총알 배열에 저장한다.
// 4. 총알들은 x,y 좌표값이 있어야한다.
// 5. 총알 배열을 가지고 render 그려준다.

// 적군만들기
// 1. x, y, init, update
// 2. 적군은 위치가 랜덤하다
// 3. 적군은 밑으로 내려온다
// 4. 1초마다 하나씩 적군이 나온다
// 5. 적군의 우주선이 바닥에 닿으면 게임오버
// 6. 적군과 총알이 만나면 우주선이 사라지고, 1점 획득한다.
