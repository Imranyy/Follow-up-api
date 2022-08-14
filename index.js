const express=require('express');
const webpush=require('web-push');
const bodyParser=require('body-parser');
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

//VAPID KEYS
const publicVapidKey=process.env.PUBLICVAPIDKEY;
const privateVapidKey=process.env.PRIVATEVAPIDKEY;

//urlencoded
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));

//routes
app.use('/api',require('./routes/api'));
//webpush
webpush.setVapidDetails('mailto:imranmat254@gmail.com',publicVapidKey,privateVapidKey);
//subscribe route
app.post('/subscribe',(req,res)=>{
    //get pushSubscription object
    const {subscription,message,name,pic}=req.body;
    //send 201 -resource created
    res.status(201).send({})
    //create payload
    const payload=JSON.stringify({
        title:`New Message from ${name}😜😜`,
        body:message,
        icon:pic
    });
    //pass object into sendNotification
    webpush.sendNotification(subscription,payload).catch(err=>console.error(err))
});


mongoose.connect(process.env.LOCALURI,{
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
        const {pic,name,message}=data;
        const msg=new Chat({pic,name,message})
        msg.save().then(()=>{
            //emitting chats to sockets
           io.emit('chat',data)
        })
    })
})
})
})


