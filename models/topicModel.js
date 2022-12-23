const mongoose=require('mongoose');
const topicSchema=mongoose.Schema({
    userID:{
        type:String,
        require:true
    },
    pic:{
        type:String
    },
    adminname:{
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

const topicModel=mongoose.model('topic',topicSchema);
module.exports=topicModel;