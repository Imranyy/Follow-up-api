const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema=new Schema({
    pic:{
        type:String,
    },
    name:{
        type:String,
        require:true
    },
    number:{
        type:Number,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    }
},{
    timestamps:true
})
const userModel=mongoose.model('user',userSchema);
module.exports=userModel;
