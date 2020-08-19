const path=require("path")
const express=require("express")
const http=require("http")
const url=require("url")
const formatMessage=require("./message")
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require("./users")

const app=express()
const server=http.createServer(app)

const io=require("socket.io")(server)

const PORT=process.env.PORT || 3000

app.use(express.static(path.join(__dirname,'public')))

//user ids
var users={};
var time;
//socket settings

io.on("connection",(socket)=>{

    socket.on("joinRoom",({username,room})=>{

        const msg=`${username} Connnected`
        const user=userJoin(socket.id,username,room)
        socket.join(user.room)
        
        socket.broadcast
        .to(user.room)
        .emit('message',formatMessage("ChatBot",msg))

        //send room and room info
        io
        .to(user.room)
        .emit('room-info',getRoomUsers(user.room))
    })

    socket.on('message',msg=>{
        const user=getCurrentUser(socket.id);
        
        socket.broadcast
        .to(user.room)
        .emit('message',formatMessage(user.username,msg))
    })
    
    socket.on("typing",name=>{
        const user=getCurrentUser(socket.id);
        
        socket.broadcast
        .to(user.room)
        .emit("typing",name)
    })

    socket.on('disconnect', () => {
        // const user=getCurrentUser(socket.id);
        const user=userLeave(socket.id)

        //send room and room info
        socket.broadcast
        .to(user.room)
        .emit('room-info',getRoomUsers(user.room))


        socket.broadcast
        .to(user.room)
        .emit("message",formatMessage("ChatBot",`${user.username} Disconnected`))
        
        //disconnecting the user
        socket.disconnect(true)
    });
})

server.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`)
})