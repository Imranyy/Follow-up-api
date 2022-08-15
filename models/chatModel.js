const mongoose=require('mongoose')
const Schema=mongoose.Schema;

const chatSchema=new Schema({
    pic:{
        type:String
    },
    name:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    },
    time:{
        type:String,
        require:true
    }
},{
    timestamps:true
})

const chatModel=mongoose.model('chat',chatSchema);
module.exports=chatModel;
