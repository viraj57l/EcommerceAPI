const express =require('express')
const mongoose =require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/useRoutes')
const cors = require('cors');

const app =express();



//middleware parser
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true, // If you're using cookies or authorization headers, this can be removed if not needed
}));



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