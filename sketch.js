
var keys = {}
/*  */
var WIDTH= 1080, HEIGHT = 720;
var ROOT = [WIDTH/2,HEIGHT/2];
players = {};
var playerId = null;
var elements = [];
var cam = {
  position : [0,0],
  speed : 10
}
window.onload = ()=>{
  socket = io.connect('http://10.0.10.193:3000'); 
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
function inputHandle(){
  if(Object.keys(keys).length > 0){
    socket.emit("input",JSON.stringify({keys,playerId}))
  }
 
  //cam.position[0]+=  (keys[68] ? cam.speed: 0) - (keys[65] ? cam.speed : 0 ) ;
  //cam.position[1]+=  (keys[83] ? cam.speed: 0) - (keys[87] ? cam.speed : 0 ) ; 
  cam.position[0]=  players[playerId].position[0]+players[playerId].width/2
  cam.position[1]=  players[playerId].position[1]+players[playerId].height/2
  //cam.position[1]=  (keys[83] ? cam.speed: 0) - (keys[87] ? cam.speed : 0 ) ; 
 
}
function draw() {
 

    inputHandle();
    background(220);
    if(Object.keys(players).length > 0){
      Object.keys(players).forEach(key=>{
        let player = players[key];
        render(player,cam);
        document.querySelector("#player-position").innerHTML = `${players[playerId].position[0]}, ${players[playerId].position[1]}`;
      })
    }
    if(elements.length > 0){
      elements.forEach(element => {render(element,cam)});
    }
    drawGrid(cam);
    
}
function render(element,cam){
  fill(element.color);
  stroke(element.stroke);
  rect(ROOT[0]-cam.position[0]+element.position[0],ROOT[1]-cam.position[1]+element.position[1],element.width,element.height);
}

function keyPressed(){keys[keyCode]=1;}
function keyReleased(){
  keys[keyCode]=undefined;
  delete keys[keyCode];
  socket.emit("input",JSON.stringify({keys,playerId}))
}
