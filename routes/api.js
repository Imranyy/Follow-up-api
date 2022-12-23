const express=require('express');
const router=express.Router();
const {
    registerUser,
    loginUser,
    getUserInfo,
    deleteUser,
    // getData,
    deleteData,
    protectUser,
    protectAdmin,
    verify,
    getUsers,
    loginAdmin,
    registerAdmin,
    getAllAdmin,
    getAdminInfo,
    adminDeleteAnyData,
    deleteAdmin,
    // uploadMessage,
    uploadTopic,
    getTopics,
}=require('../controllers/podController');

//register admin (only authorised users can register for admin role)
router.post('/admins/register/:userid',protectUser,registerAdmin);

//login admin (only authorised users can login as admin once registered as admins)
router.post('/admins/login',loginAdmin);

//get all admins
router.get('/admins',protectAdmin,getAllAdmin)

//get admin info (only authorised admin)
router.get('/admins/admin/:adminid',protectAdmin,getAdminInfo)

//get verified as user
router.get('/verify',protectUser,verify);

//get verified as admin
router.get('/admins/verify',protectAdmin,verify);

//sign up new user
router.post('/register',registerUser);

//login user
router.post('/login',loginUser);

//get all users (admins only)
router.get('/admins/users',protectAdmin,getUsers);

//get all users (all users)
router.get('/users',protectUser,getUsers);

//getting user info (user only)
router.get('/users/:username',protectUser,getUserInfo);

//deleting user (admin only)
router.delete('/admins/deleteuser/:userid',protectAdmin,deleteUser);

//deleting admin (admin only)
router.delete('/admins/deleteadmin/:adminid',protectAdmin,deleteAdmin);

//deleting any data (admin only)
router.delete('/admins/deletedata/:dataid',protectAdmin,adminDeleteAnyData);

//upload message (only authenticated users and admins)
// router.post('/upload',protectUser,uploadMessage);

//getting all messages (only authenticated users)
// router.get('/data',getData);

//deleting message (only authorised user)
router.delete('/data/:dataid',protectUser,deleteData);

//upload topic
router.post('/topics',protectAdmin,uploadTopic)

//getAllTopics
router.get('/topics',getTopics)

module.exports=router;