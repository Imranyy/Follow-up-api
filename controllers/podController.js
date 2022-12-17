const User=require('../models/userModel');
const Admin=require('../models/adminModel');
const Audio=require('../models/audioModel');
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
require('dotenv').config()

//register user
const registerUser=async(req,res)=>{
        try {
            const {pic, username, email, password}=req.body;
            if(pic&&username&&email&&password){
                //check if user exist in the db
                const userExit=await User.findOne({email});
                if(userExit){
                    res.send({msg:'A user already exists with this email ...Try again!'});
                }
                //hashing the password
                const salt=await bcrypt.genSalt(10);
                const hashedPassword=await bcrypt.hash(password,salt);
                //creating user account in db
                const newUser=await User.create({
                    pic,
                    username,
                    email,
                    password:hashedPassword
                });
                if(newUser){
                    res.status(200).send({
                        _id:newUser.id,
                        pic:newUser.pic,
                        username:newUser.username,
                        email:newUser.email,
                        token:generateUserToken(newUser.id)
                    })
                }else{
                    res.status(201).send({msg:'Invalid User Data!'})
                }
            }else{
                res.send({msg:'Enter all fields'});
            }
        } catch (error) {
            res.status(500).send(error.message)
        }
};

//login User
const loginUser=async(req,res)=>{
    try{
        const {email,password} =req.body;
        const user=await User.findOne({email});
        if(user&&(await bcrypt.compare(password,user.password))){
            res.status(200).send({
                _id:user.id,
                pic:user.pic,
                username:user.username,
                email:user.email, 
                token:generateUserToken(user.id)
            })
        }else{
            res.status(400).send({msg:'Invalid Credentials'})
        }
    }catch(err){
        res.status(500).send(err.message)
    }
}

//register admin
const registerAdmin=async(req,res)=>{
    try {
        const {userid}=req.params;
        if(!mongoose.Types.ObjectId.isValid(userid)){
            return res.status(404).send({msg:'Must be a valid user so that you can register for admin roles'})
          }
          const validUser=await User.findById({_id:userid})
          if(validUser){
            const {pic,username,password,email}=req.body;
            if(pic&&username&&password&&email){
                //check if admin exist in the db
                const adminExit=await Admin.findOne({userID:userid});
                if(adminExit){
                    res.send({msg:'Admin exists already!'});
                }
                //hashing the password
                const salt=await bcrypt.genSalt(10);
                const hashedPassword=await bcrypt.hash(password,salt);
                //creating new Admin account in db
                const registerNewAdmin=await Admin.create({
                    userID:userid,
                    pic,
                    adminname:username,
                    password:hashedPassword,
                    email
                })
                res.status(200).send({
                    msg:`${registerNewAdmin.adminname}, you are now registered as an admin`,
                    _id:registerNewAdmin.id,
                    userID:registerNewAdmin.userid,
                    pic:registerNewAdmin.pic,
                    adminname:registerNewAdmin.adminname,
                    email:registerNewAdmin.email,
                    AdminToken:generateAdminToken(registerNewAdmin.id)
                })
            }else{
                res.send({msg:'Enter All the required fields'})
            }
          }else{
            res.status(404).send({msg:'Must be a valid user so that you can register for admin roles'});
          }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//login admin
const loginAdmin=async(req,res)=>{
 try {
    const {email,password} =req.body;
    const admin=await Admin.findOne({email});
    if(admin&&(await bcrypt.compare(password,admin.password))){
        res.status(200).send({
            _id:admin.id,
            userID:admin.userID,
            pic:admin.pic,
            adminname:admin.adminname,
            email:admin.email, 
            adminToken:generateAdminToken(admin.id)
        })
    }else{
        res.status(400).send({msg:'Invalid Credentials'})
    }
 } catch (error) {
    res.status(500).send(error.message);
 }
}

//get all admins
const getAllAdmin=async(req,res)=>{
    try {
        const allAdmins=await Admin.find({});
        res.status(200).send(allAdmins);
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//get admin info (only authenticated admin)
const getAdminInfo=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).send({msg:'No such Admin'})
          }
          const admin=await Admin.findById({_id:id});
          res.status(200).send({
            msg:`Welcome ${admin.adminname}`,
            admin
        })
          if(!admin){
            res.send(404).send({msg:'Admin doesnt exit!'})
          } 
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//User auth Middlerware
const protectUser=async(req,res,next)=>{
    let token
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        try{
            //get token from headers
            token=req.headers.authorization.split(' ')[1]
            //verify token
            const decoded=jwt.verify(token,process.env.JWT_USER_SECRET);
            //get user from the token
            req.user=await User.findById(decoded.id).select('password')
            next()
  
        }catch (error){
            res.status(401).send({msg:'Not Authorised☠'})
        }
    }
    if(!token){
      res.status(401).send({msg:'No Token Available☠'})
    }
  };

//Admin auth Middlerware
const protectAdmin=async(req,res,next)=>{
    let token
    if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
        try{
            //get token from headers
            token=req.headers.authorization.split(' ')[1]
            //verify token
            const decoded=jwt.verify(token,process.env.JWT_ADMIN_SECRET);
            //get user from the token
            req.user=await Admin.findById(decoded.id).select('password')
            next()
  
        }catch (error){
            res.status(401).send({msg:'Not Authorised☠'})
        }
    }
    if(!token){
      res.status(401).send({msg:'No Token Available☠'})
    }
  };
  
  //generate User token
  const generateUserToken=(id)=>{
    return jwt.sign({id},process.env.JWT_USER_SECRET,{
        expiresIn:'309d'
    })
  };

  //generate Admin token
  const generateAdminToken=(id)=>{
    return jwt.sign({id},process.env.JWT_ADMIN_SECRET,{
        expiresIn:'3d'
    })
  };

  //get verify
  const verify=async(req,res)=>{
    try {
      res.status(200).send(true)
    } catch (error) {
      console.log(error.message)
      res.status(401).send({msg:'Not Authorised☠'})
    }
  }

