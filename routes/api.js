const express=require('express');
const router=express.Router();
const {
 uploadAudio
}=require('../controllers/podController');

//upload route
router.post('/upload',uploadAudio);

module.exports=router;