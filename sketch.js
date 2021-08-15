var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, ground_image, invisible_ground;
var girl, girl_running, girl_collided, girlImage, zombie, zombie_running, zombie_attack;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, checkpointSound;
var score=0;
var coinGroup,life;
var gameOver, restart, gameOverImage, restartImage;
localStorage["HighestScore"] = 0;

function preload() {
  ground_image = loadImage("Background.png");
  girl_running = loadAnimation("Run (1).png", "Run (2).png", "Run (3).png", "Run (4).png", "Run (5).png", "Run (6).png", "Run (7).png", "Run (8).png", "Run (9).png", "Run (10).png", "Run (11).png", "Run (12).png", "Run (14).png", "Run (15).png", "Run (16).png", "Run (17).png", "Run (18).png", "Run (19).png", "Run (20).png");
  zombie_running = loadAnimation("Walk (1).png", "Walk (2).png", "Walk (3).png", "Walk (4).png", "Walk (5).png", "Walk (6).png", "Walk (7).png", "Walk (8).png", "Walk (9).png", "Walk (10).png");
  zombie_attack = loadAnimation("Attack (2).png", "Attack (3).png", "Attack (4).png", "Attack (5).png", "Attack (6).png", "Attack (7).png", "Attack (8).png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  zombie_idle = loadImage("Stand.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  coinSound = loadSound("coin.wav")
  gameOverImage = loadImage("gameOver1.png");
  restartImage = loadImage("restart1-1.png");
  girl_collided = loadImage("Dead (30).png");
  girlImage = loadImage("Idle (1).png");
  diamondImage = loadImage("diamond.png")
  }

  function setup() {
  createCanvas(600, 500);

  ground = createSprite(0, 0, 0, 0);
  ground.shapeColor = "white";
  ground.addImage("ground_image", ground_image);
  ground.scale = 1.4;
  ground.velocityX = -1

  girl = createSprite(300, 420, 600, 10);
  girl.addAnimation("girl_running", girl_running);
  girl.addImage("girl_collided", girl_collided);
  girl.addImage("girlImage", girlImage);
  girl.scale = 0.2;
  // girl.velocityX=2;
  girl.debug = false;
  girl.setCollider("rectangle", 0, 0, girl.width, girl.height)


  zombie = createSprite(50, 410, 600, 10);
  zombie.addAnimation("zombie_running", zombie_running);
  zombie.addAnimation("zombie_attack", zombie_attack);
  zombie.addImage("zombie_idle", zombie_idle);
  zombie.scale = 0.2;
  zombie.debug = false;
  // zombie.velocityY=-13;
  // zombie.velocityX=Math.round(random(1,2));

  invisible_ground = createSprite(300, 470, 600, 10);
  invisible_ground.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImage);

  restart = createSprite(300, 180);
  restart.addImage(restartImage);
  
  gameOver.visible = false;
  restart.visible = false;
  
  coinGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  life = 3;
}

function draw() {
  background("black");
  drawSprites();
  textSize(20);
  fill(255);
  text("Score: "+ score, 500,40);
  text("life: "+ life , 500,60);

  if (gameState===PLAY){
   //score = score + Math.round(getFrameRate()/60);
    if(coinGroup.isTouching(girl)){
      coinSound.play();
      coinGroup[0].destroy();
      score=score+1;
    }

    if (obstaclesGroup.isTouching(zombie)) {
      zombie.velocityY = -12;
    }

    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && girl.y >= 139) {
      girl.velocityY = -12;
      jumpSound.play();
    }
  
    girl.velocityY = girl.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    //Gravity
    zombie.velocityY = zombie.velocityY + 0.8;
    zombie.collide(invisible_ground);
  
    girl.collide(invisible_ground);
    
    spawnCoin();
    spawnObstacles();
  
   if(obstaclesGroup.isTouching(girl)){
        life=life-1;
        gameState = END;  
        gameOver.visible = true;
        restart.visible = true;
        ground.velocityX = 0;
        girl.velocityY = 0;
        girl.changeImage("girl_collided", girl_collided);
        zombie.changeAnimation("zombie_attack", zombie_attack);
        zombie.x = girl.x;
        zombie.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        coinGroup.setVelocityXEach(0);
    } 
  }

  if (girl.isTouching(obstaclesGroup)) {
    gameState = END;
    dieSound.play();
    ground.velocityX = 0;
    girl.velocityY = 0;
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
  
  //else if (gameState === END ) {
   /* gameOver.visible = true;
    restart.visible = true;
    girl.addImage("collided", girl_collided);
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    girl.velocityY = 0;
    zombie.velocityX = 0;
    girl.changeImage("girlImage", girlImage);
    zombie.changeAnimation("zombie_attack", zombie_attack);
    zombie.x = girl.x;
    obstaclesGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);*/
    

  if (zombie.isTouching(girl)) {
    girl.changeImage("girl_collided", girl_collided);
    zombie.changeImage("zombie_idle", zombie_idle);
  }
    
    //change the girl animation
    girl.changeAnimation("collided",girl_collided);
    girl.scale =0.2;
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    coinGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      if(life>0)
      reset();
    }
  }
}

