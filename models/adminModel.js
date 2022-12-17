const mongoose=require('mongoose');
const adminSchema=mongoose.Schema({
    userID:{
        type:String,
        require:true,
        unique:true
    },
    pic:{
        type:String
    },
    adminname:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    }
},{
    timestamps:true
});

const adminModel=mongoose.model('admin',adminSchema);
module.exports=adminModel;