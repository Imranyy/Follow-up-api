const mongoose=require('mongoose');
const schema=mongoose.Schema;

const userSchema=new schema({
    pic:{
        type:String
    },
    username:{
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
const userModel=mongoose.model('user',userSchema);
module.exports=userModel;