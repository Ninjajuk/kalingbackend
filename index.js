require('dotenv').config();
const express =require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const {  router:ordersRouter }  = require('./router/Order');
const {  router:productrouter }  = require('./router/product');
const {  router:authRoute }  = require('./router/auth');
const {  router:cartRoute }  = require('./router/Cart');
const {  router:usersroute }  = require('./router/User');
const cors = require('cors');


const app=express()
const PORT=process.env.PORT || 8000
const databaseUrl = process.env.DATABASE_URL;



//middlewares
app.use(express.json());// to parse req.body 
app.use(cors());
app.use(cookieParser());
app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);
app.use('/auth',authRoute)
app.use('/cart',  cartRoute);
app.use('/users',  usersroute);
// app.use('/cart', isAuth(), cartRoute);
app.use('/orders', ordersRouter);
app.use('/products', productrouter);


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
  // document.cookie('User=Samsu')
    resp.send('<h1>Hi Samsu</h1>')
  })

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
  })