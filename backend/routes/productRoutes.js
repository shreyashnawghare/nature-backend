const express=require('express');
const router=express.Router();
const cors=require('cors');
const Product=require('../models/productModel');
router.use(cors());

router.get("/", async (req, res) => {
    const products= await Product.find({})
  res.json(products);
});
router.get("/:id", async(req, res) => {
 try{  
       const product = await Product.findById(req.params.id);
       if (product) {
         res.json(product);
         
       } else {
         res.json({ message: "Product not found" });
       }
 }catch(err){
     res.json({ message: "Product not found" });
      console.log('Error',err)
 }
 
});

module.exports=router;