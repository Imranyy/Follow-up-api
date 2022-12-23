const User=require('../models/userModel');
const Admin=require('../models/adminModel');
const Chat=require('../models/chatModel');
const Topic=require('../models/topicModel');
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
require('dotenv').config();

//register user
const registerUser=async(req,res)=>{
        try {
            const {pic, username, email, password}=req.body;
            if(pic&&username&&email&&password){
                //check if user exist in the db
                const userExit=await User.findOne({email});
                const userEmail=await User.findOne({username});
                if(userExit||userEmail){
                    res.send({error:'User already exist!'});
                }else{
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
                            msg:'Sign up successful',
                            _id:newUser.id,
                            pic:newUser.pic,
                            username:newUser.username,
                            email:newUser.email,
                            token:generateUserToken(newUser.id)
                        })
                    }else{
                        res.status(201).send({error:'Invalid User Data!'})
                    }
                }
            }else{
                res.send({error:'Enter all fields'});
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
            res.status(200).send({msg:`Welcome ${user.username}`,
                _id:user.id,
                pic:user.pic,
                username:user.username,
                email:user.email, 
                token:generateUserToken(user.id)
            })
        }else{
            res.status(400).send({error:'Invalid Credentials'})
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
            return res.status(404).send({error:'Must be a valid user so that you can register for admin roles'})
          }
          const validUser=await User.findById({_id:userid})
          if(validUser){
            const {pic,username,password,email}=req.body;
            if(pic&&username&&password&&email){
                //check if admin exist in the db
                const adminExit=await Admin.findOne({userID:userid});
                if(adminExit){
                    res.send({error:'Admin exists already!'});
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
                res.send({error:'Enter All the required fields'})
            }
          }else{
            res.status(404).send({error:'Must be a valid user so that you can register for admin roles'});
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
        res.status(400).send({error:'Invalid Credentials'})
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
            return res.status(404).send({error:'No such Admin'})
          }
          const admin=await Admin.findById({_id:id});
          res.status(200).send({
            msg:`Welcome ${admin.adminname}`,
            admin
        })
          if(!admin){
            res.send(404).send({error:'Admin doesnt exit!'})
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
            res.status(401).send({error:'Not Authorised☠'})
        }
    }
    if(!token){
      res.status(401).send({error:'No Token Available☠'})
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
            res.status(401).send({error:'Not Authorised☠'})
        }
    }
    if(!token){
      res.status(401).send({error:'No Token Available☠'})
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
      res.status(401).send({error:'Not Authorised☠'})
    }
  }

//get all users (admin only and users)
const getUsers=async(req,res)=>{
    try {
        const users=await User.find({}).sort({createdAt:-1});
        res.status(200).send(users) 
    } catch (error) {
        res.status(500).send(error.message)
    }
}

//getUserInfo
const getUserInfo=async(req,res)=>{
    try {
        const {username}=req.params;
          const info=await User.findOne({username});
          if(info){
              res.status(200).send(info);
            }else{
              res.status(400).send({error:"User doesn't exit!"})
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
            return res.status(404).send({error:'No such User'})
          } 
          const user=await User.findById({_id:userid});
          const ifAdmin=await Admin.findOneAndDelete({userID:user.id});
          const userDelete=await User.findByIdAndDelete({_id:userid})
          if(userDelete&&ifAdmin){
                res.send({msg:"You have deleted both of this user, Admin and user account!",user})
            }else if(userDelete){
                res.send({msg:'User Deleted',user});
            }else{
              res.status(404).send({error:"User can't be deleted!"});
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
            return res.status(404).send({error:'No such Admin'})
          } 
          const admin=await Admin.findByIdAndDelete({_id:adminid});
          if(admin){
                res.send({msg:"Admin deleted",admin})
            }else{
              res.status(404).send({error:"Admin can't be deleted!"});
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
            return res.status(404).send({error:"No such Audio"})
          } 
          const deleteData=await Chat.findByIdAndDelete({_id:dataid})
          if(deleteData){
              res.status(200).send({msg:'Audio deleted!',deleteData});
            }else{
              res.status(404).send({error:"Audio can't be deleted!"})
          }
    } catch (error) {
        res.status(500).send(error.message) 
    }
}

//get all  data (users and admins)
// const getData=async(req,res)=>{
//     try {
//         const data=await Chat.find({});
//         res.send(data);
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// }

//delete a data (only the user who added the data can delete it)
const deleteData=async(req,res)=>{
    try {
        const {dataid}=req.params;
        if(!mongoose.Types.ObjectId.isValid(dataid)){
            return res.status(404).send({error:"No such Audio"})
          } 
          const dataFound=await Chat.findById({_id:dataid});
          if(dataFound){
            const {userID}=req.body;
            const userDeletes=await Chat.findOneAndDelete({userID})
            if(userDeletes){
                res.status(200).send({msg:"Audio deleted",userDeletes})
            }else if(!userDeletes){
                res.status(400).send({error:"You can't delete this audio!"})
            }
            }else if(!dataFound){
            res.status(404).send({error:"Can't delete twice!"})
          }

    } catch (error) {
        res.status(500).send(error.message) 
    }
}

//upload a message
// const uploadMessage=async(req,res)=>{
//    try {
//     const {userID,pic,username,message}=req.body;
//     if(userID&&pic&&username&&message){
//         await Chat.create({
//             userID,pic,username,message
//         })
//         res.status(200).send({msg:'Message Sent'})
//     }else{
//         res.send({error:"Message not sent, please enter all fields"})
//     }
//    } catch (error) {
//     res.status(500).send({error:"Failed to send!",error});
//    }
// }

//upload topics
const uploadTopic=async(req,res)=>{
    try {
        const {userID,pic,adminname,message}=req.body;
        const topicExist=await Topic.findOne({message});
        if(topicExist){
            res.send({error:'This topic exist!'})
        }else{
            if(userID&&pic&&adminname&&message){
                await Topic.create({userID,pic,adminname,message});
                res.status(200).send({msg:"Topic added"})
            }else{
                res.send({error:'Please enter all fields!'})
            }
        }
    } catch (error) {
        res.status(500).send({error:error.message});
    }
}

//getAllTopic
const getTopics=async(req,res)=>{
    try {
        const getTopic=await Topic.find({})
        res.status(200).send(getTopic)
    } catch (error) {
        res.status(500).send({error:error.message});
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
    // getData,
    deleteData,
    // uploadMessage,
    getUsers,
    loginAdmin,
    registerAdmin, 
    getAllAdmin,
    getAdminInfo,
    deleteAdmin,
    adminDeleteAnyData,
    uploadTopic,
    getTopics,
}