require('dotenv').config();
const Users = require('../models/userModels');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userCtrl = {
  register: async(req,res) => {
      try{
          const {name,email,password} = req.body;

          const user = await Users.findOne({email})
          if(user) return res.status(400).json({msg:"Email Already Registered"})

          if(password.length < 6)
          return res.status(400).json({msg:"Password is at least 6 character"})

          //Password Encryption
          const passwordHash = await bcrypt.hash(password,10)

          const newUser = new Users({
              name,email,password:passwordHash
          })

          //Save mongodb
          await newUser.save()

          //create jwt to authenticate
          const accesstoken = createAccessToken({id:newUser._id})
          const refreshtoken = createRefreshToken({id:newUser._id})

          res.cookie('refreshtoken', refreshtoken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            path: '/user/refresh_token',
            sameSite: 'None'            
          })
          res.json({accesstoken})

      }
      catch(err){
          return res.status(500).json({msg:err.message})
      }
  },
  refreshtoken: async(req,res) => {

      try{
          const rf_token = req.cookies.refreshtoken ||  req.body.token ;
          console.log(rf_token)
          if(!rf_token) return res.status(401).json({msg:"No refresh Token provided"});
  
          jwt.verify(rf_token,process.env.REFRESH_TOKEN_SECRET,(err,user) => {
              if(err) return res.status(403).json({msg:"Invalid refresh token"})
              const accesstoken = createAccessToken({id:user.id})
          res.json({user,accesstoken})
          })
  
      }
      catch(err){
          return res.status(500).json({msg:err.message})
      }
     

  },

  login: async(req,res) =>{
    try{
      const {email,password} = req.body;
      
      const user =await Users.findOne({email})
      if(!user) return res.status(400).json({msg:"User does not exist"})
      
      const isMatch =await bcrypt.compare(password,user.password)

      if(!isMatch) return res.status(400).json({msg:"Incorrect Password "})
      
      const accesstoken= createAccessToken({id:user._id})
      const refreshtoken =createRefreshToken({id:user._id})
    
      res.cookie('refreshtoken',refreshtoken,{
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        path: '/user/refresh_token',
        sameSite: 'None'
      });

      res.json({accesstoken})
    }
    catch(err){
      return res.status(500).json({msg:err.message})
    }
  },
  logout : async(req,res)=>{
    try{
      res.clearCookie('refreshtoken',{path:'/user/refresh_token'})
      return res.json({msg:"Log out"})
    }
    catch(err){
      return res.status(500).json({ msg: err.message });  
    }
  },

  getUser:async(req,res)=>{

    try{
      const user= await Users.findById(req.user.id).select('-password')
      if(!user) return res.status(400).json({msg:"User not Found"})
      res.json(user)
    }catch(err){
      return res.status(500).json({ msg: err.message });  
    }
  }
} 

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

module.exports = userCtrl;
