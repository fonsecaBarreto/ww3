

var keys = {}
/*  */
var WIDTH= window.innerWidth *.95, HEIGHT= window.innerHeight * .95;
var ROOT = [WIDTH/2,HEIGHT/2];
players = {};
var playerId = null;
var elements = [];
var cam = {
  position : [0,0,1],
  speed : 8
}
window.onload = ()=>{
  socket = io.connect(); 
  socket.on("connect",function(){
    socket.on("welcome",function(msg){
      resp = JSON.parse(msg);
      players = resp.players;
      elements = resp.elements;
      playerId = socket.id
      
    });
    socket.on("update",function(msg){
      let updated = JSON.parse(msg);
      typeof(updated) == "object" ? players = updated : delete players[updated];
    

    })
  })
}

function preload() {
  spritedata = loadJSON("/char.json");
  spritesheet = loadImage("/char.png");
  textures = {
    char:loadImage("/wolf.png"),
    gray:loadImage("/gray.webp"),
    grass: loadImage("/grass.png"),
    background: loadImage("/background.png"),
    stone: loadImage("/stone.png"),}
}
function setup() {
  createCanvas(WIDTH,HEIGHT);
 
  /* let frames = spritedata.frames;
  for(let i =0 ; i< frames.length; i ++){
    let pos = frames[i].position
    let img = spritesheet.get(pos.x, pos.y,pos.w,pos.h);
    player.animation.push(img);
  } */

}
function drawGrid(){
  stroke(222,60,60)
  line(ROOT[0],ROOT[1],0,ROOT[1]);
  line(ROOT[0],ROOT[1],window.innerWidth,ROOT[1])
  line(ROOT[0],ROOT[1],ROOT[0],0)
  line(ROOT[0],ROOT[1],ROOT[0],window.innerHeight)
}
function inputHandle(){
  if(Object.keys(keys).length > 0){socket.emit("input",JSON.stringify({keys,playerId}))}
  keys["187"] == true? cam.position[2]+=.05:null;
  keys["189"] == true? cam.position[2]-=.05:null;
  cam.position[0]=  (players[playerId].position[0]+players[playerId].width/2 ) * cam.position[2];
  cam.position[1]=  (players[playerId].position[1]+players[playerId].height/2) * cam.position[2];
}
function draw() {

  inputHandle();
  background(220);
  if(elements.length > 0){elements.forEach(element => {render(element,cam)});}
  
  if(Object.keys(players).length > 0){
    Object.keys(players).forEach(key=>{
      let player = players[key];
      render(player,cam);
      document.querySelector("#player-position").innerHTML = `${players[playerId].position[0]}, ${players[playerId].position[1]}`;
    })
  }
  /* dart manager */
  for(let i =0;i<darts.length;i++){
    (darts[i].move()==0) ;//darts.splice(i,1);
    darts[i].draw();
  }
  drawGrid(cam);
  document.querySelector("#cam").innerHTML = `${cam.position[2]}`;

    
}
function render(element,cam){
  noFill()
  stroke(230,30,30);
  // 
  let vec = [(ROOT[0]-cam.position[0]) + (element.position[0]* cam.position[2]) ,
             (ROOT[1]-cam.position[1]) + (element.position[1]* cam.position[2]) ,
             element.width  * cam.position[2] ,
             element.height * cam.position[2]];



 if(element.texture != 0){
    let imgVec = [
      (ROOT[0]-(cam.position[0])+ (element.position[0]* cam.position[2]) + (element.texture.rect[0] * cam.position[2])) ,
      (ROOT[1]-(cam.position[1])+ (element.position[1]* cam.position[2]) + (element.texture.rect[1] * cam.position[2])) ,
      element.texture.rect[2] * cam.position[2] ,
      element.texture.rect[3] * cam.position[2]]
      image(textures[element.texture.key],...imgVec)
       
  }
  rect(...vec);
}

function keyPressed(){keys[keyCode]=1;}
function keyReleased(){
  keys[keyCode]=undefined;
  delete keys[keyCode];
  socket.emit("input",JSON.stringify({keys,playerId}))
}

darts = []
function mousePressed()
{
darts.push(new Dart(players[playerId]))
}
function mouseReleased()
{}

function Dart(rect){
  this.iPos= [rect.position[0]+rect.width/2,rect.position[1]+rect.height/2];
  this.fPos= [mouseX + cam.position[0]-ROOT[0], mouseY + cam.position[1]-ROOT[1]];
  this.speed = 25;
  var hip = dist(this.fPos[0],this.fPos[1],this.iPos[0],this.iPos[1]);
  var xv = (this.fPos[0]-this.iPos[0])/hip*this.speed;
  var yv = (this.fPos[1]-this.iPos[1])/hip*this.speed;

  this.dx = Math.abs(this.fPos[0]-this.iPos[0]);
  this.iXPos = this.iPos[0];

  this.draw = ()=>{
    
    stroke(0);
    fill(0,0,  255)
    radius = 20
    circle(ROOT[0]-cam.position[0]+this.iPos[0],ROOT[1]-cam.position[1]+this.iPos[1],2*radius);
  }


  this.move =()=>{
    //(Math.abs(this.iPos[0]-this.iXPos) >= this.dx) ? 0 :null;
      this.iPos[0]+=xv;
      this.iPos[1]+=yv;
    }

}