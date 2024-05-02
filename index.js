require('dotenv').config();
const express =require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const cookieParser = require('cookie-parser');

const {  router:ordersRouter }  = require('./router/Order');
const {  router:productrouter }  = require('./router/product');
const {  router:authRoute }  = require('./router/auth');
const {  router:cartRoute }  = require('./router/Cart');

const { isAuth, sanitizeUser, cookieExtractor } = require('./services/helper');



const app=express()
const PORT=process.env.PORT || 8000
const databaseUrl = process.env.DATABASE_URL;



//middlewares
// app.use(express.json());// to parse req.body 
// app.use(cors());
app.use('/auth',authRoute)
app.use('/cart',  cartRoute);
// app.use('/cart', isAuth(), cartRoute);
app.use('/orders', ordersRouter);
app.use('/products', productrouter);

// app.use(passport.initialize())
// app.use(passport.session())

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
app.use(passport.authenticate('session'));
app.use(
  cors({
    exposedHeaders: ['X-Total-Count'],
  })
);
app.use(express.json());// to parse req.body 


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
  // req.session.isAuth=true
  // console.log(req.session)
  // console.log(req.session.id)
    resp.send('<h1>Hi Samsu</h1>')
  })

app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
  })