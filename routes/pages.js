const express=require('express');
const {requireAuth} = require('../middleware/authmiddleware');
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
router.get('/home', requireAuth, (req,res)=>{
    res.render('home',{message:false});
});
router.get('/profile', requireAuth, (req,res)=>{
    res.render('profile',{message:false});
});
router.get('/logout', requireAuth ,(req,res)=>{
    res.render('login',{message:false});
});
router.post('/edit', requireAuth ,(req,res)=>{
    res.render('edit',{message:"Leave any detail as it is if changes are not required"});
});
module.exports= router;