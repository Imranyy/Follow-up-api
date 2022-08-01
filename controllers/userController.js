const User=require('../models/userModel')
const mongoose=require('mongoose')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken')
require('dotenv').config()
const asyncHandler=require('express-async-handler');

//register controller
const register=asyncHandler(async(req,res)=>{
 const {name,number,password,pic}=req.body;
 const validNumber=(userNumber)=>{
  return /^[0]\d{2}\d{3}\d{4}/.test(userNumber);
}
if(!name||!number||!password){
  res.status(400).send('Please add fields')
}else if(!validNumber(number)){
  return res.send('Invalid moblie number')
}
//check if user exist
const userExist=await User.findOne({number});
if(userExist){
  res.status(400).send('User already Exists!!')
}
//Hashing password 
const salt=await bcrypt.genSalt(10)
const hashedPassword=await bcrypt.hash(password,salt);
//create user
const user=await User.create({
  name,
  pic, 
  number,
  password:hashedPassword
  
})
if(user){
  res.status(201).send({
      _id:user.id,
      pic:user.pic,
      name:user.name,
      number:user.number,
      token:generateToken(user.id)
  })
}else{
  res.status(400).send('Invalid User Data')
}
})

//login controller
const login=asyncHandler(async(req,res)=>{
  const {number,password}=req.body
 const user=await User.findOne({number})
 if(user&&(await bcrypt.compare(password,user.password))){
  res.send({
      _id:user.id,
      pic:user.pic,
      name:user.name,
      number:user.number, 
      token:generateToken(user.id)
  })
}else{
  res.status(400).send('Invalid Credentials')
}
})
//get users
const getUsers=asyncHandler(async(req,res)=>{
  try{
    const user=await User.find({});
    res.status(200).send(user)
  }catch(error){
    console.log(error.message)
    res.send(error.message)
  }
})

//patch image
const updateimg=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send({error:'No such User'})
    } 
    const updateAccount=await User.findOneAndUpdate({_id: id},{
        ...req.body
    })
    if(!updateAccount){
        return res.status(400).send({error:'No such User'})
      }
      res.status(200).send('updated')

})

//auth Middlerware
const protect=asyncHandler(async(req,res,next)=>{
  let token
  if(req.headers.authorization&&req.headers.authorization.startsWith('Bearer')){
      try{
          //get token from headers
          token=req.headers.authorization.split(' ')[1]
          //verify token
          const decoded=jwt.verify(token,process.env.JWT_SECRET);
          //get user from the token
          req.user=await User.findById(decoded.id).select('password')
          next()

      }catch (error){
          console.log(error)
          res.status(401).send('Not Authorised☠☠')
          throw new Error('Not Authorized')
      }
  }
  if(!token){
    res.status(401).send('Not Authorised, No Token Available☠☠')
      throw new Error('Not Authorized, No Token Available')
  }
});

//generate token
const generateToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:'309d'
  })
};
//get verify
const verify=async(req,res)=>{
  try {
    res.status(200).send(true)
  } catch (error) {
    console.log(error.message)
    res.status(401).send('Not Authorised☠')
  }
}

module.exports={
    register,
    login,
    verify,
    protect,
    getUsers,
    updateimg
}