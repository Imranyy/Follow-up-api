const express=require('express')
const socket=require('socket.io');
const cors=require('cors');


const app=express();

//cors
app.use(cors())

//serve static
//app.use(express.static('public'));

//routes
app.use('/api',require('./routes/api'))

//listening to port
const port=process.env.PORT||5000
const server=app.listen(port,()=>{
    console.log(`server running on port ${port}`)
})
//socket setup
const io=socket(server,{
    cors: {
    }
});
io.on('connection',(socket)=>{
    console.log('socket connection made',socket.id);

    socket.on('chat',(data)=>{
        io.sockets.emit('chat',data)
    })
})

