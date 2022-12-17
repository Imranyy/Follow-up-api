const mongoose=require('mongoose');
const audioSchema=mongoose.Schema({
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
    audioURL:{
        type:String,
        require:true
    }
},{
    timestamps:true
});

const audioModel=mongoose.model('audio',audioSchema);
module.exports=audioModel;