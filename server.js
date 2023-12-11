const express =require('express');
const { router: ordersRouter }  = require('./router/Order');
const cors = require('cors');

const app=express()
const port=3030

// const url='mongodb+srv://samsu:ninjaking@cluster0.hne9oli.mongodb.net/products?retryWrites=true&w=majority'

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