const express=require('express');
const router=express.Router();
const{
    register,
    login,
}=require('../controllers/userController')

//post register
router.post('/register',register)
//post login
router.post('/login',login);

module.exports=router;