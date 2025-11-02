const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.send({message:'Helo'})
})
app.listen(PORT,()=>{
    console.log(`Server is running  at ${PORT}`)
})