const jwt =require('jsonwebtoken');
const User = require('../models/userModel');

const auth=async(req,res,next)=>{
    if (req.headers.authorization.length) {
     try{
       const data = await jwt.verify(
         req.headers.authorization,
         process.env.JWT_KEY
       );
          req.user = await User.findById(data.id);
       next();
     }
     catch(err){
         res.status(401).json({ message: "Not authorized, token failed" });
     }
    
    } else {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
}
module.exports=auth;