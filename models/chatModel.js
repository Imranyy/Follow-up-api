const mongoose=require('mongoose');
const chatSchema=mongoose.Schema({
    userID:{
        type:String,
        require:true
    },
    pic:{
        type:String
    },
    username:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    }
},{
    timestamps:true
});

const chatModel=mongoose.model('chat',chatSchema);
module.exports=chatModel;