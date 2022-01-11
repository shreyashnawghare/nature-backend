const express = require("express");
const router = express.Router();
const cors = require("cors");
const Order = require("../models/orderModel");

const auth = require("../middleware/authMiddleware");
router.use(cors());
router.route("/").post(auth, async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(200).json(createdOrder);
  }
 
});
 

router.route("/:id").get(auth, async (req, res) => {
  const order=await Order.findById(req.params.id).populate('user','name email');

  if(order){
      res.json(order)
  }else{
      res.status(404).json({message:'order not found'})
  }
});

router.route("/:id/pay").put(auth, async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
   order.isPaid=true;
   order.paidAt=Date.now();
   order.paymentResult={
       id:req.body.id,
       status:req.body.status,
       update_time:req.body.update_time,
       email_address:req.body.payer.email_address
   }
   const updatedOrder=await order.save()
   res.json(updatedOrder)
  } else {
    res.status(404).json({ message: "order not found" });
  }
});

module.exports = router;