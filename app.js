const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser=require("cookie-parser");
dotenv.config({path : './.env'})

const app = express();

const db= mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '17/Eng/099',
    database:'blog'
})

app.set('view engine','ejs');

db.connect((error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("connected")
    }
})

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended:false}));
app.use(express.json());
app.use(cookieParser())

app.use('/',require('./routes/pages'));
app.use('/auth',require('./routes/auth'));

app.listen(3000,()=>{
    console.log("beautiful")
})