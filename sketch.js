  // declaring variables
  var trex;
  var trexImage;
  var edges;
  var ground;
  var groundImage;
  var invisibleBarrier;
  var invisibleGround;
  var clouds;
  var cloudsImage;
  var obstacles;
  var obstacles1,obstacles2,obstacles3,obstacles4,obstacles5,obstacles6;
  var score;
  var PLAY=1;
  var END=0;
  var gameState=PLAY;
  var cloudsGroup;
  var obstaclesGroup;
  var trexCollidedImage;
  var jumpSound;
  var dieSound;
  var checkpointSound;
  var restart,restartImage;
  var gameover,gameoverImage;


  //loading images
  function preload(){
    trexImage=loadAnimation("trex1.png","trex3.png","trex4.png");
    groundImage=loadImage("ground2.png")
    
    cloudsImage=loadImage("cloud.png")
    
    trexCollidedImage=loadImage("trex_collided.png")
    
    obstacles1=loadImage("obstacle1.png")
    obstacles2=loadImage("obstacle2.png")
    obstacles3=loadImage("obstacle3.png")
    obstacles4=loadImage("obstacle4.png")
    obstacles5=loadImage("obstacle5.png")
    obstacles6=loadImage("obstacle6.png")
    
    jumpSound=loadSound("jump.mp3")
    dieSound=loadSound("die.mp3")
    checkpointSound=loadSound("checkPoint.mp3")
    
    gameoverImage=loadImage("gameOver.png")
    restartImage=loadImage("restart.png")
  
  }

  //creating sprites and adding animations
  function setup(){
     createCanvas(600,200);
      
    //Creating group sprites
    cloudsGroup=new Group();
    obstaclesGroup=createGroup();
    
    //creating T-rex sprite
    trex=createSprite(50,150,20,40);
    trex.addAnimation("trexAnimation",trexImage);
    trex.addAnimation("trex collided",trexCollidedImage);
    trex.scale=0.4;

    ground=createSprite(300,180,600,5)
    ground.addImage("groundImage",groundImage)
    
    //creating edge sprites
    edges=createEdgeSprites();

    invisibleBarrier= createSprite(200,20,600,5);
    //Making the sprite invisible
    invisibleBarrier.visible=false;

    //To make the Trex walk inside the ground
    invisibleGround= createSprite(200,190,600,5);
    invisibleGround.shapeColor= "white";
    
    restart=createSprite(300,110,20,20);
    restart.addImage("restart image",restartImage);
    restart.scale=0.3;
    restart.visible=false;
    
    gameover=createSprite(300,80,20,20);
    gameover.addImage("gameover image",gameoverImage);
    gameover.scale=0.5;
    gameover.visible=false;
    
    //randomNumber= Math.round(random(1,10));
    //console.log("hello"+" "+"world");
    
    score=0;
    
    //trex.debug=true;
    trex.setCollider("circle",0,0,40);
    
  }



  function draw(){
    background ("white");
    
    if(gameState===PLAY){
      
       score=score+Math.round(frameCount/200);
     
      trex.velocityY=trex.velocityY+0.6;
      
        //jump when space in pressed
      if(keyDown("space")&& trex.y >= 100){
        trex.velocityY=-9;
        jumpSound.play();
        }
            
    if(score>0 && score %100 === 0){
      checkpointSound.play();  
    }
      
        ground.velocityX=-(4+score/300);

        //Resolving the Trex from going in space
      if(trex.isTouching(invisibleBarrier)){
        trex.bounceOff(invisibleBarrier);
      }

      spawnClouds();
      spawnObstacles();

      if(trex.isTouching(obstaclesGroup)){
        gameState=END;
        dieSound.play();
        //.velocityY=-5;
        
      }


      } 
    else{
      
      if(gameState===END){
        ground.velocityX=0;
        
        restart.visible=true;
        gameover.visible=true;
        
        score=score;
        
        trex.velocityY=0;
        trex.changeAnimation("trex collided",trexCollidedImage);
        
        obstaclesGroup.setVelocityXEach(0);
        cloudsGroup.setVelocityXEach(0);
        obstaclesGroup.setLifetimeEach(-1);
        cloudsGroup.setLifetimeEach(-1);
       
        if (mousePressedOver(restart)){
          reset();
        }
        
      }
    }
          
    //console.log(frameCount);

    //creating gravity
  
    trex.collide(invisibleGround);

    if(ground.x<0){
      ground.x=ground.width/2;
    }

  
    
    drawSprites();
    
    fill("black");
    textSize(12);
    text("Score:"+score,500,50);
    
   
  
}

function spawnClouds(){
  if(frameCount%100===0){
    clouds=createSprite(590,50,20,20);
    clouds.scale=0.8;
    clouds.y=Math.round(random(10,70));
    clouds.velocityX=-3;
    //assign lifetime to clouds(memory leak).
    clouds.lifetime=200;
    clouds.addImage("Clouds",cloudsImage);
    //adjust the depth
    clouds.depth=trex.depth;
    trex.depth=trex.depth+1;
    //console.log("clouds.depth"+clouds.depth);
    //console.log("trex.depth"+trex.depth);
    cloudsGroup.add(clouds);
    //clouds.debug=true
    
  }
}

function spawnObstacles(){
  
  if(frameCount%100===0){
  obstacles=createSprite(600,170,20,20);
  obstacles.velocityX=-(3+3*score/200);
  //generate random obstacles.
  var randomObstacles=Math.round(random(1,6));
  switch(randomObstacles){
    case 1:obstacles.addImage(obstacles1);
    break;
    case 2:obstacles.addImage(obstacles2);
    break;
    case 3:obstacles.addImage(obstacles3);
    break;
    case 4:obstacles.addImage(obstacles4);
    break;
    case 5:obstacles.addImage(obstacles5);
    break;
    case 6:obstacles.addImage(obstacles6);
    break;
    default:
    break;
  }  
   obstacles.scale=0.4; 
  obstaclesGroup.add(obstacles);
  obstacles.lifetime=600/3;
  //obstacles.debug=true;
  }
}
function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0;
  gameover.visible=false;
  restart.visible=false;
  trex.changeAnimation("trexAnimation",trexImage);
}