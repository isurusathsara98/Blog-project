const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config({path : './.env'})

const app = express();

const db= mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '17/Eng/099',
    database:'blog'
})

db.connect((error)=>{
    if(error){
        console.log(error)
    }
    else{
        console.log("connected")
    }
})

app.get("/",(req, res)=>{
    res.send("<h1>Home</h1>")
});

app.listen(3000,()=>{
    console.log("beautiful")
})