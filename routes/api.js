const express=require('express');
const router=express.Router();
const{
    register,
    login,
    verify,
    protect
}=require('../controllers/userController')

//post register
router.post('/register',register)
//post login
router.post('/login',login);

//get verified
router.get('/verify',protect,verify)

module.exports=router;