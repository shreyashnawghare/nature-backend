const express = require("express");
const router = express.Router();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const auth=require('../middleware/authMiddleware')
const generateToken=require("../utils/generateToken")
router.use(cors());

router.route("/login").post (async (req, res) => {
  const {email,password} = req.body;
  const user=await User.findOne({email})
  if(user && (await user.matchPassword(password))){
      res.json({
          _id:user._id,
          name:user.name,
          email:user.email,
          isAdmin:user.isAdmin,
          token:generateToken(user._id)
      })
  }else{
      res.status(401).json({message:'Invalid email or password'})
  }
});

router.route('/profile').get(auth,async(req,res)=>{
    const user=await User.findById(req.user._id);
    if(user){
    res.json({
      _id:user._id,
          name:user.name,
          email:user.email,
          isAdmin:user.isAdmin,
})
}
})

router.route('/').post(async (req,res)=>{
     let {name, email, password } = req.body;
     const userExists = await User.findOne({ email });
     if(userExists){
         res.status(400).json({message:'User already exists'})
     }
     const salt=await bcrypt.genSalt(10);
     password=await bcrypt.hash(password,salt);
     const user=await User.create({
         name,email,password
     })
     if(user){
         res.status(200).json({
           _id: user._id,
           name: user.name,
           email: user.email,
           isAdmin: user.isAdmin,
           token: generateToken(user._id),
         });
     }else{
         res.status(400).json({message:'Invalid user data'})
     }
     
})

router.route("/profile").put(auth, async (req, res) => {
 const user = await User.findById(req.user._id);

 if (user) {
   user.name = req.body.name || user.name;
   user.email = req.body.email || user.email;
   if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(req.body.password, salt);
     user.password = password;
   }

   const updatedUser = await user.save();

   res.json({
     _id: updatedUser._id,
     name: updatedUser.name,
     email: updatedUser.email,
     isAdmin: updatedUser.isAdmin,
     token: generateToken(updatedUser._id),
   });
 } else {
   res.status(404).json({ message: "User not found" });
 }
});
module.exports = router;