const express =require('express')
const mongoose =require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const userRoutes = require('./routes/useRoutes')
const cors = require('cors');

const app =express();

// const allowedOrigins = ['https://ecommerce-react-app-chi.vercel.app', 'https://ecommerce-react-8jyvgqzn4-viraj57ls-projects.vercel.app'];

//middleware parser
app.use(express.json());
app.use(cookieParser());

// app.use(cors({
//     origin: function (origin, callback) {
//         if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
//     methods: 'GET,POST,PUT,DELETE',
//     credentials: true
// }));

app.use(cors());

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