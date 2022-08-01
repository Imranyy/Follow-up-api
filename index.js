const express=require('express')
const socket=require('socket.io');
const cors=require('cors');
const mongoose=require('mongoose');
const Chat=require('./models/chatModel')
require('dotenv').config();
const app=express();

//cors
app.use(cors())

//serve static
//app.use(express.static('public'));

//urlencoded
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//routes
app.use('/api',require('./routes/api'))

mongoose.connect(process.env.DATABASE,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    //listening to port
    const port=process.env.PORT||5000
    const server=app.listen(port,()=>{
    console.log(`server running on port ${port}`)
    //socket setup
    const io=socket(server,{
            cors: {
                
            }
        })
    io.on('connection',(socket)=>{
        //getting the chats from db
        Chat.find().then(res=>{
            socket.emit('output',res)
        })
    console.log(`socket connection made: ${socket.id}`);
    
    socket.on('chat',(data)=>{
        //posting chats on db
        const {pic,name,message}=data
        const msg=new Chat({pic,name,message})
        msg.save().then(()=>{
            //emitting chats to sockets
           io.emit('chat',data)
        })
    })
})
})
})


