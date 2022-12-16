

const uploadAudio=async(req,res)=>{
    const {title,audio}=req.body;
    if(audio==null){
        res.status(400).send({msg:'No file was uploaded'});
    }
    res.send({
        msg:'Audio sent successful',
        results:{
        title,
        audio
        }
    })
    //moving the audio file to /public/audio/filename on the client side
    // audio.mv(`${__dirname}/public/audio/${audio.name}`,err=>{
    //     if(err){
    //         res.send(err)
    //     }
    //     //sending the file and the audio path back to the client
    //     res.send({
    //         title,
    //         fileName:audio.name, 
    //         filePath:`/upload/${audio.name}`
    //     })
    // })
}

module.exports={
    uploadAudio,
}