const express =require('express')
const mongoose =require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/useRoutes')

const app =express();

//middleware parser
app.use(express.json());
app.use(cookieParser());

const PORT =process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.json({msg:"This is example"})
})

app.listen(PORT,()=>{
    console.log("Server is running");
})

//Routes

app.use('/user',userRoutes)
app.use('/api',require('./routes/categoryRouter'))
app.use('/api',require('./routes/productRouter'))





//connect mongoDB

const URI =process.env.MONGODB_URL;

mongoose.connect(URI,{
}).then(()=>{
    console.log("MongoDB Connected");
}).catch(err=>{
    console.log(err);
})