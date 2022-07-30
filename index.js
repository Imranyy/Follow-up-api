const express=require('express')
const cors=require('cors');
const mongoose=require('mongoose')
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
     app.listen(port,()=>{
    console.log(`server running on port ${port}`)
    
})
})


