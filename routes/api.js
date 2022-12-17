const express=require('express');
const router=express.Router();
const {
    registerUser,
    loginUser,
    getUserInfo,
    deleteUser,
    getData,
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
    uploadAudio
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
router.get('/users',protectAdmin,getUsers);

//getting user info (user only)
router.post('/users/:id',protectUser,getUserInfo);

//deleting user (admin only)
router.delete('/admins/deleteuser/:userid',protectAdmin,deleteUser);

//deleting admin (admin only)
router.delete('/admins/deleteadmin/:adminid',protectAdmin,deleteAdmin);

//deleting any data (admin only)
router.delete('/admins/deletedata/:dataid',protectAdmin,adminDeleteAnyData);

//upload route (only authenticated users and admins)
router.post('/upload',protectUser,uploadAudio);

//getting all audio (only authenticated users)
router.get('/data',getData);

//deleting audio (only authorised user)
router.delete('/data/:dataid',protectUser,deleteData);

module.exports=router;