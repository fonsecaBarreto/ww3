var express = require("express");
var http = require("http");
var socketIo = require('socket.io');
var bodyParser = require("body-parser")
const app = express();

server = http.createServer(app);
const io = socketIo(server);
app.use(express.urlencoded({extended:true}))
app.use(express.static("./"));
app.get("/",(req,res)=>{ req.sendFile("/index.html")})
server.listen(3000,()=>{console.log("runnign")});
var colors =[[191,191,63],[191,63,63],[232,32,122],[200,32,32]] 
var players = {}
var elements = [
                new Body([-400,-400,1280,960],200,0,{key:"background",rect:[0,0,1280,960]}),
                new Body([-172,-115,48,18],200,1,0),  
                new Body([248,-178,48,18],200,1,0),  
                
               
              ]
var lastPosition = [0,0];
io.on("connection",function(socket){
  console.log("novo cliente");
  let player = new Player([lastPosition[0]+64,lastPosition[1],38,50],colors[Math.floor(Math.random()*colors.length)],1,{key:"char",rect:[-12,-40,64,96]});
  players[socket.id]= player
 
  players[socket.id].id = socket.id
  lastPosition[0]=players[socket.id].position[0]
  socket.emit("welcome",JSON.stringify({players,elements:elements}))
  socket.broadcast.emit("welcome",JSON.stringify({players,elements:elements}))
  /*  */
  socket.on("input",(msg)=>{
    let client = JSON.parse(msg);
 
    let player = players[client.playerId];

    client.keys[65] == 1 ? player.position[0]-=player.speed: null;
    client.keys[68] == 1 ? player.position[0]+=player.speed: null;

    client.keys[83] == 1 ? player.position[1]+=player.speed: null;
    client.keys[87] == 1 ? player.position[1]-=player.speed: null;
    //detectColision(player,Object.keys(players).map(key=>players[key]))
    detectColision(player,elements)
    updateClients(socket,client.playerId);
   
    
  });
  socket.on("disconnect",function(scoket){
    console.log(socket.id, "has disconnected");
    delete players[socket.id];
    updateClients(socket,socket.id);
    
  })

  
});
function detectColision(player,elements){
  elements.forEach(corpo=>{
 
    try{
    if(corpo.zIndex == player.zIndex){
     var d1x = corpo.position[0]  - (player.position[0]+player.width);
     var d1y = corpo.position[1]  - (player.position[1]+player.height);
     var d2x = player.position[0] - (corpo.position[0] +corpo.width);
     var d2y =player.position[1] -  (corpo.position[1] +corpo.height);

     if(d1x > 0 || d1y > 0){}
     else if(d2x > 0 || d2y > 0){}
     else{
       if(d1x > d2x && d1x > d1y && d1x > d2y ){player.position[0]=corpo.position[0]-player.width;} 
       else if(d2x > d1x  && d2x > d1y && d2x > d2y){player.position[0] = corpo.position[0]+corpo.width;} 
       else if(d1y > d2x && d1y > d1x && d1y > d2y ){player.position[1] = corpo.position[1]-player.height;} 
       else if(d2y > d1x  && d2y > d1y && d2y > d2x){player.position[1] = corpo.position[1]+corpo.height;}
     }
    }
  }catch(err){}
  })
}
function updateClients(socket,id){
  socket.emit("update",JSON.stringify(id in players ? players : id));
  socket.broadcast.emit("update",JSON.stringify(id in players ? players : id))
}

function Body(rect = [0,0,32,32],color = 123,zIndex = 1,texture = {key:"gray",rect:[0,0,64,64]}){
  this.texture = texture
  this.zIndex = zIndex;
  this.color = color;
  this.position = [rect[0],rect[1]];
  this.width = rect[2];
  this.height = rect[3];
  this.speed = 10;
  this.velocity = [0,0]
  this.stroke = 100;
  this.animation = [];
  this.update = ()=>{
    this.position[0]+=this.velocity[0];
    this.position[1]+=this.velocity[1];
  };
 
}
function Player(rect,color,zIndex,texture){
  console.log(rect,color,zIndex,texture)
  Body.call(this,rect,color,zIndex,texture);
  this.rect = rect;
  this.rect.height/=2;
  
}


