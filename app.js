const express = require('express');
const userRouter = require('./routes/user.routes');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index.routes');
const app=express();

connectDB();

app.set('view engine','ejs');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/user',userRouter)
app.use('/',indexRouter)

app.listen(3000, () =>{
    console.log('listening on port 3000');
})