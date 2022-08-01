const express=require('express');
const router=express.Router();
const{
    register,
    login,
    verify,
    protect,
    getUsers,
    updateimg
}=require('../controllers/userController')

//post register
router.post('/register',register)
//post login
router.post('/login',login);

//patch image
router.patch('/:id',updateimg)
//get users
router.get('/users',getUsers);
//get verified
router.get('/verify',protect,verify)

module.exports=router;