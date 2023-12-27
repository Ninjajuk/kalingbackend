require('dotenv').config();
const express =require('express');
const mongoose = require('mongoose');
const {  router:ordersRouter }  = require('./router/Order');
const {  router:productrouter }  = require('./router/product');
const {  router:authRoute }  = require('./router/auth');
const cors = require('cors');


const app=express()
const PORT=process.env.PORT || 5000
const databaseUrl = process.env.DATABASE_URL;



//middlewares
app.use(express.json());// to parse req.body 
app.use(cors());
app.use('/auth',authRoute)
app.use('/orders', ordersRouter);
app.use('/products', productrouter);



// async function main() {
//   await mongoose.connect(process.env.MONGODB_URL);
//   console.log('database connected');
// }

async function ConnectToDb(){
  try{
    await mongoose.connect(process.env.DATABASE_URL)
    console.log("database Connected MongoDb")
  }
  catch(error){
    console.log(error)
  }
}
ConnectToDb()

app.get('/',(req,resp)=>{
    resp.send('<h1>Hi Samsu</h1>')
  })

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
  })