const express=require('express')

const cors = require('cors');

const app=express()
const port=3030
app.use(express.json());

app.get('/',(req,resp)=>{
    resp.send('<h1>Hi Samsu</h1>')
  })
app.listen(port,()=>{
    console.log(`Server is running at port ${port}`)
  })