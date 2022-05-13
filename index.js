const express=require("express");
const app=express();
const http=require("http");
const { Server }=require("socket.io");
const cors=require("cors");

app.use(cors())
const server=http.createServer(app);

const io =new Server(server,{
  cors:{
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
    console.log(`A user connected ${socket.id}`);
  
    socket.on("send_message",(data)=>{
        console.log(`va pal room ${data.room}`)
        if(data.room === ''){
            socket.broadcast.emit("receive_sms",data)
        }
        else{
            
            socket.to(data.room).emit("receive_sms",data)
        }
    })

    socket.on("join_room",(id)=>{
        console.log(`EL ROOM: ${id} entro: ${socket.id}`)
        socket.join(id)
    })

    socket.on("END",(id_room)=>{
      console.log(`El ROOM: ${id_room} se cerro`)
      socket.to(id_room).emit("termina_session")
    })
});


server.listen(5000, () =>{
  console.log("SERVER IS RUNNING");
});