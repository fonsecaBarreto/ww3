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
                new Body([-400,-400,1280,960,0],200,{key:"background",rect:[0,0,1280,960],step:{r:0,c:0}}),
                new Body([-172,-115,48,18,1],200,{key:"arvore",rect:[-130,-275,289,308],step:{r:0,c:0}}),  
                new Body([248,-178,48,18,1],200,{key:"arvore",rect:[-130,-275,289,308],step:{r:0,c:0}}),  
                new Body([512,460,48,18,1],200,0),  
                
               
              ]
var lastPosition = [0,0];
io.on("connection",function(socket){
  console.log("novo cliente");
  let player = new Player([Math.floor((Math.random()*128)+1),Math.floor((Math.random()*128)+1),32,48,1],colors[Math.floor(Math.random()*colors.length)],{key:"char",rect:[-16,-44,64,96],step:{r:0,c:0}});
  players[socket.id]= player
 
  players[socket.id].id = socket.id
  lastPosition[0]=players[socket.id].position[0]
  socket.emit("welcome",JSON.stringify({players,elements:elements}))
  socket.broadcast.emit("welcome",JSON.stringify({players,elements:elements}))
  /*  */
  socket.on("input",(msg)=>{
    let client = JSON.parse(msg);
    try{

      if(client.playerId in players){

        
        let player = players[client.playerId];

        client.keys[65] == 1 ? player.position[0]-=player.speed: null;
        client.keys[68] == 1 ? player.position[0]+=player.speed: null;

        client.keys[83] == 1 ? player.position[1]+=player.speed: null;
        client.keys[87] == 1 ? player.position[1]-=player.speed: null;
        //detectColision(player,Object.keys(players).map(key=>players[key]))
        detectColision(player,elements)
        updateClients(socket,client.playerId);
      }
    }catch(err){throw err}
   
    
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
    if(corpo.position[2] == player.position[2]){
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

function Body(rect = [0,0,32,32,1],color = 123,texture = {key:"gray",rect:[0,0,64,64],step:{r:0,c:0}}){
  this.texture = texture;
  this.color = color;
  this.position = [rect[0],rect[1],rect[4]];
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
function Player(rect,color,texture){
  Body.call(this,rect,color,texture);
}