//get all users (admin only)
const getUsers=async(req,res)=>{
    try {
        const users=await User.find({});
        res.status(200).send(users) 
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//getUserInfo
const getUserInfo=async(req,res)=>{
    try {
        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(404).send({msg:'No such User'})
          } 
          const info=await User.findById({_id:id});
          res.status(200).send(info);
          if(!info){
            res.status(400).send({msg:"User doesn't exit!"})
          }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//delete a user (admin only)
const deleteUser=async(req,res)=>{
    try {
        const {userid}=req.params;
        if(!mongoose.Types.ObjectId.isValid(userid)){
            return res.status(404).send({msg:'No such User'})
          } 
          const user=await User.findById({_id:userid});
          const ifAdmin=await Admin.findOneAndDelete({userID:user.id});
          const userDelete=await User.findByIdAndDelete({_id:userid})
          if(userDelete&&ifAdmin){
                res.send({msg:"You have deleted both of this user, Admin and user account!",user})
            }else if(userDelete){
                res.send({msg:'User Deleted',user});
            }else{
              res.status(404).send({msg:"User can't be deleted!"});
          }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//delete a admin (admin only)
const deleteAdmin=async(req,res)=>{
    try {
        const {adminid}=req.params;
        if(!mongoose.Types.ObjectId.isValid(adminid)){
            return res.status(404).send({msg:'No such Admin'})
          } 
          const admin=await Admin.findByIdAndDelete({_id:adminid});
          if(admin){
                res.send({msg:"Admin deleted",admin})
            }else{
              res.status(404).send({msg:"Admin can't be deleted!"});
          }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//delete any data (admin only)
const adminDeleteAnyData=async(req,res)=>{
    try {
        const {dataid}=req.params;
        if(!mongoose.Types.ObjectId.isValid(dataid)){
            return res.status(404).send({msg:"No such Audio"})
          } 
          const deleteData=await Audio.findByIdAndDelete({_id:dataid})
          if(deleteData){
              res.status(200).send({msg:'Audio deleted!',deleteData});
            }else{
              res.status(404).send({msg:"Audio can't be deleted!"})
          }
    } catch (error) {
        res.status(500).send(error.message) 
    }
}

//get all  data (users and admins)
const getData=async(req,res)=>{
    try {
        const data=await Audio.find({});
        res.send(data);
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//delete a data (only the user who added the data can delete it)
const deleteData=async(req,res)=>{
    try {
        const {dataid}=req.params;
        if(!mongoose.Types.ObjectId.isValid(dataid)){
            return res.status(404).send({msg:"No such Audio"})
          } 
          const dataFound=await Audio.findById({_id:dataid});
          if(dataFound){
            const {userID}=req.body;
            const userDeletes=await Audio.findOneAndDelete({userID})
            if(userDeletes){
                res.status(200).send({msg:"Audio deleted",userDeletes})
            }else if(!userDeletes){
                res.status(400).send({msg:"You can't delete this audio!"})
            }
            }else if(!dataFound){
            res.status(404).send({msg:"Can't delete twice!"})
          }

    } catch (error) {
        res.status(500).send(error.message) 
    }
}

//upload an audio
const uploadAudio=async(req,res)=>{
   try {
    const {userID,pic,username,audioURL}=req.body;
    const audio= await Audio.create({
        userID,pic,username,audioURL
    })
    res.status(200).send({msg:'Audio sent successful',audio})
   } catch (error) {
    res.status(500).send({msg:"Failed to send!"});
   }
}

module.exports={
    protectUser,
    protectAdmin,
    verify,
    registerUser,
    loginUser,
    getUserInfo,
    deleteUser,
    getData,
    deleteData,
    uploadAudio,
    getUsers,
    loginAdmin,
    registerAdmin, 
    getAllAdmin,
    getAdminInfo,
    deleteAdmin,
    adminDeleteAnyData,
}