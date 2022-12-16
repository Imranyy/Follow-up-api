const express=require('express');
const fileUpload=require('express-fileupload');
const cors=require('cors');

const app =express();

//middlewares
app.use(cors());
app.use(fileUpload());
app.use(express.json())

//routes
app.use('/api',require('./routes/api'));

//listening to server
const port=5000||process.env.PORT;
app.listen(port,()=>{
    console.log(`listening to port ${port}`)
})