const express=require('express');
const cors=require('cors');
const socket=require('socket.io');
const mongoose=require('mongoose');
require('dotenv').config();
const Chat=require('./models/chatModel');

const app =express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('views'));


//routes
app.use('/api',require('./routes/api'));

//connecting to db then listening to server
// mongoose.set('strictQuery', true);
mongoose.connect(process.env.DATABASE,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    //listening to server
    const port=5000||process.env.PORT;
    const server=app.listen(port,()=>{
        console.log(`listening to port ${port}`)
    })
    //setting up socket.io 
    const io=socket(server,{
        cors: {}
    });
    io.on('connection',(socket)=>{
        socket.on('output',()=>{
            //getting the chats from db
            Chat.find().then(res=>{
                socket.emit('output',res)
            });
        })
        socket.on('chat',(data)=>{
            //posting chats on db
            const {pic,username,message,userID}=data;
            const msg=new Chat({pic,username,message,userID});
            msg.save().then(()=>{
                //emitting chats to sockets
               socket.emit('chat',data)
            })
        })
    })
})