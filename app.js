var express = require("express");
var http = require("http");
var socketIo = require('socket.io');
var bodyParser = require("body-parser")
const app = express();

server = http.createServer(app);
const io = socketIo(server);
app.use(express.urlencoded({extended:true}))
app.use(express.static("./"));
app.get("/",(req,res)=>{
  req.sendFile("/index.html")
})
server.listen(3000,()=>{
  console.log("runnign")






});

io.on("connection",function(client){
  console.log("novo cliente")
  client.emit("welcome",{id:client.id})
})
