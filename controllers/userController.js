const mongoose=require('mongoose');
const User=require('../models/userModel')

//register controller
const register=async(req,res)=>{

}

//login controller
const login=async(req,res)=>{

}
//get verify
const verify=async(req,res)=>{
  try {
    res.status(400).send(true)
  } catch (error) {
    res.send(error.message)
  }
}

module.exports={
    register,
    login,
    verify,
}