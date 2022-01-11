const express= require('express');
const dotenv= require('dotenv');
const cors=require('cors')
const connectDB=require('./config/db')
dotenv.config();
connectDB();
const port=process.env.PORT || 6000
const app=express();
const productRoutes =require('./routes/productRoutes');
const usersRoutes=require('./routes/userRoutes');
const orderRoutes=require('./routes/orderRoutes');


app.use(cors());
app.use(express.json())
app.get('/',(req,res)=>{
    res.send('Api is running..')
}) 

app.use('/api/products',productRoutes)
app.use('/api/users/',usersRoutes)
app.use('/api/orders',orderRoutes)

app.get('/api/config/paypal',(req,res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID)
})

app.listen(port,console.log(`server running on port ${port}`))