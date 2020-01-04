
var keys = {}
/*  */
var WIDTH= 1080, HEIGHT = 720;
var ROOT = [WIDTH/2,HEIGHT/2]
var player =  new Player([0,0,64,96],180);
var player2 =  new Player([100,0,64,96],180);
var elements = [player, player2, new Body([-300,300,100,100]),new Body([-200,100,100,100]),new Body([300,-150,100,100]),new Body([200,180,100,100])];
var cam = {
  position : [0,0],
  speed : 10
}
function preload() {
  spritedata = loadJSON("/char.json");
  spritesheet = loadImage("/char.png")
}
function setup() {
  createCanvas(WIDTH,HEIGHT);
 /*  let frames = spritedata.frames;
  for(let i =0 ; i< frames.length; i ++){
    let pos = frames[i].position
    let img = spritesheet.get(pos.x, pos.y,pos.w,pos.h);
    player.animation.push(img);
  } */
  //console.log(animation)
}
function drawGrid(){
  stroke(200,50,50)
  line(ROOT[0]-cam.position[0],ROOT[1]-cam.position[1],0 -cam.position[0],ROOT[1]-cam.position[1])
  line(ROOT[0]-cam.position[0],ROOT[1]-cam.position[1],WIDTH-cam.position[0],ROOT[1]-cam.position[1])
  line(ROOT[0]-cam.position[0],ROOT[1]-cam.position[1],ROOT[0]-cam.position[0],0-cam.position[1])
  line(ROOT[0]-cam.position[0],ROOT[1]-cam.position[1],ROOT[0]-cam.position[0],HEIGHT-cam.position[1])
}
function draw() {
    background(220);
    cam.position[0]+=  (keys[68] ? cam.speed: 0) - (keys[65] ? cam.speed : 0 ) ;
    cam.position[1]+=  (keys[83] ? cam.speed: 0) - (keys[87] ? cam.speed : 0 ) ;
    player.velocity[0] =  (keys[68] == undefined ? 0: keys[68]  * player.speed) - (keys[65] == undefined ? 0: keys[65]  * player.speed) ;
    player.velocity[1] =  (keys[83] == undefined ? 0: keys[83]  * player.speed) - (keys[87] == undefined ? 0: keys[87]  * player.speed) ;
    
    player.update();
    detectColision(player)
    render(player,cam);
    elements.forEach(element => {render(element,cam)});
  /* dev */
    drawGrid(cam);
    document.querySelector("#player-position").innerHTML = `${player.position[0]}, ${player.position[1]}`
}
function render(element,cam){
  fill(element.color);
  stroke(element.stroke);
  rect(ROOT[0]-cam.position[0]+element.position[0],ROOT[1]-cam.position[1]+element.position[1],element.width,element.height);

  /* if(element.animation == undefined){
    rect(ROOT[0]-cam.position[0]+element.position[0],ROOT[1]-cam.position[1]+element.position[1],element.width,element.height);
  }else{
    image(element.animation[frameCount % element.animation.length], ROOT[0]-cam.position[0]+element.position[0],ROOT[1]-cam.position[1]+element.position[1],element.width,element.height);
  } */
}
function detectColision(player){
  elements.forEach(corpo=>{
     var d1x = corpo.position[0]  - (player.position[0]+player.width);
     var d1y = corpo.position[1]  - (player.position[1]+player.height);
     var d2x = player.position[0] - (corpo.position[0] +corpo.width);
     var d2y =player.position[1] -  (corpo.position[1] +corpo.height);

     if(d1x > 0 || d1y > 0){}
     else if(d2x > 0 || d2y > 0){}
     else{
      
       if(d1x > d2x && d1x > d1y && d1x > d2y ){
        player.position[0]=corpo.position[0]-player.width;
        cam.position[0]=corpo.position[0]-player.width;
    
      } 
       else if(d2x > d1x  && d2x > d1y && d2x > d2y){
         player.position[0] = corpo.position[0]+corpo.width
         cam.position[0] = corpo.position[0]+corpo.width
       
        } 
       else if(d1y > d2x && d1y > d1x && d1y > d2y ){
         player.position[1] = corpo.position[1]-player.height
         cam.position[1] = corpo.position[1]-player.height
      
        } 
       else if(d2y > d1x  && d2y > d1y && d2y > d2x){
         player.position[1] = corpo.position[1]+corpo.height
         cam.position[1] = corpo.position[1]+corpo.height
 
       }
     }
  })
}
function keyPressed(){
  keys[keyCode]=1;
}
function keyReleased(){
  keys[keyCode]=0;
}
function Body(rect = [0,0,32,32],color = 123){
  this.color = color;
  this.position = [rect[0],rect[1]];
  this.width = rect[2];
  this.height = rect[3];
  this.speed = 10;
  this.velocity = [0,0]
  this.color = 200;
  this.stroke = 100;
  this.update = ()=>{
    this.position[0]+=this.velocity[0];
    this.position[1]+=this.velocity[1];
  };
 
}
function Player(rect,color){
  Body.call(this,rect,color);
  this.animation = [];
}