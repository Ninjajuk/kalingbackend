const express =require('express');
const { router: ordersRouter }  = require('./router/Order');
const cors = require('cors');
require('dotenv').config();

const app=express()
const port=3030
// const databaseUrl = process.env.DATABASE_URL;



//middlewares
app.use(express.json());// to parse req.body
app.use(cors());
app.use('/orders', ordersRouter);



app.get('/',(req,resp)=>{
    resp.send('<h1>Hi Samsu</h1>')
  })

app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
  })