const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
require('dotenv').config();

const app =express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));


//routes
app.use('/api',require('./routes/api'));

//connecting to db then listening to server
mongoose.connect(process.env.LOCALURI,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>{
    //listening to server
    const port=5000||process.env.PORT;
    app.listen(port,()=>{
        console.log(`listening to port ${port}`)
    })
})