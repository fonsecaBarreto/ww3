

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
      console.log(updated)
      if(typeof(updated) == "object" ){
        Object.keys(updated).forEach(id=>{
          players[id].position = updated[id].position
        })
      }else{delete players[updated]}
    })
  })
}

function preload() {
  spritedata = loadJSON("/char.json");
  
  sprites = {
    char:loadImage("/char.png")
  }
  textures = {
    char:{0:[loadImage("/char.png")]},
    gray:{0:[loadImage("/gray.webp")]},
    grass: {0:[loadImage("/grass.png")]},
    background: {0:[loadImage("/background.png")]},
    stone: {0:[loadImage("/stone.png")]},
    arvore:{0:[loadImage('/arvore.png')]}
  }
}
async function setup() {
  createCanvas(WIDTH,HEIGHT);



  await Promise.all(Object.keys(sprites).map(async key=>{
    for(let row = 4; row <= 8; row++){
      let rArray = [];
      for(let column = 0; column <= 9 ; column++){
        let pos = {x:10+((column*30)+90*column),y:15 +((row*15)+115*row),w:90,h:115}
        let img = sprites[key].get(pos.x, pos.y,pos.w,pos.h);
        rArray.push(img)
      }  
      textures.char[row]=rArray;
    }
  }));

  return;
  
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
async function draw() {

  inputHandle();
  let x = (ROOT[0]) - mouseX;            
  let y = (ROOT[1]) - mouseY;      
  let grau = (Math.atan2(x,y))*(180/3.14);grau+=90;
  grau = grau <0? grau+360: grau;
  var abertura = 90;
  let inicio = 45;
  let direction = 0 ;
  for(let n= 0; n<=4; n++){
    if((grau>= inicio+(n*abertura) && grau< inicio+(n+1)*abertura)){direction = n;break;}
  }


  //Array.sort([comparer])
  
  background(220);
  /* let after = []
  for (let i=0; i<elements.length; i++)
  {
    let element = elements[i];
    if (element.texture.static != false)
    {
      if ( element.position[1]< players[playerId].position[1]) 
      {
          element.position[2] = 0;
          render(element,cam);
      }
      else {after.push(element);}
    }
    render(element,cam);
  }

  } */
  /*  */


  if(elements.length > 0){elements.forEach(element =>{if(element.position[2] == 0){render(element,cam)};});}
    

/*  */

//Array.sort()
if(Object.keys(players).length > 0){
    Object.keys(players).forEach(key=>{
      let player = players[key];
      //player.texture.step.r = direction == 1 ? 5 : direction == 0 ? 6: direction==2? 4 : 7;
      (keys[65] == true)?player.texture.step.r = 5:4;
      (keys[68] == true)?player.texture.step.r = 7:4;
      (keys[83] == true)?player.texture.step.r = 4:4;
      (keys[87] == true)?player.texture.step.r = 6:4;
      (keys[65] == true | keys[68] == true || keys[83] == true || keys[87] == true) ? player.texture.step.c < 7 ? player.texture.step.c+=.25 : player.texture.step.c= 0: player.texture.step.c = 0;
      render(player,cam);
      document.querySelector("#player-position").innerHTML = `${players[playerId].position[0]}, ${players[playerId].position[1]}`;
    })
  }
/*  */
 // if(after.length > 0){after.forEach(element =>{if(element.position[2] >=1){render(element,cam)};});}
    /*  */
  /* dart manager */
  /* for(let i =0;i<darts.length;i++){
    (darts[i].move()==0) ;//darts.splice(i,1);
    darts[i].draw();
  } */
  drawGrid(cam);
  document.querySelector("#cam").innerHTML = `${cam.position[2]}`;

    
}
function render(element,cam){
  noFill()
  stroke(240,35,30);
  let vec = [
  (ROOT[0]-cam.position[0]) + (element.position[0]* cam.position[2]) ,
  (ROOT[1]-cam.position[1]) + (element.position[1]* cam.position[2]) ,
  element.width  * cam.position[2] ,
  element.height * cam.position[2]];
 if(element.texture != 0){
    let imgVec = [vec[0]+ (element.texture.rect[0] * cam.position[2]),vec[1] + (element.texture.rect[1] * cam.position[2]) ,
      element.texture.rect[2] * cam.position[2],element.texture.rect[3] * cam.position[2]];
 
      
      image(textures[element.texture.key][Math.round(element.texture.step.r)][Math.round(element.texture.step.c)],...imgVec);
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
//darts.push(new Dart(players[playerId]))
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
