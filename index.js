const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const port = 4000 || process.env.PORT;

const app = express();
const users = [{}];

app.use(cors());

app.get("/", (req, res) => {
  res.send("HELL IS WORKING");
});

const server = http.createServer(app);

const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("New Connection");

  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    console.log(`${user} has joined`);
    socket.broadcast.emit("user Joined", {
        user: "Admin",
        message: `${users[socket.id]} has joined`,
      });
      socket.emit("Welcome", { user: "Admin", message: `Welcome to the chat, ${users[socket.id]}` });
    });
    
    socket.on('message',({message,id})=>{
      io.emit('sendMessage',{user:users[id],message,id});
  })

  socket.on('disconnect',()=>{
    socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
    console.log(`user left`);
})
  
});

server.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
