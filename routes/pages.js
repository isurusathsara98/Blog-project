const express=require('express');

const router=express.Router();

router.get('/',(req,res)=>{
    res.render('index');
});

router.get('/register',(req,res)=>{
    res.render('register',{message:false});
});

router.get('/login',(req,res)=>{
    res.render('login',{message:false});
});

module.exports= router;