function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var coin = createSprite(600,300,40,10);
    coin.y = Math.round(random(200,400));
    coin.addImage(diamondImage);
    coin.scale = 0.2;
    coin.velocityX = -3;
    
     //assign lifetime to the variable
    coin.lifetime = 200;
    
    //adjust the depth
    coin.depth = girl.depth;
    girl.depth = girl.depth + 1;
    
    //add each cloud to the group
    coinGroup.add(coin);
  }
  
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 450, 10, 40);
    obstacle.velocityX = -6; //+ score/100);

    //generate random obstacles
    var rand = Math.round(random(1, 6));
    switch(rand) {
     // case 1: obstacle.addImage(obstacle1);
       //       break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    obstacle.setCollider("circle", 0, 0, 1)
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.1;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  coinGroup.destroyEach();
  
  girl.changeAnimation("girl_running", girl_running);
  girl.scale =0.2;
  zombie.x = 50;
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
}

 /* function setup() {
  createCanvas(600, 500);

  ground = createSprite(0, 0, 0, 0);
  ground.shapeColor = "white";
  ground.addImage("ground_image", ground_image);
  ground.scale = 1.4;
  ground.velocityX = -1

  girl = createSprite(300, 420, 600, 10);
  girl.addAnimation("girl_running", girl_running);
  girl.addImage("girl_collided", girl_collided);
  girl.addImage("girlImage", girlImage);
  girl.scale = 0.2;
  // girl.velocityX=2;
  girl.debug = false;
  girl.setCollider("rectangle", 0, 0, girl.width, girl.height)


  zombie = createSprite(50, 410, 600, 10);
  zombie.addAnimation("zombie_running", zombie_running);
  zombie.addAnimation("zombie_attack", zombie_attack);
  zombie.addImage("zombie_idle", zombie_idle);
  zombie.scale = 0.2;
  zombie.debug = false;
  // zombie.velocityY=-13;
  // zombie.velocityX=Math.round(random(1,2));

  invisible_ground = createSprite(300, 470, 600, 10);
  invisible_ground.visible = false;

  gameOver = createSprite(300, 100);
  gameOver.addImage(gameOverImage);

  restart = createSprite(300, 180);
  restart.addImage(restartImage);

  obstaclesGroup = new Group();
  coinGroup = new Group();
  score = 0;
  life = 3;
}

function draw() {
  background("black");

  // console.log(girl.y);
  //Gravity
  girl.velocityY = girl.velocityY + 0.8;
  girl.collide(invisible_ground);

  //Gravity
  zombie.velocityY = zombie.velocityY + 0.8;
  zombie.collide(invisible_ground);
  
  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    //  zombie.y=girl.y;
    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();
    if (obstaclesGroup.isTouching(zombie)) {
      zombie.velocityY = -12;
    }
    ground.velocityX = -(4 + 3 * score / 100);

    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if ((keyDown("space") && girl.y >= 220)) {
      girl.velocityY = -12;
      jumpSound.play();
    }

    if (girl.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
      ground.velocityX = 0;
      girl.velocityY = 0;
      //set lifetime of the game objects so that they are never destroyed
      obstaclesGroup.setLifetimeEach(-1);
      obstaclesGroup.setVelocityXEach(0);
      coinGroup.setLifetimeEach(-1);
      coinGroup.setVelocityXEach(0);
      
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    girl.velocityY = 0
    girl.scale = 0.2;
    girl.changeImage("girlImage", girlImage);
    zombie.changeAnimation("zombie_attack", zombie_attack);
    zombie.x = girl.x;

    if (zombie.isTouching(girl)) {
      girl.changeImage("girl_collided", girl_collided);
      zombie.changeImage("zombie_idle", zombie_idle);
    }
    
    if (gameState===PLAY){
      //score = score + Math.round(getFrameRate()/60);
       if(coinGroup.isTouching(girl)){
         coinSound.play();
         coinGroup[0].destroy();
         score=score+1;
       }
    
        if(score >= 0){
          ground.velocityX = -6;
        }else{
          ground.velocityX = -(6 + 3*score/100);
        }
        
        if(keyDown("space") && girl.y >= 139) {
          mario.velocityY = -12;
        }
        
        girl.velocityY = girl.velocityY + 0.8
        
        if (ground.x < 0){
          ground.x = ground.width/2;
        }
        
        girl.collide(ground);
        
        spawnCoin();
        spawnObstacles();
        
        if(obstaclesGroup.isTouching(girl)){
            life=life-1;
            gameState = END;
        } 
        }
        
        else if (gameState === END ) {
        gameOver.visible = true;
        restart.visible = true;
        girl.addAnimation("collided", girl_collided);
        
        //set velcity of each game object to 0
        ground.velocityX = 0;
        girl.velocityY = 0;
        obstaclesGroup.setVelocityXEach(0);
        coinGroup.setVelocityXEach(0);
        
        //change the trex animation
        girl.changeAnimation("collided",girl_collided);
        girl.scale =0.35;
        
        //set lifetime of the game objects so that they are never destroyed
        obstaclesGroup.setLifetimeEach(-1);
        coinGroup.setLifetimeEach(-1);
        
        if(mousePressedOver(restart)) {
          if(life>0)
          reset();
        }}
  }
   
  drawSprites();
  fill("lightpink");
  textSize(20);
  text("Score: " + score, 500, 50);
  text("life: "+ life , 500,70);
}
function spawnCoin() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
  var coin = createSprite(600,120,40,10);
  coin.y = Math.round(random(100,400));
  coin.addImage(diamondImage);
  coin.scale = 0.1;
  coin.velocityX = -3;
  
   //assign lifetime to the variable
  coin.lifetime = 200;
  
  //adjust the depth
  coin.depth = girl.depth;
  girl.depth = girl.depth + 1;
  
  //add each cloud to the group
  coinGroup.add(coin);
  }
  }

 function reset() { 
 gameState = PLAY;
 gameOver.visible = false;
 restart.visible = false;
 girl.changeAnimation("girl_running", girl_running);
 obstaclesGroup.destroyEach();
 //score = 0;
 zombie.x = 50;
 if(localStorage["HighestScore"]<score){
  localStorage["HighestScore"] = score;
  }
 }

function spawnObstacles() {
if (frameCount % 60 === 0) {
  var obstacle = createSprite(600, 450, 10, 40);
  obstacle.velocityX = -6; //+ score/100);

  //generate random obstacles
  var rand = Math.round(random(1, 6));
  switch(rand) {
   // case 1: obstacle.addImage(obstacle1);
     //       break;
    case 2: obstacle.addImage(obstacle2);
            break;
    case 3: obstacle.addImage(obstacle3);
            break;
    case 4: obstacle.addImage(obstacle4);
            break;
    default: break;
  }
  obstacle.setCollider("circle", 0, 0, 1)
  //assign scale and lifetime to the obstacle           
  obstacle.scale = 0.1;
  obstacle.lifetime = 300;
  //add each obstacle to the group
  obstaclesGroup.add(obstacle);
}}*/


