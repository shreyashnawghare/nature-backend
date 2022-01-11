const mongoose= require('mongoose');

const connectDB= async()=>{
    try{
        const connect=await mongoose.connect(process.env.DB_URL,{
            useUnifiedTopology:true,
            useNewUrlParser:true,
            useCreateIndex:true
        })
        console.log(`${connect.connection.host}`)
    }catch(err){
        console.log(err.message);
        process.exit(1)
    }
}

module.exports=connectDB;