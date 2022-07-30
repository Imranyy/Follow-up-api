const express=require('express');
const router=express.Router();
const{
    register,
    login,
    verify,
    protect,
    getUsers,
    postChat,
    getChats
}=require('../controllers/userController')

//post register
router.post('/register',register)
//post login
router.post('/login',login);
//post chat
router.post('/chat',postChat)

//get users
router.get('/users',getUsers);
router.get('chat',getChats)
//get verified
router.get('/verify',protect,verify)

module.exports=router;